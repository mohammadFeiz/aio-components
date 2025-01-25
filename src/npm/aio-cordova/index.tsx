import { FC, ReactNode, useEffect, useRef, useState } from "react";

declare var BackgroundGeolocation: any;
declare var cordova: any;
declare var TTS: { speak: (arg0: { text: string; locale: "fa-IR" | "en-US"; rate: number; }) => void; };
//cordova plugin add cordova-plugin-tts@latest
//cordova plugin add cordova-sqlite-storage
//cordova plugin add cordova-plugin-camera
//cordova plugin add cordova-plugin-mlkit


export type I_location = {
    latitude: number,    // عرض جغرافیایی
    longitude: number,   // طول جغرافیایی
    accuracy: number,    // دقت (در متر)
    altitude: number,    // ارتفاع (در متر)
    speed: number,       // سرعت (در متر بر ثانیه)
    bearing: number,     // زاویه (در درجه)
    is_moving: boolean,  // آیا کاربر در حال حرکت است
    time: number,        // زمان (به میلی‌ثانیه)
}
export type I_bgl_config = {
    url?: string,
    stationaryRadius?: number,
    distanceFilter?: number,
    notificationTitle?: string,
    notificationText?: string,
    debug?: boolean,
    interval?: number,
    fastestInterval?: number,
    activitiesInterval?: number,
    stopOnTerminate?: boolean,
    startOnBoot?: boolean,
    maxLocations?: number,
    saveBatteryOnBackground?: boolean,
    syncThreshold?: number,
    notificationsEnabled?: boolean
}
export type I_bgl_cell = { key: keyof I_bgl_config, type: I_bgl_type, desc: string }
export type I_bgl_row = I_bgl_cell[]
export type I_bgl_type = 'text' | 'number' | 'table' | 'checkbox'
export function getDefaultBglConfig() {
    return {
        stationaryRadius: 4,
        distanceFilter: 4,
        notificationTitle: 'Background tracking',
        notificationText: 'enabled',
        debug: false,
        interval: 3000,
        fastestInterval: 5000,
        activitiesInterval: 10000,
        stopOnTerminate: false,
        startOnBoot: false,
        maxLocations: 500,
        saveBatteryOnBackground: false,
        syncThreshold: undefined,
        url: undefined,
        propertyNames: { latitude: 'lat', longitude: 'lng', speed: 'speed', bearing: 'bearing', time: 'time' }
    }
}
export function getBGLKeys(): I_bgl_row[] {
    return [
        [{ key: 'url', type: 'text', desc: 'send location to this address' }],
        [
            { key: 'stationaryRadius', type: 'number', desc: 'Stationary radius in meters. When stopped, the minimum distance the device must move beyond the stationary location for aggressive background-tracking to engage.' },
            { key: 'distanceFilter', type: 'number', desc: 'The minimum distance (measured in meters) a device must move horizontally before an update event is' }
        ],
        [
            { key: 'notificationTitle', type: 'text', desc: 'notification title' },
            { key: 'notificationText', type: 'text', desc: 'notification text' }
        ],
        [
            { key: 'debug', type: 'checkbox', desc: 'When enabled, the plugin will emit sounds for life-cycle events of background-geolocation! See debugging sounds table.' },
            { key: 'saveBatteryOnBackground', type: 'checkbox', desc: 'Switch to less accurate significant changes and region monitory when in background' }
        ],
        [
            { key: 'interval', type: 'number', desc: 'The minimum time interval between location updates in milliseconds' },
            { key: 'fastestInterval', type: 'number', desc: 'Fastest rate in milliseconds at which your app can handle location updates.' },

        ],
        [
            { key: 'activitiesInterval', type: 'number', desc: 'Rate in milliseconds at which activity recognition occurs. Larger values will result in fewer activity detections while improving battery life.' },
            { key: 'notificationsEnabled', type: 'text', desc: 'Enable/disable local notifications when tracking and syncing locations' },
        ],
        [
            { key: 'stopOnTerminate', type: 'checkbox', desc: 'Enable this in order to force a stop() when the application terminated (e.g. on iOS, double-tap home button, swipe away the app).' },
            { key: 'startOnBoot', type: 'checkbox', desc: 'Start background service on device boot.' }
        ],
        [
            { key: 'maxLocations', type: 'number', desc: 'Limit maximum number of locations stored into db' },
            { key: 'syncThreshold', type: 'number', desc: 'Specifies how many previously failed locations will be sent to server at once' }
        ],

    ]
}
export class BGL {
    token?: string;
    addLog?: (v: string) => void
    constructor(p?: { token?: string, addLog?: (v: string) => void }) {
        const { token, addLog } = p || {}
        this.token = token;
        this.addLog = addLog;
    }
    textToObj = (text?: string) => {
        if (!text) { return }
        try { return JSON.parse(text) }
        catch { return }
    }
    setConfig = (config?: I_bgl_config) => {
        const {
            stationaryRadius = 4,
            distanceFilter = 4,
            notificationTitle = 'Background tracking',
            notificationText = 'enabled',
            debug = false,
            interval = 3000,
            fastestInterval = 5000,
            activitiesInterval = 10000,
            stopOnTerminate = false,
            startOnBoot = false,
            maxLocations = 500,
            saveBatteryOnBackground = false,
            syncThreshold,
            url
        } = config || {}
        let httpHeaders = this.token ? { authorization: this.token } : undefined;
        let postTemplate = { lat: `@latitude`, lng: `@longitude`, bearing: '@bearing', time: '@time', speed: '@speed' }
        const obj = {
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
            //Desired accuracy in meters. Possible values [HIGH_ACCURACY, MEDIUM_ACCURACY, LOW_ACCURACY, PASSIVE_ACCURACY]. Accuracy has direct effect on power drain. Lower accuracy = lower power drain.
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            //Stationary radius in meters. When stopped, the minimum distance the device must move beyond the stationary location for aggressive background-tracking to engage.
            stationaryRadius,
            //The minimum distance (measured in meters) a device must move horizontally before an update event is
            distanceFilter,
            notificationTitle,
            notificationText,
            //When enabled, the plugin will emit sounds for life-cycle events of background-geolocation! See debugging sounds table.
            debug,
            //The minimum time interval between location updates in milliseconds
            interval,
            //Fastest rate in milliseconds at which your app can handle location updates.
            fastestInterval,
            activitiesInterval,
            //Enable this in order to force a stop() when the application terminated (e.g. on iOS, double-tap home button, swipe away the app).
            stopOnTerminate,
            //Start background service on device boot.
            startOnBoot,
            //Limit maximum number of locations stored into db
            maxLocations,
            //Switch to less accurate significant changes and region monitory when in background
            saveBatteryOnBackground,
            //Specifies how many previously failed locations will be sent to server at once
            syncThreshold,
            url,
            //Optional HTTP headers sent along in HTTP request
            httpHeaders,
            // customize post properties
            postTemplate
        }
        if (this.addLog) {
            this.addLog(`received bgl config => ${JSON.stringify({
                distanceFilter: obj.distanceFilter,
                postTemplate: obj.postTemplate,
                interval: obj.interval
            })}`)
        }
        BackgroundGeolocation.configure(obj);
    }
    start = (fn: (v: I_location) => void): void => {
        BackgroundGeolocation.start();
        BackgroundGeolocation.on('location', function (location: I_location) { fn(location); });
    }
    stop = () => BackgroundGeolocation.stop();
    getConfig = (fn: (config: any) => void) => {
        BackgroundGeolocation.getConfig(function (config: any) {
            fn(config);
        });
    }
    getCurrentLocation = (success: (location: I_location) => void, error: (message: string) => void) => {
        try {
            BackgroundGeolocation.getCurrentLocation(
                (location: I_location) => success(location),
                (code: number, err: string) => {
                    let codeMessage: string;
                    try { codeMessage = ['PERMISSION_DENIED', 'LOCATION_UNAVAILABLE', 'TIMEOUT'][code - 1]; }
                    catch { codeMessage = '' }
                    error(`${codeMessage} - ${err}`)
                },
                { timeout: 5000, maximumAge: 5000, enableHighAccuracy: true }
            )
        }
        catch (err: any) { error(err.message) }
    }
    getLocations = (success: (locations: I_location[]) => void, error: (message: string) => void) => {
        BackgroundGeolocation.getLocations(
            (locations: I_location[]) => success(locations),
            () => error('error in getLocations')
        );
    }
}

