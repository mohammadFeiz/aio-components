import React from 'react';
import AIOPopup, { AP_alert, AP_confirm, AP_modal, AP_prompt, AP_snackebar } from './../../npm/aio-popup/index.tsx';
import './index.css';
export type I_RSA_props = {
    rtl?: boolean;
    maxWidth?: number;
    id: string;
    nav: I_RSA_nav;
    side?: I_RSA_side;
    title?: (nav: I_RSA_navItem) => string;
    subtitle?: (nav: I_RSA_nav) => string;
    headerContent?: () => React.ReactNode;
    header?: false | React.ReactNode | (() => React.ReactNode);
    body: (activeNavItem: I_RSA_navItem) => React.ReactNode;
    theme?: any;
    splashTime?: number;
    splash?: () => React.ReactNode;
    className?: string;
};
export type I_RSA_setNavId = (navId: string) => void;
export type I_RSA_getNavId = () => string;
export type I_RSA_render = () => React.ReactNode;
export type I_RSA_closeSide = () => void;
export type I_RSA_openSide = () => void;
export type I_RSA_navItem = {
    id: string;
    marquee?: boolean;
    disabled?: boolean;
    text: string | (() => string);
    icon?: React.ReactNode | (() => React.ReactNode);
    items?: I_RSA_navItem[];
    show?: () => boolean;
    render?: () => React.ReactNode;
};
export type I_RSA_nav = {
    items: () => I_RSA_navItem[];
    id?: string;
    header?: () => React.ReactNode;
    footer?: () => React.ReactNode;
    cache?: boolean;
    nested?: boolean;
};
export type I_RSA_sideItem = {
    icon?: React.ReactNode | (() => React.ReactNode);
    text: string;
    attrs?: any;
    show?: () => boolean;
    onClick: Function;
};
export type I_RSA_side = {
    items: I_RSA_sideItem[] | (() => I_RSA_sideItem[]);
    header?: () => React.ReactNode;
    footer?: () => React.ReactNode;
    attrs?: any;
};
export type I_ReactSuperApp = {
    rootProps: I_RSA_props;
    getActions: (p: any) => void;
    popup: AIOPopup;
};
export type I_RSA_Navigation = {
    nav: I_RSA_nav;
    navId: string;
    setNavId: (navId: string) => void;
    rtl: boolean;
    navItems: I_RSA_navItem[];
    type: 'bottom' | 'side';
};
export type I_RSA_SideMenu = {
    attrs: any;
    header?: () => React.ReactNode;
    items: I_RSA_sideItem[];
    onClose: () => void;
    footer?: () => React.ReactNode;
};
export default class RSA {
    backButtonCallBack: true | Function;
    rootProps: I_RSA_props;
    popup: AIOPopup;
    getNavId: I_RSA_getNavId;
    setNavId: I_RSA_setNavId;
    removeModal: (id?: string) => void;
    openSide: I_RSA_openSide;
    closeSide: I_RSA_closeSide;
    addModal: (p: AP_modal) => void;
    setBackButtonCallBack: (fn: any) => void;
    render: I_RSA_render;
    addAlert: (p: AP_alert) => void;
    addSnackebar: (p: AP_snackebar) => void;
    addConfirm: (p: AP_confirm) => void;
    addPrompt: (p: AP_prompt) => void;
    constructor(props: I_RSA_props);
}
