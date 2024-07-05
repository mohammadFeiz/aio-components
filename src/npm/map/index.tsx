import { FC, ReactNode, createContext, isValidElement, useContext, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Circle, LayersControl, MapContainer, Marker, Polyline, Rectangle, TileLayer, useMapEvents } from 'react-leaflet';
import { JSXToHTML } from '../aio-utils';
import './index.css';
import { mdiMagnify } from '@mdi/js';
import Icon from '@mdi/react';
import AIOInput from '../aio-input';
type I_pos = [number, number]
type I_marker = { pos: [number, number],html?:ReactNode }
type I_shapeStyle = {
  stroke?:{
    color?:string
    width?:number,
    dash?:string
  },
  fill?:{
    color?:string,
    opacity?:number
  }
}
type I_circle = {
  type:'circle',
  center:I_pos,
  radius?:number,
  style?:I_shapeStyle
}
type I_rect = {
  type:'rect',
  points:I_pos[],
  style?:I_shapeStyle
}
type I_polyline = {
  type:'polyline',
  points:I_pos[],
  style?:I_shapeStyle
}
type I_shape = I_circle | I_rect | I_polyline
type I_Map = {
  children?: React.ReactNode,
  onChange?: (coords: I_pos) => void,
  zoom?: {
    value?:number,
    wheel?:boolean,
    control?:boolean
  },
  onChangeZoom?: (zoom: number) => void,
  markers?: I_marker[]
  value?: I_pos,
  marker?: ReactNode | false,
  style?: any,
  onClick?: () => void,
  dragging?:boolean,
  submitText?:string,
  onSubmit?:(pos:I_pos)=>void,
  shapes?:I_shape[],
  footer?:ReactNode,
  layers?:I_layers
}
type I_layers = {
  position:'topright' | 'topleft',
  items:I_layerItem[]
}
type I_layerItem = {
  name:string,
  markers?:I_marker[],
  shapes?:I_shape[]
}
type I_ctx = {
  rootProps: I_Map,
  pos:I_pos,
  move: (pos: I_pos) => void,
  setMap:any
}
const MapContext = createContext({} as any)
const Map: FC<I_Map> = (props) => {
  const { 
    zoom = {value:14}, 
    value = [35.699939, 51.338497], 
  } = props;
  const [map, setMap] = useState<any>(null)
  const [pos, setPos] = useState<I_pos>(value)
  const moveTimeout = useRef<any>(undefined)
  function move(pos: I_pos) {
    if(props.dragging === false){return}
    setPos(pos)
    if (props.onChange) {
      clearTimeout(moveTimeout.current);
      moveTimeout.current = setTimeout(() => { if (props.onChange) { props.onChange(pos) } }, 600)
    }
  }
  function getContext(): I_ctx {
    return {
      pos,
      setMap,
      rootProps: props,
      move
    }
  }
  useEffect(()=>{
    if(map !== null){
      map.setView(value, zoom.value,{animate:false})
    }
    setPos(value)
    
  },[value[0] + '-' + value[1] + '-' + zoom.value])
  return (
    <MapContext.Provider value={getContext()}>
      <div className="aio-map">
        <MapHeader/>
        <MapBody/>
        <MapFooter/>
      </div>
    </MapContext.Provider>
  );
};
export default Map;
const MapBody:FC = ()=>{
  const {rootProps,pos,setMap}:I_ctx = useContext(MapContext)
  const {
    style = { width: '100%', height: 240 },
    zoom = {value:14},
    dragging = true,
    children,
    shapes = [],
    marker,
    markers = []
  } = rootProps 
  return (
    <MapContainer
        center={pos}
        style={style}
        zoom={zoom.value || 14}
        scrollWheelZoom={zoom.wheel}
        zoomControl={zoom.control !== false}
        attributionControl={true}
        dragging={dragging}
        ref={setMap}
      >
          <TileLayer url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png" />
          <MapEvents/>
          {marker !== false && <MapMarker key='main-marker' pos={pos} html={isValidElement(marker)?marker:undefined}/>}
          {markers.map((marker: I_marker, i: number) => <MapMarker key={`marker-${i}`} pos={marker.pos} html={marker.html}/>)}
          {shapes.map((o:I_shape,i:number)=><MapShape key={i} shape={o}/>)}
          <MapLayers/>
          {children}
      </MapContainer>
  )
}
const MapHeader:FC = ()=>{
  const [searchValue,setSearchValue] = useState<string>('')
  return (
    <div className="aio-map-header">
        <AIOInput
          type='text'
          before={<Icon path={mdiMagnify} size={0.8}/>}
          value={searchValue}
          onChange={(searchValue)=>setSearchValue(searchValue)}
        />
      
    </div>
  )
}
const MapLayers:FC = ()=>{
  const {rootProps}:I_ctx = useContext(MapContext);
  const {layers} = rootProps;
  if(!layers){return null}
  const {position = 'topright',items = []} = layers;
  return (
    <LayersControl position={position}>
      {
        items.map((o:I_layerItem,i:number)=>{
          const {shapes = [],markers = []} = o;
          return (
            <LayersControl.Overlay name={o.name}>
              {markers.map((o:I_marker,i:number)=><MapMarker key={'marker' + i} pos={o.pos} html={o.html}/>)}
              {shapes.map((o:I_shape,i:number)=><MapShape key={'shape' + i} shape={o}/>)}
            </LayersControl.Overlay>
          )
        })
      }
    </LayersControl>
  )
}
const MapShape:FC<{shape:I_shape}> = ({shape})=>{
  const {style = {},type} = shape;
  const {stroke = {},fill = {}} = style;
  const {width = 4,dash,color:strokeColor = 'orange'} = stroke;
  const {color:fillColor = 'orange',opacity = 0.3} = fill;  
  const pathOptions = {fillColor: fillColor,color:strokeColor,fillOpacity:opacity,weight:width,dashArray:dash}
  if(type === 'circle'){
    const {center,radius = 100} = shape;
    return (<Circle center={center} pathOptions={pathOptions} radius={radius} />)
  }
  else if(type === 'rect'){
    const {points} = shape;
    return (<Rectangle bounds={points} pathOptions={pathOptions}/>)
  }
  else if(type === 'polyline'){
    const {points} = shape;
    return (<Polyline positions={points} pathOptions={pathOptions}/>)
  }
  return null
}
const MapFooter:FC = ()=>{
  const {rootProps,pos}:I_ctx = useContext(MapContext);
  const {submitText = 'Submit',onSubmit,footer} = rootProps;
  if(!onSubmit && !footer){return null}
  return (
    <div className="aio-map-footer">
      {!!onSubmit && <button type='button' onClick={()=>onSubmit(pos)}>{submitText}</button>}
      <div className="aio-map-footer-html">{footer || null}</div>
    </div>
  )
}
const MAP: FC<{ pos: I_pos }> = ({ pos }) => {
  const { rootProps }: I_ctx = useContext(MapContext)
  const { markers = [], marker } = rootProps;
  //const map = useMap()
  return (
    null
  )
}
const MapMarker:FC<{pos:I_pos,html?:ReactNode}> = ({pos,html})=>{
  function getHtmlIcon(html:ReactNode){
    return L.divIcon({
      html: JSXToHTML(html),
      className: '', // Optional, for adding custom styles
      iconSize: [32, 32], // size of the icon
      iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    });
  }
  let props:any = {position:pos}
  if(html){
    props.icon =  getHtmlIcon(html)
  }
  
  return <Marker {...props} animate={false}/>
}
function MapEvents() {
  const { rootProps, move }: I_ctx = useContext(MapContext)
  const changeView = true;
  const map = useMapEvents({
    click: () => rootProps.onClick ? rootProps.onClick() : undefined,
    move: (e: any) => {
      if (!changeView) { return }
      let { lat, lng } = e.target.getCenter()
      move([lat, lng])
    },
    zoom: (e: any) => {
      const zoom = e.target._zoom
      console.log(zoom)
    },
    locationfound: (location: any) => {
      console.log('location found:', location)
    },
  })
  return null
}


// Fazel Farnia  12:52 ب.ظ
// service.5b0eab5b9e784bd7aa5f7980d4720aa4
// این برای استفاده از سرویس

// Fazel Farnia  12:53 ب.ظ
// service.5b0eab5b9e784bd7aa5f7980d4720aa4
// اینم برای نقشه