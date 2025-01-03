import React, { FC, ReactNode } from 'react';
import './index.css';
export type AP_props = {
    rtl?: boolean;
    id?: string;
};
export type AP_position = 'fullscreen' | 'center' | 'popover' | 'left' | 'right' | 'top' | 'bottom';
export type AP_attrsKey = 'backdrop' | 'modal' | 'header' | 'body' | 'footer';
export type AP_header = ((p: {
    close: () => void;
    state: any;
    setState: any;
}) => ReactNode) | {
    title?: string;
    subtitle?: string;
    before?: ReactNode;
    after?: ReactNode;
    onClose?: boolean | ((p: {
        state: any;
        setState: (state: any) => void;
    }) => void);
    attrs?: any;
};
export type AP_body = (p: {
    close: () => void;
    state?: any;
    setState?: (state: any) => void;
}) => ReactNode;
export type AP_footer = (p: {
    state: any;
    setState: (v: any) => void;
    close: () => void;
}) => ReactNode;
type AP_setAttrs = (mode: AP_attrsKey) => any;
export type AP_modal = {
    getTarget?: () => any;
    pageSelector?: string;
    limitTo?: string;
    maxHeight?: number | 'string';
    fixStyle?: (o: any, p: {
        targetLimit: any;
        pageLimit: any;
    }) => any;
    rtl?: boolean;
    id?: string;
    onClose?: boolean | (() => void);
    position?: AP_position;
    header?: AP_header;
    state?: any;
    footer?: AP_footer;
    body?: AP_body;
    animate?: boolean;
    fitHorizontal?: boolean;
    setAttrs?: AP_setAttrs;
};
export type AP_alert = {
    icon?: false | ReactNode;
    position?: AP_position;
    type: 'success' | 'error' | 'warning' | 'info';
    text?: ReactNode;
    subtext?: string;
    time?: number;
    className?: string;
    closeText?: string;
    animate?: boolean;
    onClose?: boolean | (() => void);
};
export type AP_snackebar = {
    id?: string;
    text: string;
    subtext?: string;
    icon?: ReactNode;
    time?: number;
    action?: {
        text: string;
        onClick: () => void;
    };
    type: 'success' | 'error' | 'warning' | 'info';
    verticalAlign?: 'start' | 'end';
    horizontalAlign?: 'start' | 'center' | 'end';
    onClose?: boolean | (() => void);
    attrs?: any;
};
export type AP_highlight = {
    dom: any;
    html: ReactNode;
    onClick?: () => void;
    mouseAccess?: boolean;
    attrs?: any;
    padding?: number;
    easing?: number | AP_easing;
    duration?: number;
};
export type AP_confirm = {
    title?: string;
    subtitle?: string;
    text?: ReactNode;
    submitText?: string;
    canselText?: string;
    onSubmit?: () => Promise<boolean>;
    onCansel?: () => void;
    setAttrs?: AP_setAttrs;
};
export type AP_prompt = {
    title?: string;
    subtitle?: string;
    text?: string;
    submitText?: string;
    canselText?: string;
    onSubmit?: (text: string) => Promise<boolean>;
    onCansel?: () => void;
    setAttrs?: AP_setAttrs;
};
export type AP_Snackebar = {
    getActions: (p: {
        add: (item: AP_snackebar) => void;
    }) => void;
    rtl: boolean;
};
export type AP_SnackebarItem = {
    item: AP_snackebar;
    onRemove: (id: string) => void;
    index: number;
    rtl: boolean;
};
export default class AIOPopup {
    rtl?: boolean;
    render: () => ReactNode;
    addModal: (p: AP_modal) => void;
    addHighlight: (p: AP_highlight) => void;
    removeHighlight: () => void;
    addAlert: (p: AP_alert) => void;
    removeModal: (arg?: string) => void;
    addSnackebar: (p: AP_snackebar) => void;
    getModals: () => AP_modal[];
    addConfirm: (p: AP_confirm) => void;
    addPrompt: (p: AP_prompt) => void;
    popupId?: string;
    popupsRef: React.RefObject<typeof Popups>;
    highlightRef: React.RefObject<typeof Highlight>;
    constructor(obj?: AP_props);
}
type AP_Popups = {
    ref: any;
    rtl: boolean;
};
declare const Popups: FC<AP_Popups>;
type AP_easing = 'linear' | 'easeInQuad' | 'easeInCubic' | 'easeInQuart' | 'easeInQuint' | 'easeInSine' | 'easeInExpo' | 'easeInCirc' | 'easeInBack' | 'easeOutQuad' | 'easeOutCubic' | 'easeOutQuart' | 'easeOutQuint' | 'easeOutSine' | 'easeOutExpo' | 'easeOutCirc' | 'easeOutBack' | 'easeInBounce' | 'easeInOutQuad' | 'easeInOutCubic' | 'easeInOutQuart' | 'easeInOutQuint' | 'easeInOutSine' | 'easeInOutExpo' | 'easeInOutCirc' | 'easeInOutBack' | 'easeInOutBounce' | 'easeOutBounce' | 'easeOutInQuad' | 'easeOutInCubic' | 'easeOutInQuart' | 'easeOutInQuint' | 'easeOutInSine' | 'easeOutInExpo' | 'easeOutInCirc' | 'easeOutInBack' | 'easeOutInBounce';
type AP_Highlight = {
    ref: any;
};
declare const Highlight: FC<AP_Highlight>;
export {};
