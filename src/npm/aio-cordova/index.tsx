declare var BackgroundGeolocation: any;
declare var cordova: any;
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
export class SQL {
    parameter: I_SQL;
    db: any;
    constructor(p: I_SQL) {
        this.parameter = p;
        if (this.openDb()) { this.createTables(); }
    }
    private openDb = (): boolean => {
        //@ts-ignore
        try { this.db = window.sqlitePlugin.openDatabase({ name: this.parameter.dbName, location: 'default' }); return true }
        catch (err: any) { this.parameter.onError(`error in openDb : ${err.message}`); return false }
    }
    private createTableQuery = (table: I_table) => {
        let query = `CREATE TABLE IF NOT EXISTS ${table.name} (`;
        const columnsArray = Object.keys(table.columns).map(column => {
            return `${column} ${table.columns[column]}${column === table.primaryKey ? ' PRIMARY KEY' : ''}`;
        });
        query += columnsArray.join(', ') + ');';
        return query
    }
    private createTables = () => {
        for (let i = 0; i < this.parameter.tables.length; i++) { this.createTable(this.parameter.tables[i]) }
    }
    private createTable = (table: I_table) => {
        this.db.transaction((tx: any) => {
            tx.executeSql(this.createTableQuery(table), [], (tx: any, res: any) => { }, (error: Error) => { this.parameter.onError(`Error creating table ${table.name}: ${error.message}`) });
        });
    }
    private getQString = (columns: I_tableColumns) => Object.keys(columns).map(() => '?').join(',')
    private getRowFn = (p: { tableName: string, searchObj: { [key: string]: string | number }, successCallback: (rows: I_sqlRows) => void, errorCallback: (err: string) => void }) => {
        try {
            const keys = Object.keys(p.searchObj);
            let whereClause = keys.length ? `WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}` : 'LIMIT 1';
            this.db.transaction((tx: any) => {
                tx.executeSql(
                    `SELECT * FROM ${p.tableName} ${whereClause}`,
                    keys.map(key => p.searchObj[key]),
                    (tx: any, res: any) => p.successCallback(res.rows),
                    (error: Error) => p.errorCallback(`Error fetching row: ${error.message}`)
                );
            });
        }
        catch (err: any) { p.errorCallback(`AIOSql error in getRowFn => ${err.message}`) }
    }
    private getKeyValues = (table: I_table, row: I_tableRow, type: 'insert' | 'update', caller: string): { keys: string, values: any } | string => {
        try {
            const columnKeys = Object.keys(table.columns);
            const rowKeys = Object.keys(row);
            let keys = [], values = [];
            for (let rowKey of rowKeys) {
                if (columnKeys.indexOf(rowKey) === -1) { continue }
                if (type === 'update' && rowKey === table.primaryKey) { continue }
                keys.push(rowKey);
                values.push(row[rowKey]);
            }
            const formattedKeys = type === 'update' ? keys.map(key => `${key} = ?`).join(',') : keys.join(',');
            return { keys: formattedKeys, values };
        }
        catch (err: any) { return `${caller} : err.message` }
    }
    private insert = (p: { table: I_table, row: I_tableRow, successCallback: () => void, errorCallback: (error: string) => void }) => {
        const kv = this.getKeyValues(p.table, p.row, 'insert', 'inster');
        if (typeof kv === 'string') { p.errorCallback(kv); return }
        const { keys, values } = kv;
        const placeholders = this.getQString(p.table.columns);
        this.db.transaction(
            (tx: any) => {
                tx.executeSql(
                    `INSERT INTO ${p.table.name} (${keys}) VALUES (${placeholders})`, values, (tx: any, res: any) => { p.successCallback() },
                    (error: Error) => p.errorCallback(`Error saving row to SQLite: ${error.message}`)
                );
            },
            (error: Error) => p.errorCallback(`Transaction error in insert: ${error.message}`));
    }
    private update = (p: { table: I_table, row: I_tableRow, successCallback: () => void, errorCallback: (error: string) => void }) => {
        const primaryKeyValue = this.getPKValue(p.table, p.row, 'update');
        const kv = this.getKeyValues(p.table, p.row, 'update', 'update');
        if (typeof kv === 'string') { p.errorCallback(kv); return }
        const { keys, values } = kv;
        this.db.transaction(
            (tx: any) => {
                tx.executeSql(
                    `UPDATE ${p.table.name} SET ${keys} WHERE ${p.table.primaryKey} = ?`,
                    [...values, primaryKeyValue], // مقدار کلید اصلی برای شرط WHERE
                    (tx: any, res: any) => p.successCallback(),
                    (error: Error) => p.errorCallback(`Error updating row in SQLite: ${error.message}`)
                );
            },
            (error: Error) => p.errorCallback(`Transaction error in update: ${error.message}`)
        );
    }
    private getTableByName = (name: string): I_table | undefined => { return this.parameter.tables.find((o: I_table) => o.name === name) }
    private getPKValue = (table: I_table, row: I_tableRow, caller: string): ({ message?: string, primaryKeyValue?: any }) => {
        const { primaryKey } = table;
        const primaryKeyValue = row[primaryKey];
        if (primaryKeyValue === undefined) { return { message: `AIOSql error => ${caller} missing row primary value in table(${table.name})` } }
        return { primaryKeyValue }
    }
    getRow = (p: { tableName: string, searchObj: { [key: string]: string | number }, successCallback: (result: I_tableRow | null) => void, errorCallback: (error: string) => void }) => {
        this.getRowFn({
            ...p, successCallback: (rows: I_sqlRows) => {
                try { if (rows.length > 0) { p.successCallback(rows.item(0)); } else { p.successCallback(null) } }
                catch (err: any) { p.errorCallback(`Error processing result: ${err.message}`); }
            }
        })
    };
    getRows = (p: { tableName: string, searchObj: { [key: string]: string | number }, successCallback: (result: I_tableRow[]) => void, errorCallback: (error: string) => void }) => {
        this.getRowFn({
            ...p, successCallback: (rows: I_sqlRows) => {
                try {
                    if (rows.length > 0) { const res = []; for (let i = 0; i < rows.length; i++) { res.push(rows.item(i)); } p.successCallback(res); }
                    else { p.successCallback([]) }
                }
                catch (err: any) { p.errorCallback(`getRows error : ${err.message}`) }
            }
        })
    };
    getAllRows = (p: { tableName: string, successCallback: (rows: I_sqlRows) => void, errorCallback: (err: string) => void }) => {
        this.db.transaction(
            (tx: any) => {
                tx.executeSql(
                    `SELECT * FROM ${p.tableName}`,  // کوئری برای انتخاب همه رکوردها
                    [],
                    (tx: any, res: any) => p.successCallback(res.rows),  // فراخوانی موفقیت
                    (error: Error) => p.errorCallback(`Error fetching rows: ${error.message}`)  // فراخوانی خطا
                );
            },
            (err: any) => p.errorCallback(`AIOSql error in getAllRowsFn => ${err.message}`));
    }
    addRow = (p: { tableName: string, row: I_tableRow, successCallback: () => void, errorCallback: (error: string) => void }) => {
        const table = this.getTableByName(p.tableName);
        if (table === undefined) { p.errorCallback(`AIOSql error => there no table by name (${p.tableName})`); return }
        const { primaryKeyValue, message } = this.getPKValue(table, p.row, 'addRow');
        if (message) { p.errorCallback(message); return }
        this.getRow({
            tableName: p.tableName, searchObj: { [table.primaryKey]: primaryKeyValue },
            successCallback: (res) => {
                if (res === null) { this.insert({ table, row: p.row, successCallback: p.successCallback, errorCallback: p.errorCallback }) }
                else { p.errorCallback(`Error: Duplicate primaryKey value '${primaryKeyValue}' in table '${p.tableName}'`) }
            },
            errorCallback: p.errorCallback
        })
    };
    editRow = (p: { tableName: string, row: I_tableRow, successCallback: () => void, errorCallback: (error: string) => void }) => {
        const table = this.getTableByName(p.tableName);
        if (table === undefined) { p.errorCallback(`AIOSql error => there no table by name (${p.tableName})`); return }
        const { primaryKeyValue, message } = this.getPKValue(table, p.row, 'addRow');
        if (message) { p.errorCallback(message); return }
        this.getRow({
            tableName: p.tableName, searchObj: { [table.primaryKey]: primaryKeyValue }, errorCallback: p.errorCallback,
            successCallback: (res) => {
                if (res === null) { p.errorCallback(`Error: No record found with primaryKey value '${primaryKeyValue}' in table '${p.tableName}'`) }
                else { this.update({ table, row: p.row, successCallback: p.successCallback, errorCallback: p.errorCallback }) }
            }
        })
    };

