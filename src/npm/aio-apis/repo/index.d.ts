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
        interval?: number;
    };
    mock?: {
        delay: number;
        methodName: string;
    };
    errorResult?: any;
    showMessage?: (obj: {
        response: any;
        success: boolean;
        result: any;
        message?: string;
    }) => {
        type: 'success' | 'warning' | 'error' | 'info';
        time?: number;
        text: string;
        subtext?: string;
    } | false;
    headers?: any;
    token?: string;
    loader?: string;
    loadingParent?: string;
};
type I_cachedApi = {
    api: AA_api;
    value: any;
};
export default class AIOApis {
    props: {
        id: string;
        token: string;
        loader?: string;
        getResult: (response: any) => any;
        onCatch: (err: any, config: AA_api) => string;
        headers?: any;
        errorResult?: any;
        lang?: 'en' | 'fa';
    };
    token: string;
    private cache;
    getCachedValue: Cache["getCachedValue"];
    updateCache: Cache["updateCacheValue"];
    setCache: Cache["setCache"];
    removeCache: Cache["removeCache"];
    apisThatAreInLoadingTime: {
        [apiName: string]: boolean | undefined;
    };
    constructor(props: {
        id: string;
        token: string;
        loader?: string;
        getResult: (response: any) => any;
        onCatch: (err: any, config: AA_api) => string;
        headers?: any;
        errorResult?: any;
        lang?: 'en' | 'fa';
    });
    setToken: (token: string) => void;
    addAlert: (p: {
        type: 'success' | 'error' | 'warning' | 'info';
        text: string;
        subtext?: string;
        time?: number;
    }) => void;
    getUrlQueryParam: (params?: string | {
        [key: string]: string;
    }) => string;
    private responseToResult;
    private showErrorMessage;
    request: (api: AA_api, isCalledByCache?: boolean) => Promise<any>;
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
type I_callApi = (cachedApi: I_cachedApi) => Promise<any>;
declare class Cache {
    private storage;
    private callApi;
    private intervals;
    constructor(storage: Storage, callApi: I_callApi);
    private getKey;
    private detectIntervalChange;
    private handleIntervals;
    private SetInterval;
    private ClearInterval;
    private getCachedApi;
    private updateCacheByKey;
    getCachedValue: (apiName: string, cacheName: string) => any;
    updateCacheValue: (apiName: string, cacheName: string) => Promise<void>;
    setCache: (apiName: string, cacheName: string, changeObj: Partial<I_cachedApi>) => void;
    private removeByKey;
    removeCache: (apiName: string, cacheName?: string) => void;
}
type I_storage_model = {
    [key: string]: {
        value: any;
        saveTime: number;
        expiredIn: number;
    };
};
export declare class Storage {
    private model;
    id: string;
    constructor(id: string);
    init: () => void;
    copy: (v: any) => any;
    setModel: (model: I_storage_model) => I_storage_model;
    getNow: () => number;
    save: (field: string, value: any, expiredIn?: number) => I_storage_model;
    remove: (field: string) => I_storage_model;
    removeKeyFromObject: (obj: {
        [key: string]: any;
    }, key: string) => {
        [key: string]: any;
    };
    isExpired: (field: string) => boolean;
    load: (field: string, def?: any, expiredIn?: number) => any;
    clear: () => I_storage_model;
    download: (file: any, name: string) => void;
    export: () => void;
    read: (file: File) => Promise<any>;
    import: (file: any) => Promise<I_storage_model>;
    getKeys: () => string[];
}
export {};
