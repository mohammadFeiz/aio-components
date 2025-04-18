import { Storage } from 'aio-utils';
export type AA_api = {
    description: string;
    name: string;
    method: 'post' | 'get' | 'delete' | 'put' | 'patch';
    url: string;
    body?: any;
    loading?: boolean;
    cache?: {
        name: string;
        expiredIn?: number;
    };
    mock?: (obj: any) => {
        status: number;
        data: any;
    };
    mockDelay?: number;
    headers?: any;
    token?: string;
    showError?: boolean;
    loader?: string;
    loadingParent?: string;
    retries?: number[];
    queryParams?: {
        [key: string]: any;
    };
    lastSuccess?: {
        enable: boolean;
        expiredIn?: number;
        saveCondition?: (p: {
            response: any;
        }) => boolean;
        loadIn?: 'unsuccess' | 'always';
    };
};
type I_cachedApi<T> = {
    api: AA_api;
    value: any;
};
export default class AIOApis {
    props: {
        id: string;
        token: string;
        loader?: string;
        handleErrorMessage: (err: any, api: AA_api) => string | false;
        headers?: any;
        lang?: 'en' | 'fa';
        onBeforeRequest?: (api: AA_api) => Promise<{
            api?: AA_api;
            result?: any;
        }>;
        onAfterRequest?: (api: AA_api, result: {
            success: boolean;
            response: any;
            errorMessage: string;
        }) => {
            success: boolean;
            response: any;
            errorMessage: string;
        } | undefined;
    };
    token: string;
    lsc: LastSuccess;
    currentError: string;
    private cache;
    getCachedValue: Cache["getCachedValue"];
    fetchCachedValue: Cache["fetchCachedValue"];
    removeCache: Cache["removeCache"];
    apisThatAreInLoadingTime: {
        [apiName: string]: boolean | undefined;
    };
    private DATE;
    constructor(props: {
        id: string;
        token: string;
        loader?: string;
        handleErrorMessage: (err: any, api: AA_api) => string;
        headers?: any;
        lang?: 'en' | 'fa';
    });
    getNow: (jalali?: boolean) => number[];
    setToken: (token: string) => void;
    addAlert: (p: {
        type: 'success' | 'error' | 'warning' | 'info';
        title?: string;
        text: string;
        time?: number;
    }) => void;
    getUrlQueryParam: (params?: string | {
        [key: string]: string;
    }) => string;
    private responseToResult;
    private loading;
    private handleMock;
    callCache: (api: AA_api) => Promise<any>;
    requestFn: <T>(api: AA_api, isRetry?: boolean) => Promise<{
        errorMessage?: string;
        success: boolean;
        response: T;
    }>;
    retries: <T>(api: AA_api, times: number[]) => Promise<{
        errorMessage?: string;
        success: boolean;
        response: T;
    }>;
    request: <T>(api: AA_api) => Promise<{
        errorMessage?: string;
        success: boolean;
        response: T;
    }>;
}
declare class LastSuccess {
    private storage;
    constructor(id: string);
    private isEnable;
    private getFromStroage;
    get: (api: AA_api, type: 'always' | 'unsuccess') => any;
    set: (api: AA_api, response: any) => void;
}
export type I_mock = {
    url: string;
    delay: number;
    method: 'post' | 'get' | 'delete' | 'put' | 'patch';
    result: ((body: any) => {
        status: number;
        data: any;
    });
};
type I_callApi = (cachedApi: I_cachedApi<any>) => Promise<any>;
declare class Cache {
    private storage;
    private callApi;
    constructor(storage: Storage, callApi: I_callApi);
    private updateCacheByKey;
    getCachedValue: (apiName: string, cacheName: string) => any;
    fetchCachedValue: (apiName: string, cacheName: string) => Promise<void>;
    setCache: (apiName: string, cacheName: string, cachedApi: I_cachedApi<any>) => void;
    removeCache: (apiName: string, cacheName?: string) => void;
}
export declare const CreateInstance: <T extends Record<string, any>>(inst: T) => T;
export {};
