import React, { FC, useState } from "react";
import ReactDOM from 'react-dom/client';
import { Icon } from '@mdi/react';
import { mdiChevronDown, mdiChevronRight, mdiClose } from "@mdi/js";
import { Storage } from '../aio-utils/index.tsx';
import "./index.css";
import $ from 'jquery';
type I_log = { id: string, key: string, value: string }
export default class Logs {
    storage: Storage;
    logs: I_log[];
    setLogs: (logs: I_log[]) => void;
    add: (key: string, value: string, id?: string, count?: number) => void;
    remove: (index: number) => void;
    removeByIdAndLength: (length: number, id: string) => I_log[];
    open: () => void;
    close: () => void;
    render: () => React.ReactNode;
    constructor(id: string) {
        if (!id) { alert('aio-log error => missing id properties to create instance') }
        this.storage = new Storage(id);
        this.logs = this.storage.load('logs', [])
        this.setLogs = (logs) => {
            this.storage.save('logs', logs);
            this.logs = logs
        }
        this.add = (key, value, id, count = 1) => {
            let uniqLogs: I_log[] = this.logs;
            if (id) {
                let res: I_log[] = this.logs.filter((o: I_log) => o.id !== id)
                uniqLogs = this.removeByIdAndLength(res.length - count + 1, id)
            }
            let newLogs: I_log[] = [...uniqLogs, { key, value, id: id || ('log' + Math.round(Math.random() * 100000)) }];
            this.setLogs(newLogs)
        }
        this.removeByIdAndLength = (length, id) => {
            let count = 0;
            return this.logs.filter(obj => {
                if (obj.id === id && count < length) {
                    count++;
                    return false;
                }
                return true;
            });
        }
        this.remove = (index) => {
            if (!this.logs.length || !this.logs[index]) { return }
            this.setLogs(this.logs.filter((o, i) => i !== index))
        }
        this.open = () => {
            if (!$('#aio-log-container').length) {
                $('body').append('<div id="aio-log-container"></div>');
            }
            const root = ReactDOM.createRoot(document.getElementById('aio-log-container') as HTMLElement);
            root.render(
                <div className='aio-log-popup'>
                    <div className='aio-log-popup-header'>
                        <div className='aio-log-popup-header-title'>
                            LOGGER
                        </div>
                        <div className='aio-log-popup-header-close aio-log-align' onClick={()=>this.close()}>
                            <Icon path={mdiClose} size={1} />
                        </div>    
                    </div>
                    <div className="aio-log-popup-body">
                        {this.render()}
                    </div>
                </div>
            );
        }
        this.close = () => { $('#aio-log-container').remove() }
        this.render = () => <LogsComponent logs={this.logs} onRemove={this.remove.bind(this)} />
    }
}
const LogsComponent: FC<{ logs: I_log[], onRemove: (index: number) => void }> = (props) => {
    let [logs, setLogs] = useState(props.logs);
    let [visibleId, setVisibleId] = useState<string | false>(false);
    function remove(index: number) { setLogs(logs.filter((o, i) => i !== index)); props.onRemove(index) }
    function getValue(value: any) { return typeof value === 'object' ? <pre>{JSON.stringify(value, null, 3)}</pre> : value; }
    return (
        <div className='aio-log'>
            {
                logs.map((log: I_log, index: number) => {
                    return (
                        <div className='aio-log-item'>
                            <div className='aio-log-item-header'>
                                <div className='aio-log-item-toggle aio-log-align'>
                                    <Icon path={visibleId === log.id ? mdiChevronDown : mdiChevronRight} size={1} />
                                </div>
                                <div className='aio-log-item-title aio-log-align' onClick={() => setVisibleId(log.id === visibleId ? false : log.id)}>{log.key}</div>
                                <div className='aio-log-item-remove aio-log-align' onClick={() => remove(index)}>
                                    <Icon path={mdiClose} size={0.8} />
                                </div>
                            </div>
                            {visibleId !== log.id && <div className="aio-log-item-body aio-log-align">{getValue(log.value)}</div>}
                        </div>
                    )
                })
            }
        </div>
    )
}