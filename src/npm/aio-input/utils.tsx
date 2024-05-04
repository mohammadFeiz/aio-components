
import React from 'react';
import {createContext} from 'react';
import {Icon} from '@mdi/react';
import { AI, AI_option, AI_optionKey, AI_types } from './types';
import { AddToAttrs } from '../aio-utils';
const AICTX = createContext({} as any);
function Def(prop){
    let res = {
        'theme':[],
        'date-size':180,
        'tree-size':36,
        'range-size':72,
        'date-unit':'day'
    }[prop]
    return res
}
function I(path:any,size:number,p?:any){
    return <Icon path={path} size={size} {...p}/>
}
function GetOptions(p: { rootProps: AI, types: AI_types, options?: any[], properties?: any }): AI_option[] {
    let { rootProps, types, properties = {} } = p;
    let { deSelect } = rootProps;
    let options = p.options || rootProps.options || [];
    if (typeof options === 'function') { options = options() }
    let result = [];
    let renderIndex = 0;
    let draggable: boolean = types.isDropdown && types.hasOption && !!rootProps.onSwap;
    function getDefaultOptionChecked(v: any) {
        if (rootProps.type === 'multiselect') { return rootProps.value.indexOf(v) !== -1 }
        if (rootProps.type === 'radio') { return types.isMultiple ? rootProps.value.indexOf(v) !== -1 : rootProps.value === v }
    }
    if (deSelect && typeof deSelect !== 'function' && deSelect !== true) { options = [deSelect, ...options] }
    function updateOptionByProperties(option: AI_option) {
        for (let prop in properties) {
            option[prop] = properties[prop](option)
        }
        return option
    }
    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let disabled = !!rootProps.disabled || !!rootProps.loading || !!GetOptionProps({ props: rootProps, option, key: 'disabled', renderIndex, realIndex: i });
        let show = GetOptionProps({ props: rootProps, option, key: 'show', renderIndex, realIndex: i })
        if (show === false) { continue }
        let text = GetOptionProps({ props: rootProps, option, key: 'text', renderIndex, realIndex: i });
        //در اینپوت ها آپشن هایی رو نشون بده که با ولیو مچ هستند
        //if (types.isInput && value && text.toString().indexOf(value.toString()) !== 0) { continue }
        let optionValue = GetOptionProps({ props: rootProps, option, key: 'value', renderIndex, realIndex: i })
        let attrs = GetOptionProps({ props: rootProps, option, key: 'attrs', def: {}, renderIndex, realIndex: i });
        let defaultChecked = getDefaultOptionChecked(optionValue)
        let checked = GetOptionProps({ props: rootProps, option, key: 'checked', def: defaultChecked, renderIndex, realIndex: i })
        //object:option => do not remove mutability to use original value of option in for example tree row
        let obj = {
            object: option, show,
            loading: rootProps.loading,
            attrs, text, value: optionValue, disabled, draggable,
            checkIcon: GetOptionProps({ props: rootProps, option, key: 'checkIcon', renderIndex, realIndex: i }) || rootProps.checkIcon,
            checked,
            before: GetOptionProps({ props: rootProps, option, key: 'before', renderIndex, realIndex: i }),
            after: GetOptionProps({ props: rootProps, option, key: 'after', renderIndex, realIndex: i }),
            justify: GetOptionProps({ props: rootProps, option, key: 'justify', renderIndex, realIndex: i }),
            subtext: GetOptionProps({ props: rootProps, option, key: 'subtext', renderIndex, realIndex: i }),
            onClick: GetOptionProps({ props: rootProps, option, key: 'onClick', preventFunction: true, renderIndex, realIndex: i }),
            className: GetOptionProps({ props: rootProps, option, key: 'className', renderIndex, realIndex: i }),
            style: GetOptionProps({ props: rootProps, option, key: 'style', renderIndex, realIndex: i }),
            tagAttrs: GetOptionProps({ props: rootProps, option, key: 'tagAttrs', renderIndex, realIndex: i }),
            tagBefore: GetOptionProps({ props: rootProps, option, key: 'tagBefore', renderIndex, realIndex: i }),
            close: GetOptionProps({ props: rootProps, option, key: 'close', def: rootProps.type !== 'multiselect', renderIndex, realIndex: i }),
            tagAfter: GetOptionProps({ props: rootProps, option, key: 'tagAfter', renderIndex, realIndex: i }),
            renderIndex, realIndex: i
        }
        if (types.isMultiple) {
            if (rootProps.value.indexOf(optionValue) !== -1) { obj.attrs = AddToAttrs(obj.attrs, { className: 'active' }) }
        }
        else {
            if (optionValue === rootProps.value) { obj.attrs = AddToAttrs(obj.attrs, { className: 'active' }) }
        }
        result.push(updateOptionByProperties(obj))
        renderIndex++;
    }
    return result;
}
function GetOptionProps(p: { props: AI, option: AI_option, key: AI_optionKey, def?: any, preventFunction?: boolean, realIndex?: number, renderIndex?: number }) {
    let { props, option, key, def, preventFunction, realIndex, renderIndex } = p;
    let optionResult = typeof option[key] === 'function' && !preventFunction ? option[key]({ ...option, realIndex, renderIndex }, props) : option[key]
    if (optionResult !== undefined) { return optionResult }
    let prop = (props.option || {})[key];
    if (typeof prop === 'string') {
        try {
            let value;
            eval('value = ' + prop);
            return value;
        }
        catch { }
    }
    if (typeof prop === 'function' && !preventFunction) {
        let res = prop({ ...option, realIndex, renderIndex }, props);
        return res === undefined ? def : res;
    }
    return prop !== undefined ? prop : def;
}

export {AICTX,Def,I,GetOptions,GetOptionProps};
