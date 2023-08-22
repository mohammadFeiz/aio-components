import React, { Component, createRef } from 'react';
import { Icon } from '@mdi/react';
import { mdiChevronDown, mdiLoading,mdiAttachment, mdiClose } from '@mdi/js';
import DownloadUrl from '../aio-functions/download-url';
import AIContext from './context';

export default class Layout extends Component {
    static contextType = AIContext;
    constructor(props) {
        super(props);
        this.dom = createRef()
    }
    getClassName(label, disabled) {
        let { type, getProp, getOptionProp } = this.context;
        let { option } = this.props;
        let cls;
        let className;
        if (option !== undefined) {
            cls = `aio-input-option aio-input-${type}-option`
            if (getProp('multiple')) { cls += ` aio-input-${type}-multiple-option` }
            className = getOptionProp(option, 'className')
        }
        else {
            cls = `aio-input aio-input-${type}`;
            if (type === 'file' && disabled) { cls += ' disabled' }
            className = getProp('className');
            let rtl = getProp('rtl');
            if (rtl) { cls += ' aio-input-rtl' }

        }
        cls += label ? ' has-label' : '';
        cls += className ? ' ' + className : '';
        return cls;
    }
    getProps() {
        let { onSwap, dragStart, dragOver, drop, datauniqid, click, optionClick } = this.context;
        let { option, realIndex, renderIndex } = this.props;
        let { label, disabled, style,center,loading,attrs } = this.properties;
        let props = {
            ...attrs,
            className: this.getClassName(label, disabled),
            onClick: loading?undefined:(option === undefined ? (e) => click(e,this.dom) : () => optionClick(option)),
            ref: this.dom, disabled, style:{justifyContent:center?'center':undefined,...style}, datauniqid, 'data-label': label
        }
        if (option && onSwap) {
            props.datarealindex = realIndex;
            props.datarenderindex = renderIndex;
            props.onDragStart = dragStart;
            props.onDragOver = dragOver;
            props.onDrop = drop;
            props.draggable = true;
        }
        return props;
    }
    getDefaultChecked() {
        let { type, getProp } = this.context;
        if (type === 'checkbox') { return !!getProp('value') }
    }
    getProperties() {
        let { option, text } = this.props;
        if (!option) {
            let { getProp } = this.context;
            let properties = {
                label: getProp('label'),
                tabIndex: getProp('tabIndex'),
                attrs: getProp('attrs',{}),
                caret: getProp('caret'),
                className: getProp('className'),
                disabled: getProp('disabled'),
                style: getProp('style'),
                text: text !== undefined ? text : getProp('text'),
                checkIcon: getProp('checkIcon', []),
                checked: getProp('checked', this.getDefaultChecked()),
                before: getProp('before'),
                after: getProp('after'),
                subtext: getProp('subtext'),
                onClick: getProp('onClick'),
                center:getProp('center'),
                loading:getProp('loading')
            }
            return properties
        }
        return option
    }
    render() {
        let { type } = this.context;
        let { option } = this.props;
        this.properties = this.getProperties()
        let { checked, checkIcon, before, text, subtext, after, caret,center,loading } = this.properties;
        let content = (
            <>
                <CheckIcon {...{ checked, checkIcon, type, option }} />
                <Before before={before} type={type} option={option} />
                <div className={`aio-input-content aio-input-${type}-content`} style={{flex:center?'none':undefined}}>
                    <Text text={text} type={type} option={option} />
                    <Subtext subtext={subtext} type={type} option={option} />
                </div>
                <After after={after} type={type} option={option} />
                <Loading loading={loading} type={type} option={option} />
                <Caret caret={caret} type={type} option={option} />
            </>
        )
        let props = this.getProps();
        if (type === 'file') {
            return (
                <>
                    <label {...props}>{content}<InputFile /></label>
                    <Files />
                </>
            )
        }
        return (
            <>
                <div {...props}>{content}</div>
            </>
        )
    }
}

