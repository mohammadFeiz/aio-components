import { LeafletEvent } from "leaflet";
import { FC, ReactNode } from "react";
import 'leaflet/dist/leaflet.css';
import './index.css';
type I_pos = [number, number];
export type I_marker = {
    pos: [number, number];
    html?: ReactNode;
    eventHandlers?: any;
};
export type I_shapeStyle = {
    stroke?: {
        color?: string;
        width?: number;
        dash?: string;
    };
    fill?: {
        color?: string;
        opacity?: number;
    };
};
export type I_circle = {
    type: 'circle';
    center: I_pos;
    radius?: number;
    style?: I_shapeStyle;
};
export type I_rect = {
    type: 'rect';
    points: I_pos[];
    style?: I_shapeStyle;
};
export type I_polyline = {
    type: 'polyline';
    points: I_pos[];
    style?: I_shapeStyle;
};
export type I_shape = I_circle | I_rect | I_polyline;
type I_Map = {
    children?: React.ReactNode;
    onChange?: (coords: I_pos) => void;
    zoom?: {
        value?: number;
        wheel?: boolean;
        control?: boolean;
        onChange?: (zoom: number) => void;
    };
    markers?: I_marker[];
    value?: I_pos;
    marker?: ReactNode | false;
    mapStyle?: any;
    attrs?: any;
    onClick?: () => void;
    dragging?: boolean;
    submitText?: string;
    onSubmit?: (pos: I_pos) => void;
    shapes?: I_shape[];
    footer?: ReactNode;
    layers?: I_layers;
    getSearchResult?: (searchValue: string) => Promise<I_searchResult[]>;
    onSearch?: (searchResult: I_searchResult) => void;
    mapRef?: any;
    whenReady?: () => void;
    onMoveEnd?: (e: LeafletEvent) => void;
    actionsRef?: any;
};
export type I_layers = {
    position: 'topright' | 'topleft';
    items: I_layerItem[];
};
export type I_layerItem = {
    name: string;
    markers?: I_marker[];
    shapes?: I_shape[];
    active?: boolean;
};
declare const AIMap: FC<I_Map>;
export default AIMap;
type I_searchResult = {
    text: string;
    value: string;
    pos: I_pos;
    subtext?: string;
    before?: ReactNode;
    after?: ReactNode;
};
