import React from 'react';
import './index.css';
type AA_method = 'post' | 'get' | 'delete' | 'put' | 'patch';
type AA_success_fn = (p: {
    result: any;
    appState: any;
    parameter: any;
}) => string | boolean;
type AA_message = {
    error?: boolean | string;
    success?: AA_success_fn | string | boolean;
    time?: number;
    type?: 'alert' | 'snackebar';
};
type AA_onCatch = (err: any, config: AA_apiSetting) => string;
type AA_getError = (response: any, confing: AA_apiSetting) => string | false;
type AA_cache = {
    name: string;
    time: number;
};
export type AA_props = {
    id: string;
    getAppState?: () => any;
    token?: string;
    loader?: () => React.ReactNode;
    onCatch?: AA_onCatch;
    getError?: AA_getError;
    lang: 'en' | 'fa';
};
export type AA_apiSetting = {
    description?: string | ((p: any) => string);
    message?: AA_message;
    cache?: AA_cache;
    loading?: boolean;
    loadingParent?: string;
    token?: string;
    onCatch?: AA_onCatch;
    getError?: AA_getError;
    errorResult?: any;
    onError?: (result: string) => void;
    onSuccess?: (result: any) => void;
};
type AA_getStorage = (name: string, def?: any) => any;
type AA_setStorage = (key: string, value: any) => void;
type AA_removeStorage = (key: string) => void;
type AA_setToken = (token?: string) => void;
type AA_handleLoading = (state: boolean, apiName: string, config: AA_apiSetting) => void;
type AA_messageParameter = {
    result: any;
    message: AA_message;
    description: string;
};
export type AA_api = AA_apiSetting & {
    method?: AA_method;
    url: string;
    body?: any;
    parameter?: any;
    getResult?: (response: any) => any;
};
type AA_request_params = {
    body?: any;
    method: AA_method;
    url: string;
    config?: AA_apiSetting;
    getResult: (response: any) => any;
    parameter?: any;
};
export default class AIOApis {
    storage: Storage;
    request: (setting: AA_api) => any;
    getAppState: () => any;
    setStorage: AA_setStorage;
    getStorage: AA_getStorage;
    removeStorage: AA_removeStorage;
    setToken: AA_setToken;
    getLoading: (id: string) => string;
    handleLoading: AA_handleLoading;
    responseToResult: (p: AA_request_params) => Promise<any>;
    requestFn: (p: AA_request_params) => Promise<any>;
    addAlert: (p: {
        type: 'success' | 'error' | 'warning' | 'info';
        text: string;
        subtext?: string;
        time?: number;
        alertType?: 'alert' | 'snackebar';
    }) => void;
    handleCacheVersions: (cacheVersions: {
        [key: string]: number;
    }) => {
        [key: string]: boolean;
    };
    showErrorMessage: (m: AA_messageParameter) => void;
    showSuccessMessage: (m: AA_messageParameter) => void;
    constructor(props: AA_props);
}
type I_storage_model = {
    [key: string]: any;
};
type I_storage_time = {
    [key: string]: number;
};
declare class Storage {
    model: I_storage_model;
    time: I_storage_time;
    init: () => void;
    saveStorage: (model: I_storage_model, time: I_storage_time) => void;
    getParent: (field: string) => I_storage_model | undefined;
    removeValueByField: (field: string) => I_storage_model;
    setValueByField: (field: string, value: any) => I_storage_model;
    getValueByField: (field: string) => any;
    save: (field: string, value: any) => I_storage_model;
    remove: (field: string, callback?: () => void) => I_storage_model;
    load: (field: string, def?: any, time?: number) => any;
    clear: () => void;
    getModel: () => I_storage_model;
    constructor(id: string);
}
export {};
