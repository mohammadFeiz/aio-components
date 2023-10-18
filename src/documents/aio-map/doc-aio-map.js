import React, { Component,createRef } from 'react';
import DOC from '../../resuse-components/doc';
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import AIOMap from './../../npm/aio-map/aio-map';
import AIOInput from './../../npm/aio-input/aio-input';
import './index.css';
import {Icon} from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight,mdiOfficeBuilding,mdiGift } from '@mdi/js';
export default class DOC_AIOMap extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                navId='apiKeys'
                navs={[
                    { text: 'apiKeys', id: 'apiKeys', COMPONENT: () => <APIKeys /> },
                    { text: 'draggable', id: 'draggable', COMPONENT: () => <Draggable /> },
                    { text: 'zoomable', id: 'zoomable', COMPONENT: () => <Zoomable /> },
                    { text: 'traffic', id: 'traffic', COMPONENT: () => <Traffic /> },
                    { text: 'onClick', id: 'onClick', COMPONENT: () => <OnClick /> },
                    { text: 'onClose', id: 'onClose', COMPONENT: () => <OnClose /> },
                    { text: 'title', id: 'title', COMPONENT: () => <Title /> },
                    { text: 'showMarker', id: 'showMarker', COMPONENT: () => <ShowMarker /> },
                    { text: 'latitude , longitude , zoom', id: 'latlngzoom', COMPONENT: () => <LatLngZoom /> },
                    { text: 'onChange', id: 'onChange', COMPONENT: () => <OnChange /> },
                    { text: 'onSubmit', id: 'onSubmit', COMPONENT: () => <OnSubmit /> },
                    { text: 'area', id: 'area', COMPONENT: () => <Area /> },
                    { text: 'markers', id: 'markers', COMPONENT: () => <Markers /> },
                    { text: 'search', id: 'search', COMPONENT: () => <Search /> },
                    { text: 'popup', id: 'popup', COMPONENT: () => <Popup /> },
                ]}
            />
        )
    }
}
class APIKeys extends Component {
    constructor(props){
        super(props);
        this.mapInstance = new AIOMap({
            apiKeys:{
                map:'web.0a2aa5f83d314a8c9916473aa0e01438',
                service:'service.09a2234e299a4ff585007b2894df9fca',
            }
        })
    }
    preview() {
        return (
            <div className='example'>
                {this.mapInstance.render()}
                {
                    AIODoc().Code(`
let map = new AIOMap({
    apiKeys:{
        map:'web.0a2aa5f83d314a8c9916473aa0e01438',
        service:'service.09a2234e299a4ff585007b2894df9fca',
    }
})

return map.render()
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Draggable extends Component {
    constructor(props){
        super(props);
        this.mapInstance = new AIOMap({
            apiKeys:{
                map:'web.0a2aa5f83d314a8c9916473aa0e01438',
                service:'service.09a2234e299a4ff585007b2894df9fca',
            }
        })
    }
    preview() {
        return (
            <div className='example'>
                {this.mapInstance.render({draggable:false})}
                {
                    AIODoc().Code(`
let map = new AIOMap({
    apiKeys:{
        map:'web.0a2aa5f83d314a8c9916473aa0e01438',
        service:'service.09a2234e299a4ff585007b2894df9fca',
    }
})
return map.render({draggable:false})
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
        this.mapInstance = new AIOMap({
            apiKeys:{
                map:'web.0a2aa5f83d314a8c9916473aa0e01438',
                service:'service.09a2234e299a4ff585007b2894df9fca',
            }
        })
    }
    preview() {
        return (
            <div className='example'>
                {this.mapInstance.render({zoomable:false})}
                {
                    AIODoc().Code(`
let map = new AIOMap({
    apiKeys:{
        map:'web.0a2aa5f83d314a8c9916473aa0e01438',
        service:'service.09a2234e299a4ff585007b2894df9fca',
    }
})
return map.render({zoomable:false})
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Traffic extends Component {
    constructor(props){
        super(props);
        this.mapInstance = new AIOMap({
            apiKeys:{
                map:'web.0a2aa5f83d314a8c9916473aa0e01438',
                service:'service.09a2234e299a4ff585007b2894df9fca',
            }
        })
    }
    preview() {
        return (
            <div className='example'>
                {this.mapInstance.render({traffic:true})}
                {
                    AIODoc().Code(`
let map = new AIOMap({
    apiKeys:{
        map:'web.0a2aa5f83d314a8c9916473aa0e01438',
        service:'service.09a2234e299a4ff585007b2894df9fca',
    }
})
return map.render({traffic:true})
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}

class OnClick extends Component {
    constructor(props){
        super(props);
        this.mapInstance = new AIOMap({
            apiKeys:{
                map:'web.0a2aa5f83d314a8c9916473aa0e01438',
                service:'service.09a2234e299a4ff585007b2894df9fca',
            },
            onClick:()=>alert('you clicked map')
        })
    }
    
    preview() {
        return (
            <div className='example'>
                {this.mapInstance.render()}
                {
                    AIODoc().Code(`
let map = new AIOMap({
    apiKeys:{
        map:'web.0a2aa5f83d314a8c9916473aa0e01438',
        service:'service.09a2234e299a4ff585007b2894df9fca',
    },
    onClick:()=>alert('you clicked map')
})
return map.render()
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnClose extends Component {
    constructor(props){
        super(props);
        this.mapInstance = new AIOMap({
            apiKeys:{
                map:'web.0a2aa5f83d314a8c9916473aa0e01438',
                service:'service.09a2234e299a4ff585007b2894df9fca',
            },
            onClose:()=>alert('you closed map')
        })
    }
    
    preview() {
        return (
            <div className='example'>
                {this.mapInstance.render()}
                {
                    AIODoc().Code(`
let map = new AIOMap({
    apiKeys:{
        map:'web.0a2aa5f83d314a8c9916473aa0e01438',
        service:'service.09a2234e299a4ff585007b2894df9fca',
    },
    onClose:()=>alert('you closed map')                
})
return map.render()
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class Title extends Component {
    constructor(props){
        super(props);
        this.mapInstance = new AIOMap({
            apiKeys:{
                map:'web.0a2aa5f83d314a8c9916473aa0e01438',
                service:'service.09a2234e299a4ff585007b2894df9fca',
            },
            title:'نمایش موقعیت'
        })
    }
    
    preview() {
        return (
            <div className='example'>
                {this.mapInstance.render()}
                {
                    AIODoc().Code(`
let map = new AIOMap({
    apiKeys:{
        map:'web.0a2aa5f83d314a8c9916473aa0e01438',
        service:'service.09a2234e299a4ff585007b2894df9fca',
    },
    title:'نمایش موقعیت'
})
return map.render()
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class ShowMarker extends Component {
    constructor(props){
        super(props);
        this.mapInstance = new AIOMap({
            apiKeys:{
                map:'web.0a2aa5f83d314a8c9916473aa0e01438',
                service:'service.09a2234e299a4ff585007b2894df9fca',
            },
            showMarker:false
        })
    }
    
    preview() {
        return (
            <div className='example'>
                {this.mapInstance.render()}
                {
                    AIODoc().Code(`
let map = new AIOMap({
    apiKeys:{
        map:'web.0a2aa5f83d314a8c9916473aa0e01438',
        service:'service.09a2234e299a4ff585007b2894df9fca',
    },
    showMarker:false
})
return map.render()
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class LatLngZoom extends Component {
    constructor(props){
        super(props);
        this.mapInstance = new AIOMap({
            apiKeys:{
                map:'web.0a2aa5f83d314a8c9916473aa0e01438',
                service:'service.09a2234e299a4ff585007b2894df9fca',
            }
        })
        this.state = {latitude:35.694739,longitude:51.394097,zoom:14}
    
    }
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
                {this.mapInstance.render({latitude,longitude,zoom})}
                {
                    AIODoc().Code(`
let map = new AIOMap({
    apiKeys:{
        map:'web.0a2aa5f83d314a8c9916473aa0e01438',
        service:'service.09a2234e299a4ff585007b2894df9fca',
    }
})
return map.render({latitude:${latitude},longitude:${longitude},zoom:${zoom}})
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
        this.mapInstance = new AIOMap({
            apiKeys:{
                map:'web.0a2aa5f83d314a8c9916473aa0e01438',
                service:'service.09a2234e299a4ff585007b2894df9fca',
            },
            onChange:(latitude,longitude)=>{
                this.setState({latitude,longitude})
            }
        })
        this.state = {latitude:35.694739,longitude:51.394097}
    }
    preview() {
        let {latitude,longitude} = this.state;
        return (
            <div className='example'>
                <span>{`latitude = ${latitude}`}</span>
                <span>{`longitude = ${longitude}`}</span>
                {this.mapInstance.render({latitude,longitude})}
                {
                    AIODoc().Code(`
let map = new AIOMap({
    apiKeys:{
        map:'web.0a2aa5f83d314a8c9916473aa0e01438',
        service:'service.09a2234e299a4ff585007b2894df9fca',
    },
    onChange:(latitude,longitude)=>{
        this.setState({latitude,longitude})
    }
})
....
let {latitude,longitude} = this.state;
return map.render({latitude,longitude})
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    render() {return (<Example preview={() => this.preview()}/>)}
}
class OnSubmit extends Component {
    constructor(props){
        super(props);
        this.mapInstance = new AIOMap({
            apiKeys:{
                map:'web.0a2aa5f83d314a8c9916473aa0e01438',
                service:'service.09a2234e299a4ff585007b2894df9fca',
            },
            onSubmit:(latitude,longitude)=>this.setState({latitude,longitude})
        })
        this.state = {latitude:35.694739,longitude:51.394097}
    }
    preview() {
        let {latitude,longitude} = this.state;
        return (
            <div className='example'>
                <span>{`latitude = ${latitude}`}</span>
                <span>{`longitude = ${longitude}`}</span>
                {this.mapInstance.render({latitude,longitude})}
                {
                    AIODoc().Code(`
let map = new AIOMap({
    apiKeys:{
        map:'web.0a2aa5f83d314a8c9916473aa0e01438',
        service:'service.09a2234e299a4ff585007b2894df9fca',
    },
    onSubmit:(latitude,longitude)=>this.setState({latitude,longitude})
})
....
let {latitude,longitude} = this.state;
return map.render()
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
        this.mapInstance = new AIOMap({
            apiKeys:{
                map:'web.0a2aa5f83d314a8c9916473aa0e01438',
                service:'service.09a2234e299a4ff585007b2894df9fca',
            }
        })
        this.state = {area:{latitude:35.694739,longitude:51.394097,radius:2000,color:'orange',opacity:0.2}}
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
                                                        type='slider' showValue='inline' style={{width:'100%'}} value={area.opacity} step={0.1} start={0} end={1}
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
                                                        type='color' style={{width:'100%'}} value={area.color}
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
                {this.mapInstance.render({area})}
                {
                    AIODoc().Code(`
let map = new AIOMap({
    apiKeys:{
        map:'web.0a2aa5f83d314a8c9916473aa0e01438',
        service:'service.09a2234e299a4ff585007b2894df9fca',
    }
})
....
let {area} = this.state;
return map.render({
    area:{
        latitude:${area.latitude},
        longitude:${area.longitude},
        radius:${area.radius},
        color:${area.color},
        opacity:${area.opacity}
    }
})
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
        this.mapInstance = new AIOMap({
            apiKeys:{
                map:'web.0a2aa5f83d314a8c9916473aa0e01438',
                service:'service.09a2234e299a4ff585007b2894df9fca',
            }
        })
        this.state = {
            latitude:35.76025287,longitude:51.40858757,
            markers:[
                {
                    latitude:35.76025388385241,longitude:51.40858858823776,size:30,color:'orange',
                    html:<Icon path={mdiOfficeBuilding} size={1}/>,
                    popup:({latitude,longitude})=>latitude
                },
                {
                    latitude:35.76920327411297,longitude:51.40546649694443,size:30,color:'red',
                    html:<Icon path={mdiOfficeBuilding} size={1}/>,
                    popup:({latitude,longitude})=>latitude
                },
                {
                    latitude:35.78097175634515,longitude:51.39394909143448,size:30,color:'red',
                    html:<Icon path={mdiGift} size={1}/>,text:<div style={{color:'#fff',background:'red',padding:'0 12px'}}>this is my text</div>,
                    popup:({latitude,longitude})=>latitude
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
        let {markers,latitude,longitude} = this.state; 
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
                {this.mapInstance.render({latitude,longitude,markers})}
                {
                    AIODoc().Code(`
let map = new AIOMap({
    apiKeys:{
        map:'web.0a2aa5f83d314a8c9916473aa0e01438',
        service:'service.09a2234e299a4ff585007b2894df9fca',
    }
})
....
return map.render({
    latitude:${latitude},longitude:${longitude},
    markers:[
        {
            latitude:35.76025388385241,
            longitude:51.40858858823776,
            size:30,
            color:'orange',
            html:<Icon path={mdiOfficeBuilding} size={1}/>,
            popup:(marker)=>marker.latitude
        },
        {
            latitude:35.76920327411297,
            longitude:51.40546649694443,
            size:30,
            color:'red',
            html:<Icon path={mdiOfficeBuilding} size={1}/>,
            popup:(marker)=>marker.latitude
        },
        {
            latitude:35.78097175634515,
            longitude:51.39394909143448,
            size:30,
            color:'red',
            html:<Icon path={mdiGift} size={1}/>,
            text:<div style={{color:'#fff',background:'red',padding:'0 12px'}}>this is my text</div>,
            popup:(marker)=>marker.latitude
        }
    ]
})
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
        this.mapInstance = new AIOMap({
            apiKeys:{
                map:'web.0a2aa5f83d314a8c9916473aa0e01438',
                service:'service.09a2234e299a4ff585007b2894df9fca',
            },
            onChange:(latitude,longitude)=>{
                this.setState({latitude,longitude})
            },
            search:true
        })
        this.state = {
            latitude:35.694739,longitude:51.394097
        }
    }
    preview() {
        let {latitude,longitude} = this.state;
        return (
            <div className='example'>
                <span>{`latitude = ${latitude}`}</span>
                <span>{`longitude = ${longitude}`}</span>
                {this.mapInstance.render({latitude,longitude})}
                {
                    AIODoc().Code(`
let map = new AIOMap({
    apiKeys:{
        map:'web.0a2aa5f83d314a8c9916473aa0e01438',
        service:'service.09a2234e299a4ff585007b2894df9fca',
    },
    onChange:(latitude,longitude)=>{
        this.setState({latitude,longitude})
    },
    search:true
})
....
return map.render({
    latitude:${latitude},longitude:${longitude}
    
})
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
        this.mapInstance = new AIOMap({
            apiKeys:{
                map:'web.0a2aa5f83d314a8c9916473aa0e01438',
                service:'service.09a2234e299a4ff585007b2894df9fca',
            },
            onChange:(latitude,longitude)=>{
                this.setState({latitude,longitude})
            },
            search:true,
            popup:{
                title:'انتخاب موقعیت'
            }
        })
        this.state = {
            latitude:35.694739,longitude:51.394097
        }
    }
    preview() {
        let {latitude,longitude} = this.state;
        return (
            <div className='example'>
                <span>{`latitude = ${latitude}`}</span>
                <span>{`longitude = ${longitude}`}</span>
                {this.mapInstance.render({latitude,longitude})}
                {
                    AIODoc().Code(`
let map = new AIOMap({
    apiKeys:{
        map:'web.0a2aa5f83d314a8c9916473aa0e01438',
        service:'service.09a2234e299a4ff585007b2894df9fca',
    },
    onChange:(latitude,longitude)=>{
        this.setState({latitude,longitude})
    },
    search:true,
    popup={{
        title:'انتخاب موقعیت'
    }}
})
....
return map.render({
    latitude,longitude
})
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