    addOrEditRow = (p: { tableName: string, row: I_tableRow, successCallback: () => void, errorCallback: (error: string) => void }) => {
        const table = this.getTableByName(p.tableName);
        if (table === undefined) { p.errorCallback(`AIOSql error => there no table by name (${p.tableName})`); return }
        const { primaryKeyValue, message } = this.getPKValue(table, p.row, 'addRow');
        if (message) { p.errorCallback(message); return }
        this.db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT * FROM ${table.name} WHERE ${table.primaryKey} = ?`,
                [primaryKeyValue],
                (tx: any, res: any) => {
                    if (res.rows.length > 0) { this.editRow(p); }
                    else { this.addRow(p); }
                },
                (error: Error) => p.errorCallback(`Error checking primaryKey: ${error.message}`)
            );
        });
    };
    searchRows = (p: { tableName: string, searchFn: (row: I_tableRow) => boolean, successCallback: (results: I_tableRow[]) => void, errorCallback: (error: string) => void }) => {
        this.db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT * FROM ${p.tableName}`,
                [],
                (tx: any, res: any) => {
                    const results: I_tableRow[] = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        let row;
                        try { row = res.rows.item(i); if (p.searchFn(row)) { results.push(row); } }
                        catch (err: any) { p.errorCallback(err.message); }
                    }
                    p.successCallback(results);
                },
                (error: Error) => p.errorCallback(`Error fetching rows from SQLite: ${error.message}`)
            );
        });
    };
}
declare var navigator: any;
declare var Camera: any;
declare var MLKit:any;
type I_FNS = {backButton?:(e:any)=>void}
type I_FNS_capture = (p:{
    onSuccess:(imageData:string)=>void,
    onError:(error:string)=>void,
    quality:number,
    returnType:'base64' | 'uri',
    sourceType:'camera' | 'library'
})=>void
type I_FNS_ocr = (p:{
    imageURI:string,
    onSuccess:(text:string)=>void,
    onError:(error:string)=>void
})=>void
export class FNS {
    p?:I_FNS;
    constructor(p?:I_FNS){
        this.p = p;
        document.addEventListener('backbutton', (e:any)=>this.backButton(e), false);
    }
    backButton = (e:any)=>{
        if(this.p?.backButton){this.p.backButton(e)}
    }
    exitApp = ()=>navigator.app.exitApp()
    vibrate = (times:number[])=>{
        if (typeof navigator.vibrate === 'function') {navigator.vibrate(times);} 
        else {alert('cordova-plugin-vibration is NOT installed or available.');}
    }
    capture:I_FNS_capture = (p) => {
        if (!navigator.camera) {alert("cordova-plugin-camera is not installed."); return; }
        navigator.camera.getPicture(p.onSuccess, p.onError, {
            quality: p.quality || 50,
            destinationType: p.returnType === 'base64'?Camera.DestinationType.DATA_URL:Camera.DestinationType.FILE_URI,
            sourceType: p.sourceType === 'camera'?Camera.PictureSourceType.CAMERA:Camera.PictureSourceType.PHOTOLIBRARY,
        });
    }
    ocr:I_FNS_ocr = (p)=>{
        if (MLKit && MLKit.textRecognition) {
            MLKit.textRecognition({
                imagePath: p.imageURI
            }).then(
                function(result:any) {p.onSuccess(result)}, 
                function(error:string) {p.onError(`OCR Error: ${error}`)}
            );
        } 
        else {p.onError('cordova-plugin-mlkit not installed');}
    }
    base64ToBlob = (p:{base64:string, mime:string}) => {
        const byteString = atob(p.base64.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: p.mime });
    }
    saveBase64ToFile = (p:{base64:string, fileName:string,onSuccess:()=>void,onError:(error:string)=>void}) => {
        const blob = this.base64ToBlob({base64:p.base64, mime:'image/jpeg'});
        //@ts-ignore
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir:any) {
            dir.getFile(p.fileName, { create: true }, function(file:any) {
                file.createWriter(function(fileWriter:any) {
                    fileWriter.onwriteend = () => p.onSuccess()
                    fileWriter.onerror = (e:any) =>p.onError(`Failed to write the file: ${e.toString()}`)
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
}