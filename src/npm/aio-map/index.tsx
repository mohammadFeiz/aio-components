import { divIcon, LeafletEvent } from "leaflet"
import { createContext, FC, isValidElement, ReactNode, useContext, useEffect, useRef, useState } from "react"
import { Circle, FeatureGroup, LayersControl, MapContainer, Marker, Polyline, Rectangle, TileLayer, useMapEvents } from "react-leaflet"
import AIOInput from "../aio-input"
import { JSXToHTML } from "../aio-utils"
import 'leaflet/dist/leaflet.css';
import './index.css';

type I_pos = [number, number]
export type I_marker = { pos: [number, number], html?: ReactNode, eventHandlers?: any }
export type I_shapeStyle = {
    stroke?: { color?: string, width?: number, dash?: string },
    fill?: { color?: string, opacity?: number }
}
export type I_circle = { type: 'circle', center: I_pos, radius?: number, style?: I_shapeStyle }
export type I_rect = { type: 'rect', points: I_pos[], style?: I_shapeStyle }
export type I_polyline = { type: 'polyline', points: I_pos[], style?: I_shapeStyle }
export type I_shape = I_circle | I_rect | I_polyline
type I_Map = {
    children?: React.ReactNode,
    onChange?: (coords: I_pos) => void,
    zoom?: { value?: number, wheel?: boolean, control?: boolean, onChange?: (zoom: number) => void },
    markers?: I_marker[]
    value?: I_pos,
    marker?: ReactNode | false,
    style?: any,
    onClick?: () => void,
    dragging?: boolean,
    submitText?: string,
    onSubmit?: (pos: I_pos) => void,
    shapes?: I_shape[],
    footer?: ReactNode,
    layers?: I_layers,
    getSearchResult?: (searchValue: string) => Promise<I_searchResult[]>,
    onSearch?: (searchResult: I_searchResult) => void,
    mapRef?: any,
    whenReady?: () => void,
    onMoveEnd?: (e: LeafletEvent) => void,
    actionsRef?: any
}
export type I_layers = { position: 'topright' | 'topleft', items: I_layerItem[] }
export type I_layerItem = { name: string, markers?: I_marker[], shapes?: I_shape[], active?: boolean }
type I_mapctx = { rootProps: I_Map, pos: I_pos, move: (pos: I_pos) => void, setMap: any, getDefaultMarkerIcon: () => ReactNode, changeZoom: (zoom: number) => void, zoom: number }
const MAPCTX = createContext({} as any)
const AIMap: FC<I_Map> = (props) => {
    const { value = [35.699939, 51.338497], getSearchResult, onSearch, mapRef } = props;
    const [map, setMap] = useState<any>(null)
    const [zoom, setZoom] = useState<number>(props.zoom?.value || 14)
    const lockChangeZoomState = useRef(false)
    function changeZoom(zoom: number) {
        if (lockChangeZoomState.current === true) { return }
        setZoom(zoom)
    }
    if (mapRef) { mapRef.current = map; }
    if (props.actionsRef) {
        props.actionsRef.current = {
            flyTo: (p: { lat: number, lng: number, zoom: number, callback: () => void }) => {
                lockChangeZoomState.current = true
                map.flyTo([p.lat, p.lng], p.zoom)
                const onMoveEnd = () => {
                    map.off("moveend", onMoveEnd);
                    lockChangeZoomState.current = false;
                    changeZoom(p.zoom)
                    p.callback();
                }
                map.on("moveend", onMoveEnd);
            }
        }
    }
    const [pos, setPos] = useState<I_pos>(value)
    const moveTimeout = useRef<any>(undefined)
    function move(pos: I_pos) {
        setPos(pos)
        if (props.onChange) {
            clearTimeout(moveTimeout.current);
            moveTimeout.current = setTimeout(() => { if (props.onChange) { props.onChange(pos) } }, 600)
        }
    }
    function getDefaultMarkerIcon() {
        return <div className='marker-icon'><div className='marker-icon-circle'></div><div className='marker-icon-arrow'></div></div>
    }
    function getContext(): I_mapctx { return { pos, setMap, rootProps: props, move, getDefaultMarkerIcon, changeZoom, zoom } }
    useEffect(() => {
        if (map !== null) { map.setView(value, zoom, { animate: false }) }
        setPos(value)
    }, [value[0] + '-' + value[1] + '-' + zoom])
    return (
        <MAPCTX.Provider value={getContext()}>
            <div className="ai-map">
                {!!getSearchResult && <MapHeader />}
                <MapBody />
                <MapFooter />
            </div>
        </MAPCTX.Provider>
    );
};
export default AIMap
const MapBody: FC = () => {
    const { rootProps, pos, setMap, getDefaultMarkerIcon, zoom }: I_mapctx = useContext(MAPCTX)
    const { style, dragging = true, children, shapes = [], marker, markers = [], whenReady } = rootProps
    const defaultStyle = { width: '100%', height: '100%' }
    return (
        <MapContainer
            center={pos} style={{ ...defaultStyle, ...style }} zoom={zoom} scrollWheelZoom={rootProps.zoom?.wheel ? 'center' : undefined} zoomControl={rootProps.zoom?.control !== false}
            attributionControl={true} dragging={dragging} ref={setMap} whenReady={whenReady}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png" />
            {/* <TileLayer 
              url="https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}" 
              attribution='<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'     
              accessToken='pk.eyJ1IjoibXNmMTM2NCIsImEiOiJjbTE1MnlpM20wNTJvMmtyNDhjYjIzMXRhIn0.zRM2a68bNyBsYSeIdV8a4A'
            /> */}
            {/* http://leaflet-extras.github.io/leaflet-providers/preview/ */}
            <MapEvents />
            {marker !== false && <MapMarker key='main-marker' pos={pos} html={isValidElement(marker) ? marker : getDefaultMarkerIcon()} />}
            {markers.map((marker: I_marker, i: number) => <MapMarker key={`marker-${i}`} pos={marker.pos} html={marker.html} eventHandlers={marker.eventHandlers} />)}
            {shapes.map((o: I_shape, i: number) => <MapShape key={i} shape={o} />)}
            <MapLayers />
            {children}
        </MapContainer>
    )
}
type I_searchResult = { text: string, value: string, pos: I_pos, subtext?: string, before?: ReactNode, after?: ReactNode }
const MagnifyIcon: FC = () => {
    return (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width={24} height={24}>
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
        </svg>
    )
}
const MapHeader: FC = () => {
    const { rootProps, move }: I_mapctx = useContext(MAPCTX);
    const { getSearchResult, onSearch } = rootProps;
    const [searchValue, setSearchValue] = useState<string>('')
    const [searchResult, setSerachResult] = useState<I_searchResult[]>([])
    const timeout = useRef<any>();
    function changeSearch(searchValue: string) {
        setSearchValue(searchValue);
        clearTimeout(timeout.current);
        timeout.current = setTimeout(async () => {
            if (getSearchResult) {
                const res: I_searchResult[] = await getSearchResult(searchValue)
                if (Array.isArray(res)) { setSerachResult(res) }
            }
        }, 1200)
    }
    return (
        <div className="ai-map-header">
            <AIOInput
                type='text' value={searchValue} options={(searchResult || [])}
                before={<MagnifyIcon/>}
                onChange={(searchValue) => changeSearch(searchValue)}
                option={{
                    onClick: (option) => { if (onSearch) { onSearch(option as I_searchResult) } }
                }}
            />
        </div>
    )
}
const MapLayers: FC = () => {
    const { rootProps }: I_mapctx = useContext(MAPCTX);
    const { layers } = rootProps;
    if (!layers) { return null }
    const { position = 'topright', items = [] } = layers;
    return (
        <LayersControl position={position}>
            {
                items.map((o: I_layerItem, i: number) => {
                    const { shapes = [], markers = [], active = true } = o;
                    return (
                        <LayersControl.Overlay name={o.name} checked={active} key={i}>
                            <FeatureGroup>
                                {markers.map((marker: I_marker, j: number) =>
                                    <MapMarker key={j} pos={marker.pos} html={marker.html} eventHandlers={marker.eventHandlers} />
                                )}
                                {shapes.map((shape: I_shape, k: number) =>
                                    <MapShape key={k} shape={shape} />
                                )}
                            </FeatureGroup>
                        </LayersControl.Overlay>
                    )
                })
            }
        </LayersControl>
    )
}
const MapShape: FC<{ shape: I_shape }> = ({ shape }) => {
    const { style = {}, type } = shape, { stroke = {}, fill = {} } = style;
    const { width = 4, dash, color: strokeColor = 'orange' } = stroke;
    const { color: fillColor = 'orange', opacity = 0.3 } = fill;
    const pathOptions = { fillColor: fillColor, color: strokeColor, fillOpacity: opacity, weight: width, dashArray: dash }
    if (type === 'circle') {
        const { center, radius = 100 } = shape;
        return (<Circle center={center} pathOptions={pathOptions} radius={radius} />)
    }
    else if (type === 'rect') { return (<Rectangle bounds={shape.points} pathOptions={pathOptions} />) }
    else if (type === 'polyline') { return (<Polyline positions={shape.points} pathOptions={pathOptions} />) }
    return null
}
const MapFooter: FC = () => {
    const { rootProps, pos }: I_mapctx = useContext(MAPCTX);
    const { submitText = 'Submit', onSubmit, footer } = rootProps;
    if (!onSubmit && !footer) { return null }
    return (
        <div className="ai-map-footer">
            {!!onSubmit && <button type='button' onClick={() => onSubmit(pos)}>{submitText}</button>}
            <div className="ai-map-footer-html">{footer || null}</div>
        </div>
    )
}
const MapMarker: FC<{ pos: I_pos, html?: ReactNode, eventHandlers?: any }> = ({ pos, html, eventHandlers }) => {
    const { getDefaultMarkerIcon }: I_mapctx = useContext(MAPCTX)
    function getHtmlIcon(html: ReactNode) {
        return divIcon({
            html: JSXToHTML(html),
            className: '', // Optional, for adding custom styles
            iconSize: [32, 32], // size of the icon
            iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
        });
    }
    html = html || getDefaultMarkerIcon()
    let props: any = { position: pos }
    if (html) { props.icon = getHtmlIcon(html) }
    return <Marker {...props} animate={false} eventHandlers={eventHandlers} />
}
function MapEvents() {
    const { rootProps, move, changeZoom }: I_mapctx = useContext(MAPCTX)
    const map = useMapEvents({
        click: () => rootProps.onClick ? rootProps.onClick() : undefined,
        move: (e: any) => {
            if (rootProps.dragging === false) { return }
            let { lat, lng } = e.target.getCenter()
            move([lat, lng])
        },
        zoom: (e: any) => {
            changeZoom(e.target._zoom)
        },
        locationfound: (location: any) => {
            console.log('location found:', location)
        },
        moveend: (e) => {
            if (rootProps.onMoveEnd) { rootProps.onMoveEnd(e) }
        },
        movestart: (e) => {
        }
    })
    return null
}