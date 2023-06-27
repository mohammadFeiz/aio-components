import React, { Component } from "react";
import RVD from './../react-virtual-dom/react-virtual-dom';
import AIOInput from "./aio-input";
import { Icon } from '@mdi/react';
import { mdiChevronRight, mdiClose } from "@mdi/js";
import './form.css';
export default class Form extends Component {
    header_layout() {
        let { header, title, subtitle, headerAttrs = {}, onClose, onBack } = this.props;
        if (!header && !title && !onClose && !onBack) { return false }
        return {
            className: 'aio-input-form-header' + (headerAttrs.className ? ' ' + headerAttrs.className : ''), style: headerAttrs.style,
            row: [
                { show: !!onBack, size: 36, html: <Icon path={mdiChevronRight} size={.8} />, align: 'vh', onClick: () => onBack() },
                {
                    show: !!title, flex: 1,
                    column: [
                        { flex: 1 },
                        { html: title, className: 'aio-input-form-title' },
                        { show: !!subtitle, html: subtitle, className: 'aio-input-form-subtitle' },
                        { flex: 1 }
                    ]
                },
                { flex: !!title ? undefined : 1, html: header() },
                { show: !!onClose, size: 36, html: <Icon path={mdiClose} size={.8} />, align: 'vh', onClick: () => onClose() }
            ]
        }
    }
    body_layout() {
        let { inputs } = this.props;
        if (Array.isArray(inputs)) {
            inputs = { column: inputs.map((o) => this.input_layout(o)) }
        }
        let res = {
            flex: 1, className: 'aio-input-form-body', ...inputs
        }
        return res
    }
    footer_layout() {
        let { footer, onSubmit, onClose, footerAttrs = {}, closeText = 'Close', submitText = 'submit' } = this.props;
        if (footer === false) { return false }
        if (!footer && !onSubmit && !onClose) { return false }
        return {
            className: 'aio-input-form-footer' + (footerAttrs.className ? ' ' + footerAttrs.className : ''), style: footerAttrs.style,
            row: [
                { show: !!onClose, html: <button onClick={() => onClose()} className='aio-input-form-close-button'>{closeText}</button> },
                { show: !!onSubmit, html: <button onClick={() => onSubmit()} className='aio-input-form-submit-button'>{submitText}</button> },
            ]
        }
    }
    getDefault({ type, multiple }) {
        return {
            file: [],
            multiselect: [],
            radio: multiple ? [] : undefined,
        }[type]
    }
    getValue(input) {
        return this.getValueByField(input.field,this.getDefault(input))
    }
    getValueByField(field,def) {
        let props = this.props;
        let { value = {} } = props;
        let a;
        if (typeof field === 'string') {
            if (field.indexOf('value.') !== -1 || field.indexOf('props.') !== -1) {
                try {eval(`a = ${field}`);}
                catch (err){a = a;}
            }
            else { a = field }
        }
        else{a = typeof field === 'function'?field():field}
        if (a === undefined) { return def }
        return a
    }
    setValueByField(obj = {}, field, value) {
        field = field.replaceAll('[', '.');
        field = field.replaceAll(']', '');
        var fields = field.split('.');
        var node = obj;
        for (let i = 0; i < fields.length - 1; i++) {
            let f = fields[i];
            if(f === 'value'){continue}
            if (node[f] === undefined) {
                if (isNaN(parseFloat(fields[i + 1]))) { node[f] = {} }
                else { node[f] = []; }
                node = node[f];
            }
            else { node = node[f]; }
        }
        node[fields[fields.length - 1]] = value;
        return obj;
    }
    change(v, input) {
        let { onChange,value } = this.props;
        onChange(this.setValueByField(value,input.field,v))
    }
    input_layout(obj) {
        let { label, footer, inlineLabel, input, flex, size,show } = obj;
        return {
            flex, size,
            show:this.getValueByField(show,true),
            className: 'aio-input-form-item',
            row: [
                { show: !!inlineLabel, html: inlineLabel },
                {
                    flex: 1,
                    column: [
                        { show: !!label, html: label, className: 'aio-input-form-label' },
                        { html: <AIOInput {...input} value={this.getValue(input)} onChange={(value) => this.change(value, input)} /> },
                        { show: !!footer, html: footer }
                    ]
                }
            ]
        }
    }
    render() {
        return (
            <RVD
                getLayout={(obj) => {
                    if (obj.input) { return this.input_layout({ ...obj, flex: obj.size ? undefined : 1 }) }
                    return obj

                }}
                layout={{
                    className: 'aio-input-form',
                    column: [
                        this.header_layout(),
                        this.body_layout(),
                        this.footer_layout()
                    ]
                }}
            />
        )
    }
}