
import {createContext} from 'react';
import {Icon} from '@mdi/react';
const AICTX = createContext();
function Def(prop){
    let res = {
        'theme':[],
        'date-size':180,
        'range-size':72,
        'date-unit':'day'
    }[prop]
    return res
}
function I(path,size,p){
    return <Icon path={path} size={size} {...p}/>
}
const addToAttrs = (attrs, p) => {
    attrs = attrs || {};
    let { style } = p;
    let attrClassName = attrs.className?attrs.className.split(' '):[];
    let className = p.className?(Array.isArray(p.className)?p.className:p.className.split(' ')):[];
    let classNames = [...attrClassName,...className.filter((o)=>!!o)];
    let newClassName = classNames.length ? classNames.join(' ') : undefined
    let newStyle = { ...attrs.style, ...style };
    return { ...attrs, className: newClassName, style: newStyle,...p.attrs }
}

export {AICTX,Def,I,addToAttrs};
