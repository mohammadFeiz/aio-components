import React, { Component, createRef } from 'react';
import Popup from './popup';
import { InputFile, Files } from './file';
import { Icon } from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import AIContext from './context';
import $ from 'jquery';
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
        if (className) { cls += ' ' + className }
        cls += label ? ' has-label' : '';
        cls += className ? ' ' + className : '';
        return cls;
    }
    getProps() {
        let { onSwap, dragStart, dragOver, drop, datauniqid, click, optionClick } = this.context;
        let { option, realIndex, renderIndex } = this.props;
        let { label, disabled, style } = this.properties;
        let props = {
            className: this.getClassName(label, disabled),
            onClick: option === undefined ? (e) => click(e) : () => optionClick(option),
            ref: this.dom, disabled, style, datauniqid, 'data-label': label
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
            }
            return properties
        }
        return option
    }
    renderPopup() {
        let { option } = this.props;
        if (option) { return null }
        let { open, getProp } = this.context;
        if (!open) { return null }
        let popOver = getProp('popOver');
        if (!popOver) { return null }
        return <Popup popOver={popOver} parentDom={this.dom} />
    }
    render() {
        let { type } = this.context;
        let { option } = this.props;
        this.properties = this.getProperties()
        let { checked, checkIcon, before, text, subtext, after, caret } = this.properties;
        let content = (
            <>
                <CheckIcon {...{ checked, checkIcon, type, option }} />
                <Before before={before} type={type} option={option} />
                <div className={`aio-input-content aio-input-${type}-content`}>
                    <Text text={text} type={type} option={option} />
                    <Subtext subtext={subtext} type={type} option={option} />
                </div>
                <After after={after} type={type} option={option} />
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
                <button {...props}>{content}</button>
                {this.renderPopup()}
            </>
        )
    }
}

class Caret extends Component {
    render() {
        let { caret } = this.props;
        if (caret === false) { return null }
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

