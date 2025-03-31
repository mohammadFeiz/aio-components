var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { divIcon } from "leaflet";
import { createContext, isValidElement, useContext, useEffect, useRef, useState } from "react";
import { Circle, FeatureGroup, LayersControl, MapContainer, Marker, Polyline, Rectangle, TileLayer, useMapEvents } from "react-leaflet";
import AIOInput from "aio-input";
import { AddToAttrs, JSXToHTML } from "aio-utils";
import 'leaflet/dist/leaflet.css';
import './index.css';
const MAPCTX = createContext({});
const AIMap = (props) => {
    var _a;
    const { value = [35.699939, 51.338497], getSearchResult, onSearch, mapRef } = props;
    const [map, setMap] = useState(null);
    const [zoom, setZoom] = useState(((_a = props.zoom) === null || _a === void 0 ? void 0 : _a.value) || 14);
    const lockChangeZoomState = useRef(false);
    function changeZoom(zoom) {
        if (lockChangeZoomState.current === true) {
            return;
        }
        setZoom(zoom);
    }
    if (mapRef) {
        mapRef.current = map;
    }
    if (props.actionsRef) {
        props.actionsRef.current = {
            flyTo: (p) => {
                lockChangeZoomState.current = true;
                map.flyTo([p.lat, p.lng], p.zoom);
                const onMoveEnd = () => {
                    map.off("moveend", onMoveEnd);
                    lockChangeZoomState.current = false;
                    changeZoom(p.zoom);
                    p.callback();
                };
                map.on("moveend", onMoveEnd);
            }
        };
    }
    const [pos, setPos] = useState(value);
    const moveTimeout = useRef(undefined);
    function move(pos) {
        setPos(pos);
        if (props.onChange) {
            clearTimeout(moveTimeout.current);
            moveTimeout.current = setTimeout(() => { if (props.onChange) {
                props.onChange(pos);
            } }, 600);
        }
    }
    function getDefaultMarkerIcon() {
        return _jsxs("div", { className: 'marker-icon', children: [_jsx("div", { className: 'marker-icon-circle' }), _jsx("div", { className: 'marker-icon-arrow' })] });
    }
    function getContext() { return { pos, setMap, rootProps: props, move, getDefaultMarkerIcon, changeZoom, zoom }; }
    useEffect(() => {
        if (map !== null) {
            map.setView(value, zoom, { animate: false });
        }
        setPos(value);
    }, [value[0] + '-' + value[1] + '-' + zoom]);
    const attrs = AddToAttrs(props.attrs, { className: 'ai-map' });
    return (_jsx(MAPCTX.Provider, { value: getContext(), children: _jsxs("div", Object.assign({}, attrs, { children: [!!getSearchResult && _jsx(MapHeader, {}), _jsx(MapBody, {}), _jsx(MapFooter, {})] })) }));
};
export default AIMap;
const MapBody = () => {
    var _a, _b;
    const { rootProps, pos, setMap, getDefaultMarkerIcon, zoom } = useContext(MAPCTX);
    const { mapStyle, dragging = true, children, shapes = [], marker, markers = [], whenReady } = rootProps;
    const defaultStyle = { width: '100%', height: '100%' };
    return (_jsxs(MapContainer, { center: pos, style: Object.assign(Object.assign({}, defaultStyle), mapStyle), zoom: zoom, scrollWheelZoom: ((_a = rootProps.zoom) === null || _a === void 0 ? void 0 : _a.wheel) ? 'center' : undefined, zoomControl: ((_b = rootProps.zoom) === null || _b === void 0 ? void 0 : _b.control) !== false, attributionControl: true, dragging: dragging, ref: setMap, whenReady: whenReady, children: [_jsx(TileLayer, { url: "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png" }), _jsx(MapEvents, {}), marker !== false && _jsx(MapMarker, { pos: pos, html: isValidElement(marker) ? marker : getDefaultMarkerIcon() }, 'main-marker'), markers.map((marker, i) => _jsx(MapMarker, { pos: marker.pos, html: marker.html, eventHandlers: marker.eventHandlers }, `marker-${i}`)), shapes.map((o, i) => _jsx(MapShape, { shape: o }, i)), _jsx(MapLayers, {}), children] }));
};
const MagnifyIcon = () => {
    return (_jsx("svg", { viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, children: _jsx("path", { d: "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" }) }));
};
const MapHeader = () => {
    const { rootProps, move } = useContext(MAPCTX);
    const { getSearchResult, onSearch } = rootProps;
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSerachResult] = useState([]);
    const timeout = useRef();
    function changeSearch(searchValue) {
        setSearchValue(searchValue);
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            if (getSearchResult) {
                const res = yield getSearchResult(searchValue);
                if (Array.isArray(res)) {
                    setSerachResult(res);
                }
            }
        }), 1200);
    }
    return (_jsx("div", { className: "ai-map-header", children: _jsx(AIOInput, { type: 'text', value: searchValue, options: (searchResult || []), before: _jsx(MagnifyIcon, {}), onChange: (searchValue) => changeSearch(searchValue), option: {
                onClick: (option) => { if (onSearch) {
                    onSearch(option);
                } }
            } }) }));
};
const MapLayers = () => {
    const { rootProps } = useContext(MAPCTX);
    const { layers } = rootProps;
    if (!layers) {
        return null;
    }
    const { position = 'topright', items = [] } = layers;
    return (_jsx(LayersControl, { position: position, children: items.map((o, i) => {
            const { shapes = [], markers = [], active = true } = o;
            return (_jsx(LayersControl.Overlay, { name: o.name, checked: active, children: _jsxs(FeatureGroup, { children: [markers.map((marker, j) => _jsx(MapMarker, { pos: marker.pos, html: marker.html, eventHandlers: marker.eventHandlers }, j)), shapes.map((shape, k) => _jsx(MapShape, { shape: shape }, k))] }) }, i));
        }) }));
};
const MapShape = ({ shape }) => {
    const { style = {}, type } = shape, { stroke = {}, fill = {} } = style;
    const { width = 4, dash, color: strokeColor = 'orange' } = stroke;
    const { color: fillColor = 'orange', opacity = 0.3 } = fill;
    const pathOptions = { fillColor: fillColor, color: strokeColor, fillOpacity: opacity, weight: width, dashArray: dash };
    if (type === 'circle') {
        const { center, radius = 100 } = shape;
        return (_jsx(Circle, { center: center, pathOptions: pathOptions, radius: radius }));
    }
    else if (type === 'rect') {
        return (_jsx(Rectangle, { bounds: shape.points, pathOptions: pathOptions }));
    }
    else if (type === 'polyline') {
        return (_jsx(Polyline, { positions: shape.points, pathOptions: pathOptions }));
    }
    return null;
};
const MapFooter = () => {
    const { rootProps, pos } = useContext(MAPCTX);
    const { submitText = 'Submit', onSubmit, footer } = rootProps;
    if (!onSubmit && !footer) {
        return null;
    }
    return (_jsxs("div", { className: "ai-map-footer", children: [!!onSubmit && _jsx("button", { type: 'button', onClick: () => onSubmit(pos), children: submitText }), _jsx("div", { className: "ai-map-footer-html", children: footer || null })] }));
};
const MapMarker = ({ pos, html, eventHandlers }) => {
    const { getDefaultMarkerIcon } = useContext(MAPCTX);
    function getHtmlIcon(html) {
        return divIcon({
            html: JSXToHTML(html),
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
        });
    }
    html = html || getDefaultMarkerIcon();
    let props = { position: pos };
    if (html) {
        props.icon = getHtmlIcon(html);
    }
    return _jsx(Marker, Object.assign({}, props, { animate: false, eventHandlers: eventHandlers }));
};
function MapEvents() {
    const { rootProps, move, changeZoom } = useContext(MAPCTX);
    const map = useMapEvents({
        click: () => rootProps.onClick ? rootProps.onClick() : undefined,
        move: (e) => {
            if (rootProps.dragging === false) {
                return;
            }
            let { lat, lng } = e.target.getCenter();
            move([lat, lng]);
        },
        zoom: (e) => {
            changeZoom(e.target._zoom);
        },
        locationfound: (location) => {
            console.log('location found:', location);
        },
        moveend: (e) => {
            if (rootProps.onMoveEnd) {
                rootProps.onMoveEnd(e);
            }
        },
        movestart: (e) => {
        }
    });
    return null;
}
