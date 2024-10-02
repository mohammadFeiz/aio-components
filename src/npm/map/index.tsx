import { FC, ReactNode, createContext, isValidElement, useContext, useEffect, useRef, useState } from 'react';
import {divIcon} from 'leaflet';
import { Circle, LayersControl, MapContainer, Marker, Polyline, Rectangle, TileLayer, useMapEvents } from 'react-leaflet';
import { JSXToHTML } from './../../npm/aio-utils';
import './index.css';
import { mdiMagnify } from '@mdi/js';
import Icon from '@mdi/react';
import AIOInput from './../../npm/aio-input';
import MapMarkerSrc from './marker-icon.png';
import 'leaflet/dist/leaflet.css';

type I_pos = [number, number]
export type I_marker = { pos: [number, number],html?:ReactNode }
export type I_shapeStyle = {
  stroke?:{color?:string,width?:number,dash?:string},
  fill?:{color?:string,opacity?:number}
}
export type I_circle = {type:'circle',center:I_pos,radius?:number,style?:I_shapeStyle}
export type I_rect = {type:'rect',points:I_pos[],style?:I_shapeStyle}
export type I_polyline = {type:'polyline',points:I_pos[],style?:I_shapeStyle}
export type I_shape = I_circle | I_rect | I_polyline
type I_Map = {
  children?: React.ReactNode,
  onChange?: (coords: I_pos) => void,
  zoom?: {value?:number,wheel?:boolean,control?:boolean},
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
  layers?:I_layers,
  getSearchResult?:(searchValue:string)=>Promise<I_searchResult[]>,
  onSearch?:(searchResult:I_searchResult)=>void,
  mapRef?:any
}
export type I_layers = {position:'topright' | 'topleft',items:I_layerItem[]}
export type I_layerItem = {name:string,markers?:I_marker[],shapes?:I_shape[],active?:boolean}
type I_ctx = {rootProps: I_Map,pos:I_pos,move: (pos: I_pos) => void,setMap:any}
const CTX = createContext({} as any)
const Map: FC<I_Map> = (props) => {
  const { zoom = {value:14}, value = [35.699939, 51.338497],getSearchResult,onSearch,mapRef} = props;
  const [map, setMap] = useState<any>(null)
  if(mapRef){mapRef.current = map;}
  const [pos, setPos] = useState<I_pos>(value)
  const moveTimeout = useRef<any>(undefined)
  function move(pos: I_pos) {
    setPos(pos)
    if (props.onChange) {
      clearTimeout(moveTimeout.current);
      moveTimeout.current = setTimeout(() => { if (props.onChange) { props.onChange(pos) } }, 600)
    }
  }
  function getContext(): I_ctx {return {pos,setMap,rootProps: props,move}}
  useEffect(()=>{
    if(map !== null){map.setView(value, zoom.value,{animate:false})}
    setPos(value)
  },[value[0] + '-' + value[1] + '-' + zoom.value])
  return (
    <CTX.Provider value={getContext()}>
      <div className="aio-map">
        {!!getSearchResult && <MapHeader/>}
        <MapBody/>
        <MapFooter/>
      </div>
    </CTX.Provider>
  );
};
export default Map;
const MapBody:FC = ()=>{
  const {rootProps,pos,setMap}:I_ctx = useContext(CTX)
  const {style = { width: '100%', height: '100%' },zoom = {value:14},dragging = true,children,shapes = [],marker,markers = []} = rootProps 
  return (
    <MapContainer
        center={pos} style={style} zoom={zoom.value || 14} scrollWheelZoom={zoom.wheel?'center':undefined} zoomControl={zoom.control !== false}
        attributionControl={true} dragging={dragging} ref={setMap}
      >
          <TileLayer url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png" />
          {/* <TileLayer 
            url="https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}" 
            attribution='<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'     
            accessToken='pk.eyJ1IjoibXNmMTM2NCIsImEiOiJjbTE1MnlpM20wNTJvMmtyNDhjYjIzMXRhIn0.zRM2a68bNyBsYSeIdV8a4A'
          /> */}
          {/* http://leaflet-extras.github.io/leaflet-providers/preview/ */}
          <MapEvents/>
          {marker !== false && <MapMarker key='main-marker' pos={pos} html={isValidElement(marker)?marker:<img src={MapMarkerSrc} alt='' width={48} height={48}/>}/>}
          {markers.map((marker: I_marker, i: number) => <MapMarker key={`marker-${i}`} pos={marker.pos} html={marker.html}/>)}
          {shapes.map((o:I_shape,i:number)=><MapShape key={i} shape={o}/>)}
          <MapLayers/>
          {children}
      </MapContainer>
  )
}
type I_searchResult = {text:string,value:string,pos:I_pos,subtext?:string,before?:ReactNode,after?:ReactNode}
const MapHeader:FC = ()=>{
  const {rootProps,move}:I_ctx = useContext(CTX);
  const {getSearchResult,onSearch} = rootProps;
  const [searchValue,setSearchValue] = useState<string>('')
  const [searchResult,setSerachResult] = useState<I_searchResult[]>([])
  const timeout = useRef<any>();
  function changeSearch(searchValue:string){
    setSearchValue(searchValue);    
    clearTimeout(timeout.current);
    timeout.current = setTimeout(async ()=>{
      if(getSearchResult){
        const res:I_searchResult[] = await getSearchResult(searchValue)
        if(Array.isArray(res)){setSerachResult(res)}
      }
    },1200)
  }
  return (
    <div className="aio-map-header">
        <AIOInput
          type='text' value={searchValue} options={(searchResult || [])}
          before={<Icon path={mdiMagnify} size={0.8}/>}
          onChange={(searchValue)=>changeSearch(searchValue)}
          option={{
            onClick:({option})=>{if(onSearch){onSearch(option as I_searchResult)}}
          }}
        />
    </div>
  )
}
const MapLayers:FC = ()=>{
  const {rootProps}:I_ctx = useContext(CTX);
  const {layers} = rootProps;
  if(!layers){return null}
  const {position = 'topright',items = []} = layers;
  return (
    <LayersControl position={position}>
      {
        items.map((o:I_layerItem,i:number)=>{
          const {shapes = [],markers = [],active = true} = o;
          return (
            <LayersControl.Overlay name={o.name} checked={active} key={i}>
              {!!markers.length?markers.map((marker:I_marker,j:number)=><MapMarker key={j} pos={marker.pos} html={marker.html}/>):null}
              {!!shapes.length?shapes.map((shape:I_shape,i:number)=><MapShape key={'shape' + i} shape={shape}/>):null}
            </LayersControl.Overlay>
          )
        })
      }
    </LayersControl>
  )
}
const MapShape:FC<{shape:I_shape}> = ({shape})=>{
  const {style = {},type} = shape,{stroke = {},fill = {}} = style;
  const {width = 4,dash,color:strokeColor = 'orange'} = stroke;
  const {color:fillColor = 'orange',opacity = 0.3} = fill;  
  const pathOptions = {fillColor: fillColor,color:strokeColor,fillOpacity:opacity,weight:width,dashArray:dash}
  if(type === 'circle'){
    const {center,radius = 100} = shape;
    return (<Circle center={center} pathOptions={pathOptions} radius={radius} />)
  }
  else if(type === 'rect'){return (<Rectangle bounds={shape.points} pathOptions={pathOptions}/>)}
  else if(type === 'polyline'){return (<Polyline positions={shape.points} pathOptions={pathOptions}/>)}
  return null
}
const MapFooter:FC = ()=>{
  const {rootProps,pos}:I_ctx = useContext(CTX);
  const {submitText = 'Submit',onSubmit,footer} = rootProps;
  if(!onSubmit && !footer){return null}
  return (
    <div className="aio-map-footer">
      {!!onSubmit && <button type='button' onClick={()=>onSubmit(pos)}>{submitText}</button>}
      <div className="aio-map-footer-html">{footer || null}</div>
    </div>
  )
}

const MapMarker:FC<{pos:I_pos,html?:ReactNode}> = ({pos,html})=>{
  function getHtmlIcon(html:ReactNode){
    return divIcon({
      html: JSXToHTML(html),
      className: '', // Optional, for adding custom styles
      iconSize: [32, 32], // size of the icon
      iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    });
  }
  html = html || <img src={MapMarkerSrc} alt='' width={48} height={48}/>
  let props:any = {position:pos}
  if(html){props.icon =  getHtmlIcon(html)}
  return <Marker {...props} animate={false}/>
}
function MapEvents() {
  const { rootProps, move }: I_ctx = useContext(CTX)
  const map = useMapEvents({
    click: () => rootProps.onClick ? rootProps.onClick() : undefined,
    move: (e: any) => {
      if(rootProps.dragging === false){return}
      let { lat, lng } = e.target.getCenter()
      move([lat, lng])
    },
    zoom: (e: any) => {
      if(rootProps.onChangeZoom){rootProps.onChangeZoom(e.target._zoom)}
    },
    locationfound: (location: any) => {
      console.log('location found:', location)
    },
  })
  return null
}

