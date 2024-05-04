import React, { createContext, createRef, useContext, useEffect, useState } from "react";
import {AICTX,I} from './utils';
import { AI, AI_context, I_MapUnit, I_Map_config, I_Map_context, I_Map_coords, I_Map_marker, I_Map_temp, I_mapApiKeys } from "./types";
import Axios from "axios";
import RVD from './../react-virtual-dom/index'; 
import { I_RVD_node } from "../react-virtual-dom/types";
import $ from 'jquery';
import { JSXToHTML,Storage } from "../aio-utils";
import { mdiChevronRight, mdiClose, mdiCrosshairsGps, mdiLoading, mdiMagnify } from "@mdi/js";
import AIOInput from ".";
const MapContext = createContext({} as any);
export default function Map() {
    let { rootProps }: AI_context = useContext(AICTX);
    let { popupConfig, mapConfig = {}, onChange = ()=>{}, disabled, attrs, value } = rootProps;
    let [isScriptAdded,setIsScriptAdded] = useState<boolean>(false);
    useEffect(()=>{
        let scr = document.getElementById('aio-input-map-neshan');
        try {
            const script = document.createElement("script");
            script.src = `https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js`;
            script.id = 'aio-input-map-neshan'
            script.onload = () => setIsScriptAdded(true);
            document.body.appendChild(script);
        }
        catch (err) { console.log(err) }
    },[])
    if(!isScriptAdded){return null}
    if (!value) { value = { lat: 35.699739, lng: 51.338097 } }
    if (!value.lat) { value.lat = 35.699739 }
    if (!value.lng) { value.lng = 51.338097 }
    let p:I_MapUnit = { popupConfig, onChange, attrs, value, mapConfig, disabled:disabled === true }
    return <MapUnit {...p} />
}
function MapUnit(props:I_MapUnit) {
    let [mapApiKeys] = useState<I_mapApiKeys>((new Storage('aio-input-storage')).load('mapApiKeys',{ map: '', service: '' }));
    let {onClose,mapConfig = {},onChange = () => { },disabled, attrs = {},popupConfig} = props;
    let {area,zoom:Zoom = 14, traffic = false,markers = [], zoomControl = false, maptype = 'dreamy-gold', poi = true,draggable = true } = mapConfig;
    let [showPopup,setShowPopup] = useState<boolean>(false)
    let [value,setValue] = useState<{lat:number,lng:number}>(props.value)
    let [address,setAddress] = useState<string>('')
    let [addressLoading,setAddressLoading] = useState<boolean>(false)
    let [zoom,setZoom] = useState<number>(Zoom);
    let [mounted,setMounted] = useState<boolean>(false)
    let [temp] = useState<I_Map_temp>({
        datauniqid:'mp' + (Math.round(Math.random() * 10000000)),
        markers:[],
        dom:createRef(),
        map:undefined,
        L:(window as any).L,
        atimeout:undefined,
        btimeout:undefined,
        area:undefined,
        mapMarker:undefined,
        lastChange:undefined
    })
    let [Marker] = useState(new MarkerClass(()=>temp,()=>mapConfig));
    Marker.updateMarkers(markers);
    useEffect(()=>{if(mounted){Marker.addMarkersToMap(value)}},[JSON.stringify(Marker.htmls)])
    let changeView = !!draggable && !disabled;
    //maptype: "dreamy" | 'standard-day'  
    useEffect(()=>{
        let config = {
            key: mapApiKeys.map, maptype, poi, traffic,
            center: [value.lat, value.lng], zoom,
            dragging: !disabled,
            scrollWheelZoom: 'center',
            zoomControl
        }
        temp.map = new temp.L.Map(temp.dom.current, config);
        Marker.addMapMarker(value);
        temp.map.on('click', (e:any) => {
            if (attrs.onClick) { return }
            if (!!onChange) { let { lat, lng } = e.latlng; temp.map.panTo({ lat, lng }) }
        });
        temp.map.on('move', (e:any) => {
            if(!changeView){return}
            let { lat, lng } = e.target.getCenter()
            move({ lat, lng })
        });
        setMounted(true);
        update()
    },[])
    function handleArea() {
        if (temp.area) { temp.area.remove() }
        if (area && temp.L && temp.map) {
            let { color = 'dodgerblue', opacity = 0.1, radius = 1000, lat, lng } = area;
            temp.area = temp.L.circle([lat, lng], { color, fillColor: color, fillOpacity: opacity, radius }).addTo(temp.map);
        }
    }
    function ipLookUp() {
        $.ajax('http://ip-api.com/json')
            .then(
                (response:any) => {let { lat, lon } = response; flyTo({lat,lng:lon})},
                (data:any, status:any) => console.log('Request failed.  Returned status of', status)
            );
    }
    function handlePermission() {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') { console.log(result.state); }
            else if (result.state === 'prompt') { console.log(result.state); }
            else if (result.state === 'denied') { console.log(result.state); }
        });
    }
    async function getAddress(p:I_Map_coords) {
        let { lat, lng } = p;
        try {
            let res = await Axios.get(`https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`, { headers: { 'Api-Key': mapApiKeys.service, Authorization: false } });
            return res.status !== 200 ? '' : res.data.formatted_address;
        }
        catch (err) { return '' }
    }
    function goToCurrent() {
        if ("geolocation" in navigator) {
            handlePermission();
            // check if geolocation is supported/enabled on current browser
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let { latitude: lat, longitude: lng } = position.coords;
                    flyTo({lat, lng});
                },
                (error_message) => { ipLookUp() }
            )
        }
        else { ipLookUp() }
    }
    async function route(from = [35.699739, 51.338097], to = [35.699939, 51.338497]) {
        try {
            let param = { headers: { 'Api-Key': mapApiKeys.service } }
            let url = `https://api.neshan.org/v4/direction?type=car&origin=${from[0]},${from[1]}&destination=${to[0]},${to[1]}`;
            await Axios.get(url, param);
        }
        catch (err) { return '' }
    }
    async function showPath(path:string) {
        try { await Axios.post(`https://api.neshan.org/v3/map-matching?path=${path}`, { headers: { 'Api-Key': mapApiKeys.service } }); }
        catch (err) { return '' }
    }
    function flyTo(coords:I_Map_coords) {
        if (!coords) { return }
        let animate = GetDistance(value, coords) > 0.3;
        temp.map.flyTo([coords.lat, coords.lng], zoom, { animate, duration: 1 });
    }
    function panTo(coords:{lat:number,lng:number}) { temp.map.panTo(coords) }
    async function updateAddress(coords:I_Map_coords) {
        if(!mapConfig.address){return}
        let { lat, lng } = coords;
        clearTimeout(temp.atimeout);
        if(temp.lastChange && lat === temp.lastChange.lat && lng === temp.lastChange.lng){return}
        temp.lastChange = {lat,lng}
        setAddressLoading(true)
        temp.atimeout = setTimeout(async () => {
            let address = await getAddress({ lat, lng });
            setAddress(address);
            setAddressLoading(false);
            onChange({ lat, lng, address });
        }, 1200);
    }
    function change(value:I_Map_coords) {
        let {lat,lng} = value;
        onChange({ lat, lng, address });
        updateAddress(value)
    }
    function move(value:I_Map_coords) {
        if (temp.mapMarker) { temp.mapMarker.setLatLng(value) }
        clearTimeout(temp.atimeout); clearTimeout(temp.btimeout);
        temp.btimeout = setTimeout(async () => {setValue(value); change(value)}, 500);
    }
    function update(){
        flyTo(props.value);  
        handleArea()
        Marker.addMarkersToMap(value);
        updateAddress(value);
    }
    useEffect(()=>{if(mounted){handleArea()}},[JSON.stringify(area || {})])
    useEffect(()=>{if(mounted){update()}},[props.value.lat,props.value.lng,Zoom])
    function getContext() {
        let context:I_Map_context = { mapApiKeys, value,addressLoading,address, flyTo, goToCurrent,onClose,mapConfig,popupConfig,onChange }
        return context;
    }
    function renderPopup() {
        if (showPopup) {
            let props:I_MapUnit = {
                value,
                disabled,
                mapConfig: {...popupConfig,isPopup:true},
                onClose: () => setShowPopup(false),
                attrs: { ...attrs, style: { width: '100%', height: '100%', top: 0, position: 'fixed', left: 0, zIndex: 1000000, ...attrs.style }, onClick: undefined },
                onChange: (obj) => move(obj)
            }
            return <MapUnit {...props} />
        }
        return null
    }
    function header_node():I_RVD_node{return { html: <MapHeader /> }}
    function body_node():I_RVD_node{return { flex: 1, attrs: { ref: temp.dom }, html: '' }}
    function footer_node():I_RVD_node{return { html: <MapFooter /> }}
    return (
        <>
            <MapContext.Provider value={getContext()}>
                <RVD
                    rootNode={{
                        className: 'aio-input-map-container' + (mapConfig.draggable === false ? ' not-draggable' : ''), style: attrs.style,
                        onClick: () => {if (popupConfig) { setShowPopup(true) }},
                        column: [header_node(), body_node(), footer_node()]
                    }}
                />
            </MapContext.Provider>
            {renderPopup()}
        </>
    )
}
class MarkerClass{
    getHtml:(marker:I_Map_marker)=>string;
    getHtmls:()=>string[];
    updateMarkers:(markers:I_Map_marker[])=>void;
    getIcon:(html:string)=>any;
    addMapMarker:(value:{lat:number,lng:number})=>void;
    addMarkersToMap:(value:{lat:number,lng:number})=>void;
    markers:I_Map_marker[];
    marker:boolean | string;
    htmls:string[];
    constructor(getTemp:()=>I_Map_temp,getMapConfig:()=>I_Map_config){
        this.markers = [];
        this.htmls = [];
        this.updateMarkers = (markers)=>{
            this.markers = markers;
            this.htmls = this.getHtmls();
        }
        this.getHtml = (marker) => {
            let temp = getTemp();
            let {datauniqid:id} = temp;
            let { size = 20, color = 'orange', html, text,lat,lng } = marker;
            let innerSize = size * 0.4;
            let borderSize = Math.ceil(size / 10);
            let innerTop = Math.round(size / 25);
            let top = `-${(size / 2 + innerSize)}px`;
            let style1 = `transform:translateY(${top});flex-shrink:0;color:${color};width:${size}px;height:${size}px;border:${borderSize}px solid;position:relative;border-radius:100%;display:flex;align-items:center;justify-content:center;`
            let style2 = `position:absolute;left:calc(50% - ${innerSize}px);top:calc(100% - ${innerTop}px);border-top:${innerSize}px solid ${color};border-left:${innerSize}px solid transparent;border-right:${innerSize}px solid transparent;`
            let innerHtml = '', innerText = '';
            if (html) { innerHtml = JSXToHTML(html) }
            if (text) { innerText = JSXToHTML(text) }
            //data-lat va data-lng baraye tashkhise taghire mogheiat az rooye string
            return (`<div class='aio-input-map-marker' data-lat='${lat}' data-lng='${lng}' data-parent='${id}' style="${style1}">${innerHtml}<div class='aio-input-map-marker-text'>${innerText}</div><div style="${style2}"></div></div>`)
        }
        let mapConfig = getMapConfig();
        let {marker = true} = mapConfig;
        this.marker = typeof marker === 'boolean'?marker:this.getHtml(marker);
        this.getHtmls = ()=>{
            return this.markers.map((o:I_Map_marker)=>this.getHtml(o))
        }
        this.getIcon = (html) => {
            if(typeof html !== 'string'){return false}
            let temp = getTemp();
            return { icon: temp.L.divIcon({ html })}
        }
        this.addMarkersToMap = ()=>{
            let m = this.marker;
            if(m === false){return}
            let icon = m === true || m === undefined?undefined:this.getIcon(this.getHtml(m as I_Map_marker))
            return (lat:number,lng:number,temp:I_Map_temp)=>temp.mapMarker = temp.L.marker([lat, lng],icon).addTo(temp.map)
        }
        this.addMapMarker = (value) => {
            let temp = getTemp();
            if(this.marker === false){return}
            let icon = this.marker === true || this.marker === undefined?undefined:this.getIcon(this.marker)
            temp.mapMarker = temp.L.marker([value.lat, value.lng],icon).addTo(temp.map)
        }
        this.addMarkersToMap = (value) => {
            let temp = getTemp();
            if (!temp.map || !temp.L) { return }
            if (temp.markers.length) {
                for (let i = 0; i < temp.markers.length; i++) { temp.markers[i].remove(); }
                temp.markers = [];
            }
            for (let i = 0; i < this.htmls.length; i++) {
                let h = this.htmls[i];
                let icon = this.getIcon(h);
                let { lat = value.lat, lng = value.lng, popup = () => '' } = this.markers[i];
                let pres:any = popup(this.markers[i])
                if (typeof pres !== 'string') { try { pres = pres.toString() } catch { } }
                temp.markers.push(temp.L.marker([lat, lng], icon).addTo(temp.map).bindPopup(pres))
            }
        }
    }
}
function MapHeader() {
    let {value, flyTo, goToCurrent, mapApiKeys,mapConfig = {}, onClose}:I_Map_context = useContext(MapContext);
    let { title, search } = mapConfig;
    let [searchValue, setSearchValue] = useState('');
    let [searchResult, setSearchResult] = useState<{title:string,address:string,location:{x:number,y:number}}[]>([]);
    let [loading, setLoading] = useState(false);
    let [showResult, setShowResult] = useState(false);
    let dom = createRef();
    let timeout:any;
    async function changeSearch(searchValue:string) {
        let { lat, lng } = value;
        setSearchValue(searchValue);
        clearTimeout(timeout);
        if(!searchValue){
            setSearchResult([]);
            return;
        }
        timeout = setTimeout(async () => {
            try {
                let param = { headers: { 'Api-Key': mapApiKeys.service, 'Authorization': false } }
                let url = `https://api.neshan.org/v1/search?term=${decodeURI(searchValue)}&lat=${lat}&lng=${lng}`;
                setLoading(true); let res = await Axios.get(url, param); setLoading(false)
                if (res.status !== 200) { return }
                setSearchResult(res.data.items)
            }
            catch (err) { }
        }, 1000)
    }
    function input_node():I_RVD_node {
        if (!search) { return {} }
        let p:AI = {
            type:'text',placeholder:search,className:'aio-input-map-serach-input',value:searchValue,attrs:{ref:dom},options:searchResult,
            before:<div onClick={()=>goToCurrent()} className='align-vh'>{I(mdiCrosshairsGps,0.6)}</div>,
            after:()=>{
                let path,spin,size,onClick;
                if(loading){path = mdiLoading; spin = 0.4; size = 1;}
                else if(!!showResult && !!searchResult.length){path = mdiClose; size = 0.8; onClick = ()=>{changeSearch('')}}
                else {path = mdiMagnify; size=0.8;}
                return (<div className='aio-input-map-serach-icon align-vh' onClick={onClick}>{I(path,size,{spin})}</div>)
            },
            option:{
                text:'option.title',value:'option.location.x + "-" + option.location.y',close:()=>true,
                subtext:'option.address',
                onClick:(option)=>flyTo({lat:option.object.location.y, lng:option.object.location.x})
            },
            onChange:(searchValue:string)=>changeSearch(searchValue)
        }
        return {className: 'aio-input-map-search',html:<AIOInput {...p}/>}
    }
    function header_node():I_RVD_node {
        if (typeof title !== 'string' && !onClose) { return {} }
        return {
            row: [
                { show: !!onClose, html: I(mdiChevronRight,1), className: 'aio-input-map-close align-vh', onClick: () => {if(onClose){onClose()}} },
                { show: typeof title === 'string', html: title, className: 'aio-input-map-title align-v' },
            ]
        }
    }
    if (!search && !title && !onClose) { return null }
    return (
        <RVD
            rootNode={{
                className: 'aio-input-map-header of-visible' + (searchResult && searchResult.length && showResult ? ' aio-input-map-header-open' : ''),
                column: [header_node(), input_node()]
            }}
        />
    )
}
function MapFooter() {
    let {value,addressLoading,address,onClose, onChange,mapConfig = {}}:I_Map_context = useContext(MapContext);
    let { lat, lng } = value;
    function submit_node():I_RVD_node {
        if (!mapConfig.isPopup) { return {} }
        let {submitText = 'Submit'} = mapConfig;
        return { html: (<button className='aio-input-map-submit' onClick={async () => { onChange(value); if(onClose){onClose()} }}>{submitText}</button>) }
    }
    function details_node():I_RVD_node {
        if (!mapConfig.address) { return {} }
        return addressLoading?loading_node():{ className:'flex-1',column: [address_node(), coords_node()] }
    }
    function loading_node():I_RVD_node{return { html: I(mdiLoading,1,{spin:0.4}), className: 'align-v flex-1' }}
    function address_node():I_RVD_node{return { html: address, className: 'aio-input-map-address flex-1' }}
    function coords_node():I_RVD_node{return { show: !!lat && !!lng, html: () => `${lat} - ${lng}`, className: 'aio-input-map-coords' }}
    function root_node():I_RVD_node{return {className: 'aio-input-map-footer',row: [details_node(),submit_node()]}}
    if(!mapConfig.isPopup && !mapConfig.address){return null}
    return (<RVD rootNode={root_node()} />)
}
function GetDistance(p1:I_Map_coords, p2:I_Map_coords) {
    let { lat: lat1, lng: lon1 } = p1;
    let { lat: lat2, lng: lon2 } = p2;
    let rad = Math.PI / 180;
    let radius = 6371; //earth radius in kilometers
    return Math.acos(Math.sin(lat2 * rad) * Math.sin(lat1 * rad) + Math.cos(lat2 * rad) * Math.cos(lat1 * rad) * Math.cos(lon2 * rad - lon1 * rad)) * radius; //result in Kilometers
}