export type I_tableColumns = { [column: string]: 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB' }
export type I_tableRow = { [column: string]: any }
export type I_table = { name: string, columns: I_tableColumns, primaryKey: string }
export type I_SQL = {
    dbName: string,
    tables: I_table[]
    onError: (error: string) => void
}
export interface I_sqlRows {
    length: number;
    item(index: number): any;
}
type I_result<T> = { success: boolean, result: string | T }
export class SQL {
    parameter: I_SQL;
    db: any;
    pkDic: { [tableName: string]: string } = {}
    constructor(p: I_SQL) {
        this.parameter = p;
        const res = this.openDb()
        if (res) { this.createTables(); }
    }
    private openDb = (): boolean => {
        //@ts-ignore
        try { this.db = window.sqlitePlugin.openDatabase({ name: this.parameter.dbName, location: 'default' }); return true }
        catch (err: any) { this.parameter.onError(`error in openDb : ${err.message}`); return false }
    }
    private createTables = () => {
        for (let i = 0; i < this.parameter.tables.length; i++) {
            const table = this.parameter.tables[i]
            this.pkDic[table.name] = table.primaryKey;
            let query = `CREATE TABLE IF NOT EXISTS ${table.name} (`;
            const columnsArray = Object.keys(table.columns).map(column => {
                return `${column} ${table.columns[column]}${column === table.primaryKey ? ' PRIMARY KEY' : ''}`;
            });
            query += columnsArray.join(', ') + ');';
            this.db.transaction((tx: any) => {
                tx.executeSql(
                    query, [], (tx: any, res: any) => { },
                    (error: Error) => {
                        this.parameter.onError(`Error creating table ${table.name}: ${error.message}`)
                    });
            });
        }
    }
    private getQString = (columns: I_tableColumns) => Object.keys(columns).map(() => '?').join(',')
    private getRowFn = async (tableName: string, searchObj: { [key: string]: string | number }): Promise<I_result<I_sqlRows>> => {
        const keys = Object.keys(searchObj);
        let whereClause = keys.length ? `WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}` : 'LIMIT 1';
        try {
            const result = await new Promise<I_sqlRows>((resolve, reject) => {
                this.db.transaction((tx: any) => {
                    tx.executeSql(
                        `SELECT * FROM ${tableName} ${whereClause}`, keys.map(key => searchObj[key]),
                        (tx: any, res: any) => resolve(res.rows),
                        (error: Error) => reject(`Error fetching row: ${error.message}`)
                    );
                });
            });
            return { success: true, result };
        } catch (err: any) {
            return { success: false, result: `AIOSql error in getRowFn: ${err.message}` }
        }
    }
    private getKeyValues = (table: I_table, row: I_tableRow, type: 'insert' | 'update', caller: string): { success: boolean, result: { keys: string, values: any } | string } => {
        try {
            const columnKeys = Object.keys(table.columns);
            const rowKeys = Object.keys(row);
            let keys: any[] = [], values: any = [];
            for (let rowKey of rowKeys) {
                if (columnKeys.indexOf(rowKey) === -1) { continue }
                if (type === 'update' && rowKey === table.primaryKey) { continue }
                keys.push(rowKey);
                values.push(row[rowKey]);
            }
            const formattedKeys = type === 'update' ? keys.map(key => `${key} = ?`).join(',') : keys.join(',');
            return { success: true, result: { keys: formattedKeys, values } };
        }
        catch (err: any) { return { success: false, result: `${caller} : err.message` } }
    }
    private insert = async (tableName: string, row: I_tableRow): Promise<I_result<true>> => {
        const table = this.getTableByName(tableName);
        if (table === undefined) { return { success: false, result: `AIOSql error => there no table by name (${tableName})` } }
        const kv = this.getKeyValues(table, row, 'insert', 'inster');
        if (kv.success === false) { return { success: false, result: kv.result as string } }
        const { keys, values } = kv.result as { keys: string, values: any };
        const placeholders = this.getQString(table.columns);
        return new Promise((resolve, reject) => {
            this.db.transaction(
                (tx: any) => {
                    tx.executeSql(
                        `INSERT INTO ${table.name} (${keys}) VALUES (${placeholders})`, values, (tx: any, res: any) => resolve({ success: true, result: true }),
                        (error: any) => resolve({ success: false, result: `Error saving row to SQLite: ${error}` })
                    );
                },
                (error: Error) => resolve({ success: false, result: `Transaction error in insert: ${error.message}` }));
        })
    }
    private update = async (tableName: string, row: I_tableRow): Promise<I_result<true>> => {
        const table = this.getTableByName(tableName);
        if (table === undefined) { return { success: false, result: `AIOSql error => there no table by name (${tableName})` } }
        const pk = this.getPKValue(tableName, row, 'update');
        if (pk.success === false) { return { success: false, result: pk.result } }
        const primaryKeyValue = pk.result;
        const kv = this.getKeyValues(table, row, 'update', 'update');
        if (kv.success === false) { return { success: false, result: kv.result as string } }
        const { keys, values } = kv.result as { keys: string, values: any };
        return new Promise((resolve, reject) => {
            this.db.transaction(
                (tx: any) => {
                    tx.executeSql(
                        `UPDATE ${table.name} SET ${keys} WHERE ${table.primaryKey} = ?`,
                        [...values, primaryKeyValue],
                        (tx: any, res: any) => resolve({ success: true, result: true }),
                        (error: any) => reject({ success: false, result: `Error updating row in SQLite: ${JSON.stringify(error)}` })
                    );
                },
                (error: Error) => resolve({ success: false, result: `Transaction error in update: ${error.message}` })
            );
        })
    }
    private getTableByName = (name: string): I_table | undefined => { return this.parameter.tables.find((o: I_table) => o.name === name) }
    private getPKValue = (tableName: string, row: I_tableRow, caller: string): { success: boolean, result: any } => {
        const table = this.getTableByName(tableName);
        if (table === undefined) { return { success: false, result: `AIOSql error => there no table by name (${tableName})` } }
        const { primaryKey } = table;
        const primaryKeyValue = row[primaryKey];
        if (primaryKeyValue === undefined) { return { success: false, result: `AIOSql error => ${caller} missing row primary value in table(${table.name})` } }
        return { success: true, result: primaryKeyValue }
    }
    getRow = async (tableName: string, searchObj: { [key: string]: string | number }, addObj?: I_tableRow): Promise<I_result<I_tableRow | null>> => {
        if (addObj) {
            const { success, result } = await this.addIfNotExist(tableName, searchObj, addObj)
            if (success === false) { return { success, result: result as string } }
        }
        const obj = await this.getRowFn(tableName, searchObj);
        if (obj.success === false) { return { success: false, result: obj.result } }
        const rows: I_sqlRows = obj.result as I_sqlRows;
        const result = rows.length > 0 ? rows.item(0) : null;
        return { success: true, result }
    };
    getRows = async (tableName: string, searchObj: { [key: string]: string | number }): Promise<I_result<I_tableRow[]>> => {
        const obj = await this.getRowFn(tableName, searchObj);
        if (obj.success === false) { return { success: false, result: obj.result as string } }
        const rows = obj.result as I_sqlRows
        try {
            const result: I_tableRow[] = [];
            for (let i = 0; i < rows.length || 0; i++) { result.push(rows.item(i)); }
            return { success: true, result }
        }
        catch (err: any) { return { success: false, result: `getRows error : ${err.message}` } }
    };
    getAllRows = async (tableName: string): Promise<I_result<I_sqlRows>> => {
        return new Promise((resolve, reject) => {
            this.db.transaction(
                (tx: any) => {
                    tx.executeSql(
                        `SELECT * FROM ${tableName}`, [],
                        (tx: any, res: any) => resolve({ success: true, result: res.rows }),
                        (error: Error) => resolve({ success: false, result: `Error fetching rows: ${error.message}` })
                    );
                },
                (err: any) => resolve({ success: false, result: `AIOSql error in getAllRowsFn => ${err.message}` }));
        })
    }
    addRow = async (tableName: string, row: I_tableRow): Promise<I_result<true>> => {
        const pk = this.getPKValue(tableName, row, 'addRow');
        if (pk.success === false) { return { success: false, result: pk.result } }
        const primaryKeyValue = pk.result;
        const obj = await this.getRow(tableName, { [this.pkDic[tableName]]: primaryKeyValue });
        if (obj.success === false) { return { success: false, result: obj.result as string } }
        if (obj.result === null) { return await this.insert(tableName, row); }
        return { success: false, result: `Error: Duplicate primaryKey value '${primaryKeyValue}' in table '${tableName}'` }
    };
    private addIfNotExist = async (tableName: string, searchObj: I_tableRow, addObj: I_tableRow): Promise<I_result<true>> => {
        const { success, result } = await this.getRow(tableName, searchObj);
        if (!success) { return { success, result: result as string } }
        if (result === null) {
            const obj = await this.addRow(tableName, addObj);
            if (!obj.success) { return { success, result: obj.result as string } }
        }
        return { success: true, result: true }
    }
    editRow = async (tableName: string, row: I_tableRow, addObj?: I_tableRow): Promise<I_result<true>> => {
        if (addObj) {
            const res = await this.addIfNotExist(tableName, row, addObj)
            if (res.success === false) { return res }
        }
        const pk = this.getPKValue(tableName, row, 'editRow');
        if (pk.success === false) { return { success: false, result: pk.result } }
        const primaryKeyValue = pk.result;
        const { success, result } = await this.getRow(tableName, { [this.pkDic[tableName]]: primaryKeyValue })
        if (success === false) { return { success: false, result: result as string } }
        if (result === null) { return { success: false, result: `Error: No record found with primaryKey value '${primaryKeyValue}' in table '${tableName}'` } }
        return await this.update(tableName, row)
    };
    searchRows = async (tableName: string, searchFn: (row: I_tableRow) => boolean): Promise<I_result<I_tableRow[]>> => {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx: any) => {
                tx.executeSql(
                    `SELECT * FROM ${tableName}`, [],
                    (tx: any, res: any) => {
                        const results: I_tableRow[] = [];
                        for (let i = 0; i < res.rows.length; i++) {
                            let row: I_tableRow;
                            try { row = res.rows.item(i); if (searchFn(row)) { results.push(row); } }
                            catch (err: any) { resolve({ success: false, result: err.message }) }
                        }
                        resolve({ success: true, result: results })
                    },
                    (error:any) => reject({ success: false, result: `Error fetching rows from SQLite: ${error}` })
                );
            });
        })
    };
}
declare var navigator: any;
declare var Camera: any;
declare var MLKit: any;
type I_AIOCordova = {
    backButton?: (p:{exitApp:()=>void}) => void
}
type I_AIOCordova_capture = (p: {
    onSuccess: (imageData: string) => void,
    onError: (error: string) => void,
    quality: number,
    returnType: 'base64' | 'uri',
    sourceType: 'camera' | 'library'
}) => void
type I_AIOCordova_ocr = (p: {
    imageURI: string,
    onSuccess: (text: string) => void,
    onError: (error: string) => void
}) => void
export class AIOCordova {
    p?: I_AIOCordova;
    storageSql: SQL = new SQL({ dbName: 'aiocordovadb', onError: (err) => alert(err), tables: [{ name: 'aiocordovatable', primaryKey: 'id', columns: { id: 'TEXT', str: 'TEXT' } }] })
    constructor(p?: I_AIOCordova) {
        this.p = p;
        document.addEventListener('backbutton', (e: any) => this.backButton(e), false);
    }
    backButton = (e: any) => {
        if (this.p && this.p.backButton) {
            this.p.backButton({exitApp:this.exitApp})
        }
    }
    exitApp = () => navigator.app.exitApp()
    vibrate = (times: number[]) => {
        if (typeof navigator.vibrate === 'function') { navigator.vibrate(times); }
        else { alert('cordova-plugin-vibration is NOT installed or available.'); }
    }
    capture: I_AIOCordova_capture = (p) => {
        if (!navigator.camera) { alert("cordova-plugin-camera is not installed."); return; }
        navigator.camera.getPicture(p.onSuccess, p.onError, {
            quality: p.quality || 50,
            destinationType: p.returnType === 'base64' ? Camera.DestinationType.DATA_URL : Camera.DestinationType.FILE_URI,
            sourceType: p.sourceType === 'camera' ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,
        });
    }
    ocr: I_AIOCordova_ocr = (p) => {
        if (MLKit && MLKit.textRecognition) {
            MLKit.textRecognition({
                imagePath: p.imageURI
            }).then(
                function (result: any) { p.onSuccess(result) },
                function (error: string) { p.onError(`OCR Error: ${error}`) }
            );
        }
        else { p.onError('cordova-plugin-mlkit not installed'); }
    }
    base64ToBlob = (p: { base64: string, mime: string }) => {
        const byteString = atob(p.base64.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: p.mime });
    }
    saveBase64ToFile = (p: { base64: string, fileName: string, onSuccess: () => void, onError: (error: string) => void }) => {
        const blob = this.base64ToBlob({ base64: p.base64, mime: 'image/jpeg' });
        //@ts-ignore
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir: any) {
            dir.getFile(p.fileName, { create: true }, function (file: any) {
                file.createWriter(function (fileWriter: any) {
                    fileWriter.onwriteend = () => p.onSuccess()
                    fileWriter.onerror = (e: any) => p.onError(`Failed to write the file: ${e.toString()}`)
                    fileWriter.write(blob);
                });
            });
        });
    }

    getPermissions = (getMessage: (message: string) => void) => {
        var permissions = cordova.plugins.permissions;
        // مجوزهای مورد نیاز برای دسترسی به مکان و سرویس پس‌زمینه
        var requiredPermissions = [
            permissions.ACCESS_FINE_LOCATION,
            permissions.ACCESS_COARSE_LOCATION,
            permissions.ACCESS_BACKGROUND_LOCATION,
            permissions.FOREGROUND_SERVICE
        ];

        requiredPermissions.forEach(permission => {
            permissions.checkPermission(permission, (status: any) => {
                if (status.hasPermission === undefined) {
                    getMessage(`Status for ${permission} is undefined`);
                } else if (!status.hasPermission) {
                    // درخواست مجوز
                    permissions.requestPermission(permission, (status: any) => {
                        if (status.hasPermission) {
                            getMessage(`${permission} granted`);
                        } else {
                            getMessage(`${permission} denied`);
                        }
                    }, (error: any) => {
                        getMessage(`Error requesting permission for ${permission}: ${error}`);
                    });
                } else {
                    getMessage(`${permission} already granted`);
                }
            }, (error: any) => {
                getMessage(`Error checking permission for ${permission}: ${error}`);
            });
        });
    }
    enableBackgroundMode = () => {
        cordova.plugins.backgroundMode.enable();
        cordova.plugins.backgroundMode.on('activate', function () {
            cordova.plugins.backgroundMode.disableWebViewOptimizations();
        });
        cordova.plugins.backgroundMode.disableBatteryOptimizations();
    }
    enablePresmissions = (onSuccess: () => void, onError: (error: string) => void) => {
        var permissions = cordova.plugins.permissions;
        var locationPermissions = [
            permissions.ACCESS_FINE_LOCATION,
            permissions.ACCESS_COARSE_LOCATION,
            permissions.ACCESS_BACKGROUND_LOCATION
        ]
        permissions.requestPermissions(
            locationPermissions,
            (status: any) => {
                if (status.hasPermission) { onSuccess() }
                else { onError("Permissions not granted") }
            },
            (error: string) => {
                onError(error)
            }
        );
    }
    speak = (text: string, lang: 'fa-IR' | 'en-US',onError?:(err:string)=>void) => {
        try {TTS.speak({text,locale: lang,rate: 1})} 
        catch (err: any) { 
            if(onError){onError(err.message)}
            else {alert(err.message)} 
        }
    }
    handleStorageRes = (res:{success:boolean,result:any})=>{
        
    }
    storageLoad:(name:string,def:any)=>Promise<any> = async (name, def) => {
        const res = await this.storageSql.getRow('aiocordovatable', { id: name }, { id: name, str: JSON.stringify(def) })
        if (res.success) {
            try{return JSON.parse((res.result as any).str)}
            catch(err:any){alert(err.message); return def}
        }
        else { alert(res.result); return def }
    }
    storageSave:(name:string,value:any) => Promise<void> = async (name,value)=>{
        const {success,result} = await this.storageSql.editRow('aiocordovatable', { id: name, str: JSON.stringify(value) }, { id: name, str: JSON.stringify(value) }) 
        if(!success){alert(result)}
    }
}
type I_os = 'Macintosh' | 'MacIntel' | 'MacPPC' | 'Mac68K' | 'Win32' | 'Win64' | 'Windows' | 'WinCE' | 'iPhone' | 'iPad' | 'iPod' | 'macOS' | 'iOS' | 'Windows' | 'Android' | 'Linux' | 'Unknown'
const DetectOS = (): I_os => {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os: any = null;
    if (macosPlatforms.includes(platform)) { os = 'macOS'; }
    else if (iosPlatforms.includes(platform)) { os = 'iOS'; }
    else if (windowsPlatforms.includes(platform)) { os = 'Windows'; }
    else if (/Android/.test(userAgent)) { os = 'Android'; }
    else if (/Linux/.test(platform)) { os = 'Linux'; }
    else { os = 'Unknown'; }
    return os;
}
type I_AIOCordovaComponent = {
    startWindows:()=>ReactNode,
    startAndroid:(aioCordova:AIOCordova)=>ReactNode,
    backButton?:(p:{exitApp:()=>void})=>void
}
export const AIOCordovaComponent: FC<I_AIOCordovaComponent> = ({startWindows,startAndroid,backButton}) => {
  const [os] = useState(DetectOS())
  const [loading, setLoading] = useState<boolean>(true)
  let cordovaRef = useRef<undefined | AIOCordova>(undefined)
  async function onDeviceReady() {
    if (os === 'Android') {
      cordovaRef.current = new AIOCordova({backButton})
    }
    setTimeout(() => { setLoading(false) }, 3000)
  }
  useEffect(() => {
    if (os === 'Android') { document.addEventListener('deviceready', onDeviceReady, false) }
    else { onDeviceReady() }
  }, [])
  if (loading) { return <Loading /> }
  if (os === 'Windows') { return <>{startWindows()}</> }
  if (!cordovaRef.current) { alert('aio cordova instance not created'); return null }
  return <>{startAndroid(cordovaRef.current)}</>
}
const Loading: FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-3">
        <span></span>
      </div>
    </div>
  )
}