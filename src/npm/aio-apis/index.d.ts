import React from 'react';
import { AIODate, Storage } from './../../npm/aio-utils/index';
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
    baseUrl: string;
    token?: string;
    loader?: () => React.ReactNode;
    onCatch?: AA_onCatch;
    getError?: AA_getError;
    apis: AA_apis;
    mock?: any;
    lang: 'en' | 'fa';
};
export type AA_apiSetting = {
    description?: string;
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
    mockResult?: boolean;
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
export type AA_apis = {
    [key: string]: AA_api;
};
export type AA_api = AA_apiSetting & {
    method?: AA_method;
    getUrl?: (baseUrl: string) => string;
    getBody?: (p: any) => any;
    getResult?: (response: any) => any;
};
export type AA_fn = {
    [key: string]: (p?: any, setting?: AA_apiSetting) => any;
};
type AA_request_params = {
    id: string;
    body?: any;
    method: AA_method;
    url: string;
    config?: AA_apiSetting;
    getResult: (response: any) => any;
    mockResult: boolean;
    parameter?: any;
};
export default class AIOApis {
    storage: Storage;
    fn: AA_fn;
    getAppState: () => any;
    setStorage: AA_setStorage;
    getStorage: AA_getStorage;
    removeStorage: AA_removeStorage;
    setToken: AA_setToken;
    getLoading: (id: string) => string;
    handleLoading: AA_handleLoading;
    responseToResult: (p: AA_request_params) => Promise<any>;
    request: (p: AA_request_params) => Promise<any>;
    addAlert: (p: {
        type: 'success' | 'error' | 'warning' | 'info';
        text: string;
        subtext?: string;
        message: AA_message;
    }) => void;
    handleCacheVersions: (cacheVersions: {
        [key: string]: number;
    }) => {
        [key: string]: boolean;
    };
    showErrorMessage: (m: AA_messageParameter) => void;
    showSuccessMessage: (m: AA_messageParameter) => void;
    dateToString: (date: any, pattern?: string) => string;
    dateToNumber: (date: any) => any;
    dateToArray: (date: any, jalali?: boolean) => number[];
    DATE: AIODate;
    constructor(props: AA_props);
}
export {};
