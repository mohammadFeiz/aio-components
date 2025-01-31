export type AA_api<T> = {
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
    headers?: any;
    token?: string;
    loader?: string;
    loadingParent?: string;
    getResult: (data: any) => T;
    onError?: (error: string) => void;
    onSuccess?: (result: T) => void;
    onCatch: string;
    successMessage?: (p: {
        response: any;
        result: T;
    }) => string;
    errorMessage?: (p: {
        response: any;
        message: string;
    }) => string | false;
};
type I_cachedApi<T> = {
    api: AA_api<T>;
    value: any;
};
export default class AIOApis {
    props: {
        id: string;
        token: string;
        loader?: string;
        onCatch: {
            [key: string]: (err: any, api: AA_api<any>) => string;
        };
        headers?: any;
        lang?: 'en' | 'fa';
    };
    token: string;
    private cache;
    getCachedValue: Cache["getCachedValue"];
    fetchCachedValue: Cache["fetchCachedValue"];
    editCachedExpiredIn: Cache["editCachedExpiredIn"];
    editCachedInterval: Cache["editCachedInterval"];
    removeCache: Cache["removeCache"];
    apisThatAreInLoadingTime: {
        [apiName: string]: boolean | undefined;
    };
    constructor(props: {
        id: string;
        token: string;
        loader?: string;
        onCatch: {
            [key: string]: (err: any, api: AA_api<any>) => string;
        };
        headers?: any;
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
    private loading;
    private handleMock;
    callCache: (api: AA_api<any>) => Promise<any>;
    request: <T>(api: AA_api<T>, isCalledByCache?: boolean) => Promise<false | T>;
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
    private intervals;
    constructor(storage: Storage, callApi: I_callApi);
    private getKey;
    private detectIntervalChange;
    private SetInterval;
    private ClearInterval;
    private getCachedApi;
    private updateCacheByKey;
    getCachedValue: (apiName: string, cacheName: string) => any;
    fetchCachedValue: (apiName: string, cacheName: string) => Promise<void>;
    setCache: (apiName: string, cacheName: string, cachedApi: I_cachedApi<any>) => void;
    private editCache;
    editCachedExpiredIn: (apiName: string, cacheName: string, expiredIn: number) => void;
    editCachedInterval: (apiName: string, cacheName: string, interval: number) => void;
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
