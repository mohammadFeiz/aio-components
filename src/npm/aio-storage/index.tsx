type I_storage_model = { [key: string]: any }
type I_storage_time = { [key: string]: number }
export default class Storage {
    model: I_storage_model;
    time: I_storage_time;
    init: () => void;
    saveStorage: (model: I_storage_model, time: I_storage_time) => void;
    getParent: (field: string) => I_storage_model;
    removeValueByField: (field: string) => I_storage_model
    setValueByField: (field: string, value: any) => I_storage_model
    getValueByField: (field: string) => any
    save:(field:string,value:any)=>I_storage_model
    remove:(field:string,callback?:()=>void)=>I_storage_model
    load:(field:string, def?:any, time?:number) =>any
    clear:()=>void
    download:(file:any, name:string) => void
    export:()=>void;
    read:(file:any,callback:(model:I_storage_model)=>void)=>void
    import:(file:any,callback:()=>void)=>void
    getModel:()=>I_storage_model
    constructor(id: string) {
        this.init = () => {
            let storage: string = localStorage.getItem('storageClass' + id);
            let timeStorage = localStorage.getItem('storageClassTime' + id);
            let model:I_storage_model, time:I_storage_time;
            if (storage === undefined || storage === null) { model = {} }
            else { model = JSON.parse(storage) }
            if (timeStorage === undefined || timeStorage === null) { time = {} }
            else { time = JSON.parse(timeStorage) }
            this.model = model;
            this.time = time
            this.saveStorage(model, time)
        }
        this.saveStorage = (model, time) => {
            localStorage.setItem('storageClass' + id, JSON.stringify(model));
            localStorage.setItem('storageClassTime' + id, JSON.stringify(time));
        }
        this.getParent = (field) => {
            let fields = field.split('.');
            let parent = this.model;
            for (let i = 0; i < fields.length - 1; i++) {
                parent = parent[fields[i]];
                if (typeof parent !== 'object') { return }
            }
            return parent
        }
        this.removeValueByField = (field: string) => {
            let fields = field.split('.')
            let parent: I_storage_model = this.getParent(field)
            let lastField: string = fields[fields.length - 1]
            let newParent: I_storage_model = {};
            for (let prop in parent) {
                if (prop !== lastField) { newParent[prop] = parent[prop] }
            }
            fields.pop();
            return this.setValueByField(fields.join('.'), newParent)
        }
        this.setValueByField = (field, value) => {
            if (!field) { this.model = value; return; }
            var fields = field.split('.');
            var parent = this.model;
            for (let i = 0; i < fields.length - 1; i++) {
                let f = fields[i];
                if (parent[f] === undefined) { parent[f] = {} }
                parent = parent[f];
            }
            parent[fields[fields.length - 1]] = value;
            return this.getValueByField(fields[0])
        }
        this.getValueByField = (field) => {
            let fields = field.split('.');
            let model = this.model;
            let parent = { ...model };
            for (let i = 0; i < fields.length - 1; i++) {
                parent = parent[fields[i]];
                if (typeof parent !== 'object') { return }
            }
            return parent[fields[fields.length - 1]]
        }
        this.save = (field,value) => {
            try { value = JSON.parse(JSON.stringify(value)) } catch { value = value; }
            if (!field || field === null) { return }
            let res = this.setValueByField(field, value)
            this.time[field] = new Date().getTime();
            this.saveStorage(this.model,this.time);
            return res;
        }
        this.remove = (field,callback = ()=>{}) => {
            let res = this.removeValueByField(field);
            let newTime = {};
            for (let prop in this.time) { if (prop !== field) { newTime[prop] = this.time[prop] } }
            this.time = newTime;
            this.saveStorage(this.model,this.time);
            callback();
            return res;
        }
        this.load = (field, def, time) => {
            let value = this.getValueByField(field);
            if (time && value !== undefined) {
                let thisTime = new Date().getTime();
                let lastTime = this.time[field] || thisTime;
                let dif = Math.abs(thisTime - lastTime);
                if (dif > time) { value = undefined }
            }
            if (value === undefined && def !== undefined) {
                value = typeof def === 'function' ? def() : def;
                this.save(field,def);
            }
            return value;
        }
        this.clear = () => {
            this.model = {};
            this.time = {};
            this.saveStorage(this.model,this.time)
        }
        this.download = (file, name) => {
            if (!name || name === null) { return }
            let text = JSON.stringify(file)
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', name);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
        this.export = () => {
            let name = window.prompt('Please Inter File Name');
            if (name === null || !name) { return; }
            this.download({ model: this.model, time: this.time }, name)
        }
        this.read = (file, callback = () => { }) => {
            var fr = new FileReader();
            fr.onload = () => { try { callback(JSON.parse((fr as any).result)); } catch { return; } }
            fr.readAsText(file);
        }
        this.import = (file, callback = () => { }) => {
            this.read(
                file, 
                (obj) => {
                    if (obj === undefined) { return; }
                    let { model, time } = obj;
                    this.model = model;
                    this.time = time;
                    this.saveStorage(this.model,this.time);
                    callback()
                }
            )
        }
        this.getModel = () => {
            return JSON.parse(JSON.stringify(this.model))
        }
        this.init()
    }
}