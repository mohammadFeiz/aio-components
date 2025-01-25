import { FC, ReactNode } from "react";
export type I_location = {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number;
    speed: number;
    bearing: number;
    is_moving: boolean;
    time: number;
};
export type I_bgl_config = {
    url?: string;
    stationaryRadius?: number;
    distanceFilter?: number;
    notificationTitle?: string;
    notificationText?: string;
    debug?: boolean;
    interval?: number;
    fastestInterval?: number;
    activitiesInterval?: number;
    stopOnTerminate?: boolean;
    startOnBoot?: boolean;
    maxLocations?: number;
    saveBatteryOnBackground?: boolean;
    syncThreshold?: number;
    notificationsEnabled?: boolean;
};
export type I_bgl_cell = {
    key: keyof I_bgl_config;
    type: I_bgl_type;
    desc: string;
};
export type I_bgl_row = I_bgl_cell[];
export type I_bgl_type = 'text' | 'number' | 'table' | 'checkbox';
export declare function getDefaultBglConfig(): {
    stationaryRadius: number;
    distanceFilter: number;
    notificationTitle: string;
    notificationText: string;
    debug: boolean;
    interval: number;
    fastestInterval: number;
    activitiesInterval: number;
    stopOnTerminate: boolean;
    startOnBoot: boolean;
    maxLocations: number;
    saveBatteryOnBackground: boolean;
    syncThreshold: any;
    url: any;
    propertyNames: {
        latitude: string;
        longitude: string;
        speed: string;
        bearing: string;
        time: string;
    };
};
export declare function getBGLKeys(): I_bgl_row[];
export declare class BGL {
    token?: string;
    addLog?: (v: string) => void;
    constructor(p?: {
        token?: string;
        addLog?: (v: string) => void;
    });
    textToObj: (text?: string) => any;
    setConfig: (config?: I_bgl_config) => void;
    start: (fn: (v: I_location) => void) => void;
    stop: () => any;
    getConfig: (fn: (config: any) => void) => void;
    getCurrentLocation: (success: (location: I_location) => void, error: (message: string) => void) => void;
    getLocations: (success: (locations: I_location[]) => void, error: (message: string) => void) => void;
}
export type I_tableColumns = {
    [column: string]: 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB';
};
export type I_tableRow = {
    [column: string]: any;
};
export type I_table = {
    name: string;
    columns: I_tableColumns;
    primaryKey: string;
};
export type I_SQL = {
    dbName: string;
    tables: I_table[];
    onError: (error: string) => void;
};
export interface I_sqlRows {
    length: number;
    item(index: number): any;
}
type I_result<T> = {
    success: boolean;
    result: string | T;
};
export declare class SQL {
    parameter: I_SQL;
    db: any;
    pkDic: {
        [tableName: string]: string;
    };
    constructor(p: I_SQL);
    private openDb;
    private createTables;
    private getQString;
    private getRowFn;
    private getKeyValues;
    private insert;
    private update;
    private getTableByName;
    private getPKValue;
    getRow: (tableName: string, searchObj: {
        [key: string]: string | number;
    }, addObj?: I_tableRow) => Promise<I_result<I_tableRow | null>>;
    getRows: (tableName: string, searchObj: {
        [key: string]: string | number;
    }) => Promise<I_result<I_tableRow[]>>;
    getAllRows: (tableName: string) => Promise<I_result<I_sqlRows>>;
    addRow: (tableName: string, row: I_tableRow) => Promise<I_result<true>>;
    private addIfNotExist;
    editRow: (tableName: string, row: I_tableRow, addObj?: I_tableRow) => Promise<I_result<true>>;
    searchRows: (tableName: string, searchFn: (row: I_tableRow) => boolean) => Promise<I_result<I_tableRow[]>>;
}
type I_AIOCordova = {
    backButton?: (p: {
        exitApp: () => void;
    }) => void;
};
type I_AIOCordova_capture = (p: {
    onSuccess: (imageData: string) => void;
    onError: (error: string) => void;
    quality: number;
    returnType: 'base64' | 'uri';
    sourceType: 'camera' | 'library';
}) => void;
type I_AIOCordova_ocr = (p: {
    imageURI: string;
    onSuccess: (text: string) => void;
    onError: (error: string) => void;
}) => void;
export declare class AIOCordova {
    p?: I_AIOCordova;
    storageSql: SQL;
    constructor(p?: I_AIOCordova);
    backButton: (e: any) => void;
    exitApp: () => any;
    vibrate: (times: number[]) => void;
    capture: I_AIOCordova_capture;
    ocr: I_AIOCordova_ocr;
    base64ToBlob: (p: {
        base64: string;
        mime: string;
    }) => Blob;
    saveBase64ToFile: (p: {
        base64: string;
        fileName: string;
        onSuccess: () => void;
        onError: (error: string) => void;
    }) => void;
    getPermissions: (getMessage: (message: string) => void) => void;
    enableBackgroundMode: () => void;
    enablePresmissions: (onSuccess: () => void, onError: (error: string) => void) => void;
    speak: (text: string, lang: 'fa-IR' | 'en-US', onError?: (err: string) => void) => void;
    handleStorageRes: (res: {
        success: boolean;
        result: any;
    }) => void;
    storageLoad: (name: string, def: any) => Promise<any>;
    storageSave: (name: string, value: any) => Promise<void>;
}
type I_AIOCordovaComponent = {
    startWindows: () => ReactNode;
    startAndroid: (aioCordova: AIOCordova) => ReactNode;
    backButton?: (p: {
        exitApp: () => void;
    }) => void;
};
export declare const AIOCordovaComponent: FC<I_AIOCordovaComponent>;
export {};