class Caret extends Component {
    render() {
        let { caret } = this.props;
        if (!caret) { return null }
        if (caret === true) { caret = <Icon path={mdiChevronDown} size={.8} /> }
        return (
            <div className='aio-input-caret'>{caret}</div>
        )
    }
}
class CheckIcon extends Component {
    static contextType = AIContext;
    render() {
        let { gap } = this.context;
        let { checked, checkIcon = [] } = this.props;
        if (checked === undefined) { return null }
        if (typeof checkIcon === 'function') {
            return (
                <>
                    {checkIcon(checked)}
                    <div className='aio-button-gap' style={{ width: gap }}></div>
                </>
            )
        }
        let [outerSize, innerSize, stroke, outerColor = 'dodgerblue', innerColor = outerColor, round = false] = checkIcon;
        return (
            <>
                <div
                    className={'aio-input-check-out' + (checked ? ' checked' : '') + (round ? ' round' : '')}
                    style={{ color: outerColor, width: outerSize, height: outerSize, border: `${stroke}px solid` }}
                >
                    {
                        checked &&
                        <div
                            className={'aio-input-check-in' + (round ? ' round' : '')}
                            style={{ background: innerColor, width: innerSize, height: innerSize }}
                        ></div>}
                </div>
                <div className='aio-button-gap' style={{ width: gap }}></div>
            </>
        );
    }
}
class Before extends Component {
    render() {
        let { before, type, option } = this.props;
        if (before === undefined) { return null }
        return (
            <div className={`aio-input-before aio-input-${option ? `${type}-option` : type}-before`}>{before}</div>
        )
    }
}
class After extends Component {
    render() {
        let { after, type, option } = this.props;
        if (after === undefined) { return null }
        return (
            <div className={`aio-input-after aio-input-${option ? `${type}-option` : type}-after`}>{after}</div>
        )
    }
}
class Loading extends Component {
    render() {
        let { loading, type, option } = this.props;
        if (!loading) { return null }
        if(loading === true){
            loading = <Icon path={mdiLoading} spin={0.3} size={.8}/>
        }
        return (
            <div className={`aio-input-loading aio-input-${option ? `${type}-option` : type}-loading`}>{loading}</div>
        )
    }
}
class Subtext extends Component {
    render() {
        let { subtext, type, option } = this.props;
        if (subtext === undefined) { return null }
        return (
            <div className={`aio-input-subtext aio-input-${option ? `${type}-option` : type}-subtext`}>{subtext}</div>
        )
    }
}
class Text extends Component {
    render() {
        let { text, type, option } = this.props;
        if (text === undefined) { return null }
        return (
            <div className={`aio-input-value aio-input-${option ? `${type}-option` : type}-value`}>{text}</div>
        )
    }
}
class Border extends Component {
    render() {
        return (
            ''
        )
    }
}

export class InputFile extends Component {
    static contextType = AIContext;
    change(e) {
        let { value = [], onChange = () => { } } = this.context;
        let Files = e.target.files;
        let result = [...value];
        let names = result.map(({ name }) => name);
        for (let i = 0; i < Files.length; i++) {
            let file = Files[i];
            if (names.indexOf(file.name) !== -1) { continue }
            result.push({ name: file.name, size: file.size, file })
        }
        onChange(result)
    }
    render() {
        let { disabled, multiple } = this.context;
        let props = { disabled, type: 'file', style: { display: 'none' }, multiple, onChange: (e) => this.change(e) }
        return <input {...props} />
    }
}
export class Files extends Component {
    static contextType = AIContext;
    render() {
        let { value = [], rtl } = this.context;
        if (!value.length) { return null }
        return (
            <div className='aio-input-files' style={{ direction: rtl ? 'rtl' : 'ltr' }}>{value.map((o, i) => <File key={i} {...o} index={i} />)}</div>
        )
    }
}
class File extends Component {
    static contextType = AIContext;
    getFile(filename, fileSize) {
        let nameLength = 20;
        try {
            let minName, sizeString;
            let lastDotIndex = filename.lastIndexOf('.');
            let name = filename.slice(0, lastDotIndex);
            let format = filename.slice(lastDotIndex + 1, filename.length);
            if (name.length > nameLength) {
                minName = name.slice(0, parseInt(nameLength / 2)) + '...' + name.slice(name.length - parseInt(nameLength / 2), name.length) + '.' + format;
            }
            else { minName = filename; }
            let size = fileSize;
            let gb = size / (1024 * 1024 * 1024), mb = size / (1024 * 1024), kb = size / 1024;
            if (gb >= 1) { sizeString = gb.toFixed(2) + ' GB'; }
            else if (mb >= 1) { sizeString = mb.toFixed(2) + ' MB'; }
            else if (kb >= 1) { sizeString = kb.toFixed(2) + ' KB'; }
            else { sizeString = size + ' byte' }
            return { minName, sizeString }
        }
        catch {
            return { minName: 'untitle', sizeString: '0' }
        }
    }
    remove(index) {
        let { onChange = () => { }, value = [] } = this.context;
        let newValue = [];
        for (let i = 0; i < value.length; i++) {
            if (i === index) { continue }
            newValue.push(value[i])
        }
        onChange(newValue);
    }
    render() {
        let { name, url, size, index } = this.props;
        let { minName, sizeString } = this.getFile(name, size);
        return (
            <div className='aio-input-file'>
                <div className='aio-input-file-icon'>
                    <Icon path={mdiAttachment} size={.8} />
                </div>
                <div className='aio-input-file-name' onClick={() => DownloadUrl(url, name)}>
                    {`${minName} (${sizeString})`}
                </div>
                <div className='aio-input-file-icon' onClick={() => this.remove(index)}>
                    <Icon path={mdiClose} size={.7} />
                </div>
            </div>
        )
    }
}