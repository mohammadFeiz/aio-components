import { ReactNode } from 'react';
import './index.css';
export type AP_position = 'fullscreen' | 'center' | 'popover' | 'left' | 'right' | 'top' | 'bottom';
export type AP_attrsKey = 'backdrop' | 'modal' | 'header' | 'body' | 'footer';
export type AP_header = ((p: {
    removeModal: () => void;
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
};
type AP_setAttrs = (mode: AP_attrsKey) => any;
export type AP_modal = {
    getTarget?: () => any;
    limitTo?: string;
    rtl?: boolean;
    id?: string;
    onClose?: boolean | (() => void);
    position?: AP_position;
    header?: AP_header;
    state?: any;
    footer?: ReactNode;
    body: ReactNode;
    animate?: boolean;
    fitHorizontal?: boolean;
    setAttrs?: AP_setAttrs;
};
export type AP_alert = {
    rtl?: boolean;
    icon?: false | ReactNode;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: ReactNode;
    text: string;
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
    align?: ['left' | 'center' | 'right', 'top' | 'bottom'];
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
    text: string;
    submitText?: string;
    canselText?: string;
    onSubmit?: () => Promise<boolean>;
    onCansel?: () => void;
    submitAttrs?: any;
    canselAttrs?: any;
    setAttrs?: AP_setAttrs;
};
export type AP_prompt = {
    title?: string;
    text: string;
    subtitle?: string;
    submitText?: string;
    canselText?: string;
    onSubmit?: (text: string) => Promise<boolean>;
    onCansel?: () => void;
    submitAttrs?: any;
    canselAttrs?: any;
    setAttrs?: AP_setAttrs;
};
type AP_removeModal = (arg?: string) => void;
type AP_addAlert = (p: AP_alert) => void;
type AP_addSnackebar = (item: AP_snackebar) => void;
type AP_addModal = (o: AP_modal) => void;
type AP_addHighlight = (highlight: AP_highlight) => void;
type AP_removeHighlight = () => void;
type AP_getModals = () => AP_modal[];
type AP_addConfirm = (item: AP_confirm) => void;
type AP_addPrompt = (item: AP_prompt) => void;
type AP_render = (caller?: string) => ReactNode;
export type AP_usePopup = {
    addAlert: AP_addAlert;
    addSnackebar: AP_addSnackebar;
    removeModal: AP_removeModal;
    addModal: AP_addModal;
    getModals: AP_getModals;
    addHighlight: AP_addHighlight;
    removeHighlight: AP_removeHighlight;
    render: AP_render;
    addConfirm: AP_addConfirm;
    addPrompt: AP_addPrompt;
};
export type I_usePopup = {
    addAlert: AP_addAlert;
    addSnackebar: AP_addSnackebar;
    removeModal: AP_removeModal;
    addModal: AP_addModal;
    getModals: AP_getModals;
    addHighlight: AP_addHighlight;
    removeHighlight: AP_removeHighlight;
    render: AP_render;
    addConfirm: AP_addConfirm;
    addPrompt: AP_addPrompt;
    portal: () => void;
};
declare const usePopup: (props?: {
    rtl?: boolean;
    id?: string;
}) => I_usePopup;
export default usePopup;
export type AP_SnackebarItem = {
    item: AP_snackebar;
    index: number;
};
export declare function Alert(props: AP_alert): void;
type AP_easing = 'linear' | 'easeInQuad' | 'easeInCubic' | 'easeInQuart' | 'easeInQuint' | 'easeInSine' | 'easeInExpo' | 'easeInCirc' | 'easeInBack' | 'easeOutQuad' | 'easeOutCubic' | 'easeOutQuart' | 'easeOutQuint' | 'easeOutSine' | 'easeOutExpo' | 'easeOutCirc' | 'easeOutBack' | 'easeInBounce' | 'easeInOutQuad' | 'easeInOutCubic' | 'easeInOutQuart' | 'easeInOutQuint' | 'easeInOutSine' | 'easeInOutExpo' | 'easeInOutCirc' | 'easeInOutBack' | 'easeInOutBounce' | 'easeOutBounce' | 'easeOutInQuad' | 'easeOutInCubic' | 'easeOutInQuart' | 'easeOutInQuint' | 'easeOutInSine' | 'easeOutInExpo' | 'easeOutInCirc' | 'easeOutInBack' | 'easeOutInBounce';
export declare class Loading {
    loader: any;
    constructor(loader?: string);
    private getLoader_0;
    private getLoaderItem_0;
    getLoader: (id: string) => string;
    show: (id: string, parentSelector?: string) => void;
    hide: (id: string) => void;
}
