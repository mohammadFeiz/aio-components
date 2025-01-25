function _defineProperty(e,t,r){return(t=_toPropertyKey(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _toPropertyKey(e){var t=_toPrimitive(e,"string");return"symbol"==typeof t?t:String(t)}function _toPrimitive(e,t){if("object"!=typeof e||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var s=r.call(e,t||"default");if("object"!=typeof s)return s;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}import{useEffect as e,useRef as t,useState as r}from"react";import{jsx as s}from"react/jsx-runtime";import{Fragment as i}from"react/jsx-runtime";export function getDefaultBglConfig(){return{stationaryRadius:4,distanceFilter:4,notificationTitle:"Background tracking",notificationText:"enabled",debug:!1,interval:3e3,fastestInterval:5e3,activitiesInterval:1e4,stopOnTerminate:!1,startOnBoot:!1,maxLocations:500,saveBatteryOnBackground:!1,syncThreshold:void 0,url:void 0,propertyNames:{latitude:"lat",longitude:"lng",speed:"speed",bearing:"bearing",time:"time"}}}export function getBGLKeys(){return[[{key:"url",type:"text",desc:"send location to this address"}],[{key:"stationaryRadius",type:"number",desc:"Stationary radius in meters. When stopped, the minimum distance the device must move beyond the stationary location for aggressive background-tracking to engage."},{key:"distanceFilter",type:"number",desc:"The minimum distance (measured in meters) a device must move horizontally before an update event is"}],[{key:"notificationTitle",type:"text",desc:"notification title"},{key:"notificationText",type:"text",desc:"notification text"}],[{key:"debug",type:"checkbox",desc:"When enabled, the plugin will emit sounds for life-cycle events of background-geolocation! See debugging sounds table."},{key:"saveBatteryOnBackground",type:"checkbox",desc:"Switch to less accurate significant changes and region monitory when in background"}],[{key:"interval",type:"number",desc:"The minimum time interval between location updates in milliseconds"},{key:"fastestInterval",type:"number",desc:"Fastest rate in milliseconds at which your app can handle location updates."}],[{key:"activitiesInterval",type:"number",desc:"Rate in milliseconds at which activity recognition occurs. Larger values will result in fewer activity detections while improving battery life."},{key:"notificationsEnabled",type:"text",desc:"Enable/disable local notifications when tracking and syncing locations"}],[{key:"stopOnTerminate",type:"checkbox",desc:"Enable this in order to force a stop() when the application terminated (e.g. on iOS, double-tap home button, swipe away the app)."},{key:"startOnBoot",type:"checkbox",desc:"Start background service on device boot."}],[{key:"maxLocations",type:"number",desc:"Limit maximum number of locations stored into db"},{key:"syncThreshold",type:"number",desc:"Specifies how many previously failed locations will be sent to server at once"}]]}export class BGL{constructor(e){_defineProperty(this,"token",void 0),_defineProperty(this,"addLog",void 0),_defineProperty(this,"textToObj",e=>{if(e)try{return JSON.parse(e)}catch{return}}),_defineProperty(this,"setConfig",e=>{let{stationaryRadius:t=4,distanceFilter:r=4,notificationTitle:s="Background tracking",notificationText:i="enabled",debug:n=!1,interval:o=3e3,fastestInterval:a=5e3,activitiesInterval:c=1e4,stopOnTerminate:l=!1,startOnBoot:u=!1,maxLocations:d=500,saveBatteryOnBackground:p=!1,syncThreshold:y,url:h}=e||{},g=this.token?{authorization:this.token}:void 0,m={lat:"@latitude",lng:"@longitude",bearing:"@bearing",time:"@time",speed:"@speed"},f={locationProvider:BackgroundGeolocation.ACTIVITY_PROVIDER,desiredAccuracy:BackgroundGeolocation.HIGH_ACCURACY,stationaryRadius:t,distanceFilter:r,notificationTitle:s,notificationText:i,debug:n,interval:o,fastestInterval:a,activitiesInterval:c,stopOnTerminate:l,startOnBoot:u,maxLocations:d,saveBatteryOnBackground:p,syncThreshold:y,url:h,httpHeaders:g,postTemplate:m};this.addLog&&this.addLog(`received bgl config => ${JSON.stringify({distanceFilter:f.distanceFilter,postTemplate:f.postTemplate,interval:f.interval})}`),BackgroundGeolocation.configure(f)}),_defineProperty(this,"start",e=>{BackgroundGeolocation.start(),BackgroundGeolocation.on("location",function(t){e(t)})}),_defineProperty(this,"stop",()=>BackgroundGeolocation.stop()),_defineProperty(this,"getConfig",e=>{BackgroundGeolocation.getConfig(function(t){e(t)})}),_defineProperty(this,"getCurrentLocation",(e,t)=>{try{BackgroundGeolocation.getCurrentLocation(t=>e(t),(e,r)=>{let s;try{s=["PERMISSION_DENIED","LOCATION_UNAVAILABLE","TIMEOUT"][e-1]}catch{s=""}t(`${s} - ${r}`)},{timeout:5e3,maximumAge:5e3,enableHighAccuracy:!0})}catch(r){t(r.message)}}),_defineProperty(this,"getLocations",(e,t)=>{BackgroundGeolocation.getLocations(t=>e(t),()=>t("error in getLocations"))});let{token:t,addLog:r}=e||{};this.token=t,this.addLog=r}}export class SQL{constructor(e){_defineProperty(this,"parameter",void 0),_defineProperty(this,"db",void 0),_defineProperty(this,"pkDic",{}),_defineProperty(this,"openDb",()=>{try{return this.db=window.sqlitePlugin.openDatabase({name:this.parameter.dbName,location:"default"}),!0}catch(e){return this.parameter.onError(`error in openDb : ${e.message}`),!1}}),_defineProperty(this,"createTables",()=>{for(let e=0;e<this.parameter.tables.length;e++){let t=this.parameter.tables[e];this.pkDic[t.name]=t.primaryKey;let r=`CREATE TABLE IF NOT EXISTS ${t.name} (`,s=Object.keys(t.columns).map(e=>`${e} ${t.columns[e]}${e===t.primaryKey?" PRIMARY KEY":""}`);r+=s.join(", ")+");",this.db.transaction(e=>{e.executeSql(r,[],(e,t)=>{},e=>{this.parameter.onError(`Error creating table ${t.name}: ${e.message}`)})})}}),_defineProperty(this,"getQString",e=>Object.keys(e).map(()=>"?").join(",")),_defineProperty(this,"getRowFn",async(e,t)=>{let r=Object.keys(t),s=r.length?`WHERE ${r.map(e=>`${e} = ?`).join(" AND ")}`:"LIMIT 1";try{let i=await new Promise((i,n)=>{this.db.transaction(o=>{o.executeSql(`SELECT * FROM ${e} ${s}`,r.map(e=>t[e]),(e,t)=>i(t.rows),e=>n(`Error fetching row: ${e.message}`))})});return{success:!0,result:i}}catch(n){return{success:!1,result:`AIOSql error in getRowFn: ${n.message}`}}}),_defineProperty(this,"getKeyValues",(e,t,r,s)=>{try{let i=Object.keys(e.columns),n=Object.keys(t),o=[],a=[];for(let c of n)-1!==i.indexOf(c)&&("update"!==r||c!==e.primaryKey)&&(o.push(c),a.push(t[c]));let l="update"===r?o.map(e=>`${e} = ?`).join(","):o.join(",");return{success:!0,result:{keys:l,values:a}}}catch(u){return{success:!1,result:`${s} : err.message`}}}),_defineProperty(this,"insert",async(e,t)=>{let r=this.getTableByName(e);if(void 0===r)return{success:!1,result:`AIOSql error => there no table by name (${e})`};let s=this.getKeyValues(r,t,"insert","inster");if(!1===s.success)return{success:!1,result:s.result};let{keys:i,values:n}=s.result,o=this.getQString(r.columns);return new Promise((e,t)=>{this.db.transaction(t=>{t.executeSql(`INSERT INTO ${r.name} (${i}) VALUES (${o})`,n,(t,r)=>e({success:!0,result:!0}),t=>e({success:!1,result:`Error saving row to SQLite: ${t}`}))},t=>e({success:!1,result:`Transaction error in insert: ${t.message}`}))})}),_defineProperty(this,"update",async(e,t)=>{let r=this.getTableByName(e);if(void 0===r)return{success:!1,result:`AIOSql error => there no table by name (${e})`};let s=this.getPKValue(e,t,"update");if(!1===s.success)return{success:!1,result:s.result};let i=s.result,n=this.getKeyValues(r,t,"update","update");if(!1===n.success)return{success:!1,result:n.result};let{keys:o,values:a}=n.result;return new Promise((e,t)=>{this.db.transaction(s=>{s.executeSql(`UPDATE ${r.name} SET ${o} WHERE ${r.primaryKey} = ?`,[...a,i],(t,r)=>e({success:!0,result:!0}),e=>t({success:!1,result:`Error updating row in SQLite: ${JSON.stringify(e)}`}))},t=>e({success:!1,result:`Transaction error in update: ${t.message}`}))})}),_defineProperty(this,"getTableByName",e=>this.parameter.tables.find(t=>t.name===e)),_defineProperty(this,"getPKValue",(e,t,r)=>{let s=this.getTableByName(e);if(void 0===s)return{success:!1,result:`AIOSql error => there no table by name (${e})`};let{primaryKey:i}=s,n=t[i];return void 0===n?{success:!1,result:`AIOSql error => ${r} missing row primary value in table(${s.name})`}:{success:!0,result:n}}),_defineProperty(this,"getRow",async(e,t,r)=>{if(r){let{success:s,result:i}=await this.addIfNotExist(e,t,r);if(!1===s)return{success:s,result:i}}let n=await this.getRowFn(e,t);if(!1===n.success)return{success:!1,result:n.result};let o=n.result,a=o.length>0?o.item(0):null;return{success:!0,result:a}}),_defineProperty(this,"getRows",async(e,t)=>{let r=await this.getRowFn(e,t);if(!1===r.success)return{success:!1,result:r.result};let s=r.result;try{let i=[];for(let n=0;n<s.length;n++)i.push(s.item(n));return{success:!0,result:i}}catch(o){return{success:!1,result:`getRows error : ${o.message}`}}}),_defineProperty(this,"getAllRows",async e=>new Promise((t,r)=>{this.db.transaction(r=>{r.executeSql(`SELECT * FROM ${e}`,[],(e,r)=>t({success:!0,result:r.rows}),e=>t({success:!1,result:`Error fetching rows: ${e.message}`}))},e=>t({success:!1,result:`AIOSql error in getAllRowsFn => ${e.message}`}))})),_defineProperty(this,"addRow",async(e,t)=>{let r=this.getPKValue(e,t,"addRow");if(!1===r.success)return{success:!1,result:r.result};let s=r.result,i=await this.getRow(e,{[this.pkDic[e]]:s});return!1===i.success?{success:!1,result:i.result}:null===i.result?await this.insert(e,t):{success:!1,result:`Error: Duplicate primaryKey value '${s}' in table '${e}'`}}),_defineProperty(this,"addIfNotExist",async(e,t,r)=>{let{success:s,result:i}=await this.getRow(e,t);if(!s)return{success:s,result:i};if(null===i){let n=await this.addRow(e,r);if(!n.success)return{success:s,result:n.result}}return{success:!0,result:!0}}),_defineProperty(this,"editRow",async(e,t,r)=>{if(r){let s=await this.addIfNotExist(e,t,r);if(!1===s.success)return s}let i=this.getPKValue(e,t,"editRow");if(!1===i.success)return{success:!1,result:i.result};let n=i.result,{success:o,result:a}=await this.getRow(e,{[this.pkDic[e]]:n});return!1===o?{success:!1,result:a}:null===a?{success:!1,result:`Error: No record found with primaryKey value '${n}' in table '${e}'`}:await this.update(e,t)}),_defineProperty(this,"searchRows",async(e,t)=>new Promise((r,s)=>{this.db.transaction(i=>{i.executeSql(`SELECT * FROM ${e}`,[],(e,s)=>{let i=[];for(let n=0;n<s.rows.length;n++){let o;try{o=s.rows.item(n),t(o)&&i.push(o)}catch(a){r({success:!1,result:a.message})}}r({success:!0,result:i})},e=>s({success:!1,result:`Error fetching rows from SQLite: ${e}`}))})})),this.parameter=e;let t=this.openDb();t&&this.createTables()}}export class AIOCordova{constructor(e){_defineProperty(this,"p",void 0),_defineProperty(this,"storageSql",new SQL({dbName:"aiocordovadb",onError:e=>alert(e),tables:[{name:"aiocordovatable",primaryKey:"id",columns:{id:"TEXT",str:"TEXT"}}]})),_defineProperty(this,"backButton",e=>{this.p&&this.p.backButton&&this.p.backButton({exitApp:this.exitApp})}),_defineProperty(this,"exitApp",()=>navigator.app.exitApp()),_defineProperty(this,"vibrate",e=>{"function"==typeof navigator.vibrate?navigator.vibrate(e):alert("cordova-plugin-vibration is NOT installed or available.")}),_defineProperty(this,"capture",e=>{if(!navigator.camera){alert("cordova-plugin-camera is not installed.");return}navigator.camera.getPicture(e.onSuccess,e.onError,{quality:e.quality||50,destinationType:"base64"===e.returnType?Camera.DestinationType.DATA_URL:Camera.DestinationType.FILE_URI,sourceType:"camera"===e.sourceType?Camera.PictureSourceType.CAMERA:Camera.PictureSourceType.PHOTOLIBRARY})}),_defineProperty(this,"ocr",e=>{MLKit&&MLKit.textRecognition?MLKit.textRecognition({imagePath:e.imageURI}).then(function(t){e.onSuccess(t)},function(t){e.onError(`OCR Error: ${t}`)}):e.onError("cordova-plugin-mlkit not installed")}),_defineProperty(this,"base64ToBlob",e=>{let t=atob(e.base64.split(",")[1]),r=new ArrayBuffer(t.length),s=new Uint8Array(r);for(let i=0;i<t.length;i++)s[i]=t.charCodeAt(i);return new Blob([r],{type:e.mime})}),_defineProperty(this,"saveBase64ToFile",e=>{let t=this.base64ToBlob({base64:e.base64,mime:"image/jpeg"});window.resolveLocalFileSystemURL(cordova.file.dataDirectory,function(r){r.getFile(e.fileName,{create:!0},function(r){r.createWriter(function(r){r.onwriteend=()=>e.onSuccess(),r.onerror=t=>e.onError(`Failed to write the file: ${t.toString()}`),r.write(t)})})})}),_defineProperty(this,"getPermissions",e=>{var t,r=cordova.plugins.permissions;[r.ACCESS_FINE_LOCATION,r.ACCESS_COARSE_LOCATION,r.ACCESS_BACKGROUND_LOCATION,r.FOREGROUND_SERVICE].forEach(t=>{r.checkPermission(t,s=>{void 0===s.hasPermission?e(`Status for ${t} is undefined`):s.hasPermission?e(`${t} already granted`):r.requestPermission(t,r=>{r.hasPermission?e(`${t} granted`):e(`${t} denied`)},r=>{e(`Error requesting permission for ${t}: ${r}`)})},r=>{e(`Error checking permission for ${t}: ${r}`)})})}),_defineProperty(this,"enableBackgroundMode",()=>{cordova.plugins.backgroundMode.enable(),cordova.plugins.backgroundMode.on("activate",function(){cordova.plugins.backgroundMode.disableWebViewOptimizations()}),cordova.plugins.backgroundMode.disableBatteryOptimizations()}),_defineProperty(this,"enablePresmissions",(e,t)=>{var r=cordova.plugins.permissions,s=[r.ACCESS_FINE_LOCATION,r.ACCESS_COARSE_LOCATION,r.ACCESS_BACKGROUND_LOCATION];r.requestPermissions(s,r=>{r.hasPermission?e():t("Permissions not granted")},e=>{t(e)})}),_defineProperty(this,"speak",(e,t,r)=>{try{TTS.speak({text:e,locale:t,rate:1})}catch(s){r?r(s.message):alert(s.message)}}),_defineProperty(this,"handleStorageRes",e=>{}),_defineProperty(this,"storageLoad",async(e,t)=>{let r=await this.storageSql.getRow("aiocordovatable",{id:e},{id:e,str:JSON.stringify(t)});if(!r.success)return alert(r.result),t;try{return JSON.parse(r.result.str)}catch(s){return alert(s.message),t}}),_defineProperty(this,"storageSave",async(e,t)=>{let{success:r,result:s}=await this.storageSql.editRow("aiocordovatable",{id:e,str:JSON.stringify(t)},{id:e,str:JSON.stringify(t)});r||alert(s)}),this.p=e,document.addEventListener("backbutton",e=>this.backButton(e),!1)}}let DetectOS=()=>{let e=window.navigator.userAgent,t=window.navigator.platform,r=["Macintosh","MacIntel","MacPPC","Mac68K"],s=["Win32","Win64","Windows","WinCE"],i=["iPhone","iPad","iPod"],n=null;return r.includes(t)?"macOS":i.includes(t)?"iOS":s.includes(t)?"Windows":/Android/.test(e)?"Android":/Linux/.test(t)?"Linux":"Unknown"};export const AIOCordovaComponent=({startWindows:n,startAndroid:o,backButton:a})=>{let[c]=r(DetectOS()),[l,u]=r(!0),d=t(void 0);async function p(){"Android"===c&&(d.current=new AIOCordova({backButton:a})),setTimeout(()=>{u(!1)},3e3)}return(e(()=>{"Android"===c?document.addEventListener("deviceready",p,!1):p()},[]),l)?s(Loading,{}):"Windows"===c?s(i,{children:n()}):d.current?s(i,{children:o(d.current)}):(alert("aio cordova instance not created"),null)};let Loading=()=>s("div",{className:"loading-container",children:s("div",{className:"loading-3",children:s("span",{})})});