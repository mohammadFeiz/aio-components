import React, { Component } from "react";
import AIOStorage from './../../npm/aio-storage/aio-storage';
import AIOButton from './../../npm/aio-button/aio-button';
import { Icon } from '@mdi/react';
import { mdiAccount, mdiAttachment, mdiMagnify, mdiCodeJson, mdiFile, mdiLanguageCss3, mdiLanguageHtml5 } from '@mdi/js';
import AIODoc from './../../npm/aio-documentation/aio-documentation';
import './doc-aio-button.css';
export default class DOC_AIOButton extends Component {
    Storage = AIOStorage('docaiobutton')
    state = {
        files: [],
        gender: 'female',
        skills: [],
        tab: '0',
        option: '1',
        options: [],
        active: false,
        name: '',
        rows: [],
        age: '',
        desc: '',
        color:'',
        show: this.Storage.load({name:'show',def:{
            type: 'button',
            prop: 'text',
            types: [
                'button', 
                'file', 
                'select', 
                'multiselect', 
                'tabs', 
                'radio', 
                'checkbox',
                'text', 
                'number', 
                'textarea', 
                'color', 
                'password',
                'table'
            ],
            props: [
                'all',
                'text',
                'onClick',
                'multiple',
                'options',
                'label',
                'rows',
                'header',
                'columns',
                'add',
                'remove',
                'filter',
                'optionText',
                'optionValue',
                'optionStyle',
                'optionDisabled',
                'optionSubtext',
                'optionBefore',
                'optionAfter',
                'optionClassName',
                'optionAttrs',
                'optionChacked',
                'optionClose',
                'after',
                'before',
                'style',
               
            ]

        }})
    }
    changeControl(field,value){
        let {show} = this.state;
        show[field] = value; 
        this.Storage.save({name:'show',value:show});
        this.setState({ show });
    }
    render() {
        let { files, gender, skills, tab, option, options, active, name, rows, age, desc, color, show } = this.state
        let { Titr, Code } = AIODoc();
        let ex = [
            //button
            {
                type: 'button', props: ['text', 'onClick'],
                html: () => (
                    <AIOButton type='button' text='click here' onClick={() => alert()} />
                ),
                code: `
<AIOButton type='button' text='click here' onClick={() => alert()}/>                    
                `
            },
            {
                type: 'button', props: ['before'],
                html: () => (
                    <AIOButton
                        type='button'
                        text='click here'
                        onClick={() => alert()}
                        before={<Icon path={mdiAccount} size={0.8} />}
                    />
                ),
                code: `
                <AIOButton
                    type='button'
                    text='click here'
                    onClick={() => alert()}
                    before={<Icon path={mdiAccount} size={0.8} />}
                />
                `
            },
            {
                type: 'button', props: ['after'],
                html: () => (
                    <AIOButton
                        type='button'
                        text='click here'
                        onClick={() => alert()}
                        after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
                    />
                ),
                code: `
<AIOButton
    type='button'
    text='click here'
    onClick={() => alert()}
    after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
/>
                `
            },
            {
                type: 'button', props: ['style'],
                html: () => (
                    <AIOButton
                        type='button' text='click here'
                        onClick={() => alert()}
                        style={{ background: 'lightblue' }}
                    />
                ),
                code: `
<AIOButton
    type='button' text='click here'
    onClick={() => alert()}
    style={{ background: 'lightblue' }}
/>
                `
            },
            {
                type: 'button', props: ['disabled'],
                html: () => (
                    <AIOButton
                        type='button' text='click here'
                        onClick={() => alert()}
                        disabled={true}
                    />
                ),
                code: `
<AIOButton
    type='button' text='click here'
    onClick={() => alert()}
    disabled={true}
/>
                `
            },
            {
                type: 'button', props: ['label'],
                html: () => (
                    <AIOButton 
                        type='button' text='click here' 
                        onClick={() => alert()} 
                        className='dabs1'
                        label='this is my label'
                    />
                ),
                code: `
<AIOButton 
    type='button' text='click here' 
    onClick={() => alert()}
    label='this is my label'
    className='dabs1'
/>                    
                `
            },
            //file
            {
                type: 'file', props: ['text'],
                html: () => (
                    <AIOButton
                        type='file' text='select file' value={files}
                        onChange={(files) => this.setState({ files })}
                        onAdd={(filesToAdd) => true}
                        onRemove={(filename) => true}
                    />
                ),
                code: `
<AIOButton 
    type='file' text='select file' value={files} 
    onChange={(files) => this.setState({ files })} 
    onAdd={(filesToAdd) => true} 
    onRemove={(filename) => true}
/>
                `
            },
            //select
            {
                type: 'select', props: ['options'],
                html: () => (
                    <AIOButton
                        type='select' value={gender}
                        options={[
                            { text: 'not selected', value: null },
                            { text: 'Male', value: 'male' },
                            { text: 'Female', value: 'female' }
                        ]}
                        onChange={(gender) => this.setState({ gender })}
                    />
                ),
                code: `
<AIOButton
    type='select' value={gender}
    options={[
        { text: 'not selected', value: null },
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' }
    ]}
    onChange={(gender) => this.setState({ gender })}
/>
                `
            },
            {
                type: 'selct', props: ['before'],
                html: () => (
                    <AIOButton
                        type='select' value={gender}
                        options={[
                            { text: 'not selected', value: null },
                            { text: 'Male', value: 'male' },
                            { text: 'Female', value: 'female' }
                        ]}
                        onChange={(gender) => this.setState({ gender })}
                        before={<Icon path={mdiAccount} size={0.8} />}
                    />
                ),
                code: `
<AIOButton
    type='select' value={gender}
    options={[
        { text: 'not selected', value: null },
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' }
    ]}
    onChange={(gender) => this.setState({ gender })}
    before={<Icon path={mdiAccount} size={0.8} />}
/>
                `
            },
            {
                type: 'select', props: ['after'],
                html: () => (
                    <AIOButton
                        type='select' value={gender}
                        options={[
                            { text: 'not selected', value: null },
                            { text: 'Male', value: 'male' },
                            { text: 'Female', value: 'female' }
                        ]}
                        onChange={(gender) => this.setState({ gender })}
                        after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
                    />
                ),
                code: `
<AIOButton
    type='select' value={gender}
    options={[
        { text: 'not selected', value: null },
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' }
    ]}
    onChange={(gender) => this.setState({ gender })}
    after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
/>
                `
            },
            {
                type: 'select', props: ['style'],
                html: () => (
                    <AIOButton
                        type='select' value={gender}
                        options={[
                            { text: 'not selected', value: null },
                            { text: 'Male', value: 'male' },
                            { text: 'Female', value: 'female' }
                        ]}
                        onChange={(gender) => this.setState({ gender })}
                        style={{ background: 'lightblue' }}
                    />
                ),
                code: `
<AIOButton
    type='select' value={gender}
    options={[
        { text: 'not selected', value: null },
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' }
    ]}
    onChange={(gender) => this.setState({ gender })}
    style={{ background: 'lightblue' }}
/>
                `
            },
            {
                type: 'select', props: ['disabled'],
                html: () => (
                    <AIOButton
                        type='select' value={gender}
                        options={[
                            { text: 'not selected', value: null },
                            { text: 'Male', value: 'male' },
                            { text: 'Female', value: 'female' }
                        ]}
                        onChange={(gender) => this.setState({ gender })}
                        disabled={true}
                    />
                ),
                code: `
<AIOButton
    type='select' value={gender}
    options={[
        { text: 'not selected', value: null },
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' }
    ]}
    onChange={(gender) => this.setState({ gender })}
    disabled={true}
/>
                `
            },
            {
                type: 'select', props: ['optionText', 'optionValue'],
                html: () => (
                    <AIOButton
                        type='select' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={['0', '1', '2']}
                        optionText='"option " + option'
                        optionValue='option'
                    />
                ),
                code: `
<AIOButton
    type='select' value={option}
    onChange={(option) => this.setState({ option })}
    options={['0', '1', '2']}
    optionText='"option " + option'
    optionValue='option'
/>
                `
            },
            {
                type: 'select', props: ['optionBefore'],
                html: () => (
                    <AIOButton
                        type='select' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        optionBefore={<Icon path={mdiAccount} size={0.8} />}
                    />
                ),
                code: `
<AIOButton
    type='select' value={option}
    onChange={(option) => this.setState({ option })}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    optionBefore={<Icon path={mdiAccount} size={0.8} />}
/>
                `
            },
            {
                type: 'select', props: ['optionBefore'],
                html: () => (
                    <AIOButton
                        type='select' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        optionBefore={(option) => {
                            return {
                                '0': <Icon path={mdiAccount} size={0.8} />,
                                '1': <Icon path={mdiAttachment} size={0.8} />,
                                '2': <Icon path={mdiFile} size={0.8} />
                            }[option.value]
                        }}
                    />
                ),
                code: `
<AIOButton
    type='select' value={option}
    onChange={(option) => this.setState({ option })}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    optionBefore={(option) => {
        return {
            '0': <Icon path={mdiAccount} size={0.8} />,
            '1': <Icon path={mdiAttachment} size={0.8} />,
            '2': <Icon path={mdiFile} size={0.8} />
        }[option.value]
    }}
/>
                `
            },
            {
                type: 'select', props: ['optionAfter'],
                html: () => (
                    <AIOButton
                        type='select' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        optionAfter={<Icon path={mdiAccount} size={0.8} />}
                    />
                ),
                code: `
<AIOButton
    type='select' value={option}
    onChange={(option) => this.setState({ option })}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    optionAfter={<Icon path={mdiAccount} size={0.8} />}
/>
                `
            },
            {
                type: 'select', props: ['optionAfter'],
                html: () => (
                    <AIOButton
                        type='select' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0', amount: 23 },
                            { text: 'Option2', value: '1', amount: 12 },
                            { text: 'Option3', value: '2', amount: 5 }
                        ]}
                        optionAfter={(option) => {
                            return (
                                <div
                                    style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: 24 }}
                                >{option.amount}</div>
                            )
                        }}
                    />
                ),
                code: `
<AIOButton
    type='select' value={option}
    onChange={(option) => this.setState({ option })}
    options={[
        { text: 'Option1', value: '0', amount: 23 },
        { text: 'Option2', value: '1', amount: 12 },
        { text: 'Option3', value: '2', amount: 5 }
    ]}
    optionAfter={(option) => {
        return (
            <div
                style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: 24 }}
            >{option.amount}</div>
        )
    }}
/>
                `
            },
            {
                type: 'select', props: ['optionDisabled'],
                html: () => (
                    <AIOButton
                        type='select' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        optionDisabled='option.value === "2"'
                    />
                ),
                code: `
<AIOButton
type='select' value={option}
onChange={(option) => this.setState({ option })}
options={[
    { text: 'Option1', value: '0' },
    { text: 'Option2', value: '1' },
    { text: 'Option3', value: '2' }
]}
optionDisabled='option.value === "2"'
/>
                `
            },
            {
                type: 'select', props: ['optionDisabled'],
                html: () => (
                    <AIOButton
                        type='select' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0', amount: 23 },
                            { text: 'Option2', value: '1', amount: 12 },
                            { text: 'Option3', value: '2', amount: 5 }
                        ]}
                        optionDisabled={(option) => {
                            return option.amount > 10
                        }}
                    />
                ),
                code: `
<AIOButton
    type='select' value={option}
    onChange={(option) => this.setState({ option })}
    options={[
        { text: 'Option1', value: '0', amount: 23 },
        { text: 'Option2', value: '1', amount: 12 },
        { text: 'Option3', value: '2', amount: 5 }
    ]}
    optionDisabled={(option) => {
        return option.amount > 10
    }}
/>
                `
            },
            {
                type: 'select', props: ['optionStyle'],
                html: () => (
                    <AIOButton
                        type='select' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        optionStyle='{background:"lightblue"}'
                    />
                ),
                code: `
<AIOButton
    type='select' value={option}
    onChange={(option) => this.setState({ option })}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    optionStyle='{background:"lightblue"}'
/>
                `
            },
            {
                type: 'select', props: ['optionStyle'],
                html: () => (
                    <AIOButton
                        type='select' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0', amount: 23 },
                            { text: 'Option2', value: '1', amount: 12 },
                            { text: 'Option3', value: '2', amount: 5 }
                        ]}
                        optionStyle={(option) => {
                            return { background: option.amount > 10 ? 'lightblue' : 'fff' }
                        }}
                    />
                ),
                code: `
<AIOButton
    type='select' value={option}
    onChange={(option) => this.setState({ option })}
    options={[
        { text: 'Option1', value: '0', amount: 23 },
        { text: 'Option2', value: '1', amount: 12 },
        { text: 'Option3', value: '2', amount: 5 }
    ]}
    optionStyle={(option) => {
        return { background: option.amount > 10 ? 'lightblue' : 'fff' }
    }}
/>
                `
            },
            {
                type: 'select', props: ['label'],
                html: () => (
                    <AIOButton
                        type='select' value={gender}
                        options={[
                            { text: 'not selected', value: null },
                            { text: 'Male', value: 'male' },
                            { text: 'Female', value: 'female' }
                        ]}
                        onChange={(gender) => this.setState({ gender })}
                        className='dabs1'
                        label='this is my label'
                    />
                ),
                code: `
<AIOButton
    type='select' value={gender}
    options={[
        { text: 'not selected', value: null },
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' }
    ]}
    onChange={(gender) => this.setState({ gender })}
    className='dabs1'
    label='this is my label'
/>
                `
            },
            //multiselect
            {
                type: 'multiselect', props: ['options', 'text'],
                html: () => (
                    <AIOButton
                        type='multiselect' text='skills' value={skills}
                        options={[
                            { text: 'JS', value: 'js' },
                            { text: 'CSS', value: 'css' },
                            { text: 'HTML', value: 'html' }
                        ]}
                        onChange={(skills) => this.setState({ skills })}
                    />
                ),
                code: `
<AIOButton
    type='multiselect' text='skills' value={skills}
    options={[
        { text: 'JS', value: 'js' },
        { text: 'CSS', value: 'css' },
        { text: 'HTML', value: 'html' }
    ]}
    onChange={(skills) => this.setState({ skills })}
/>
                `
            },
            {
                type: 'multiselect', props: ['before'],
                html: () => (
                    <AIOButton
                        type='multiselect' text='skills' value={skills}
                        options={[
                            { text: 'JS', value: 'js' },
                            { text: 'CSS', value: 'css' },
                            { text: 'HTML', value: 'html' }
                        ]}
                        onChange={(skills) => this.setState({ skills })}
                        before={<Icon path={mdiAccount} size={0.8} />}
                    />
                ),
                code: `
<AIOButton
    type='multiselect' text='skills' value={skills}
    options={[
        { text: 'JS', value: 'js' },
        { text: 'CSS', value: 'css' },
        { text: 'HTML', value: 'html' }
    ]}
    onChange={(skills) => this.setState({ skills })}
    before={<Icon path={mdiAccount} size={0.8} />}
/>
                `
            },
            {
                type: 'multiselect', props: ['after'],
                html: () => (
                    <AIOButton
                        type='multiselect' text='skills' value={skills}
                        options={[
                            { text: 'JS', value: 'js' },
                            { text: 'CSS', value: 'css' },
                            { text: 'HTML', value: 'html' }
                        ]}
                        onChange={(skills) => this.setState({ skills })}
                        after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
                    />
                ),
                code: `
<AIOButton
    type='multiselect' text='skills' value={skills}
    options={[
        { text: 'JS', value: 'js' },
        { text: 'CSS', value: 'css' },
        { text: 'HTML', value: 'html' }
    ]}
    onChange={(skills) => this.setState({ skills })}
    after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
/>
                `
            },
            {
                type: 'multiselect', props: ['style'],
                html: () => (
                    <AIOButton
                        type='multiselect' text='skills' value={skills}
                        options={[
                            { text: 'JS', value: 'js' },
                            { text: 'CSS', value: 'css' },
                            { text: 'HTML', value: 'html' }
                        ]}
                        onChange={(skills) => this.setState({ skills })}
                        style={{ background: 'lightblue' }}
                    />
                ),
                code: `
<AIOButton
    type='multiselect' text='skills' value={skills}
    options={[
        { text: 'JS', value: 'js' },
        { text: 'CSS', value: 'css' },
        { text: 'HTML', value: 'html' }
    ]}
    onChange={(skills) => this.setState({ skills })}
    style={{ background: 'lightblue' }}
/>
                `
            },
            {
                type: 'multiselect', props: ['disabled'],
                html: () => (
                    <AIOButton
                        type='multiselect' text='skills' value={skills}
                        options={[
                            { text: 'JS', value: 'js' },
                            { text: 'CSS', value: 'css' },
                            { text: 'HTML', value: 'html' }
                        ]}
                        onChange={(skills) => this.setState({ skills })}
                        disabled={true}
                    />
                ),
                code: `
<AIOButton
    type='multiselect' text='skills' value={skills}
    options={[
        { text: 'JS', value: 'js' },
        { text: 'CSS', value: 'css' },
        { text: 'HTML', value: 'html' }
    ]}
    onChange={(skills) => this.setState({ skills })}
    disabled={true}
/>
                `
            },
            {
                type: 'multiselect', props: ['optionText', 'optionValue'],
                html: () => (
                    <AIOButton
                        type='multiselect' text='skills' value={skills}
                        onChange={(skills) => this.setState({ skills })}
                        options={['js', 'css', 'html']}
                        optionText='option.toUpperCase()'
                        optionValue='option'
                    />
                ),
                code: `
<AIOButton
    type='multiselect' text='skills' value={skills}
    onChange={(skills) => this.setState({ skills })}
    options={['js', 'css', 'html']}
    optionText='option.toUpperCase()'
    optionValue='option'
/>
                `
            },
            {
                type: 'multiselect', props: ['optionBefore'],
                html: () => (
                    <AIOButton
                        type='multiselect' text='skills'
                        value={skills}
                        onChange={(skills) => this.setState({ skills })}
                        options={[
                            { text: 'JS', value: 'js' },
                            { text: 'CSS', value: 'css' },
                            { text: 'HTML', value: 'html' }
                        ]}
                        optionBefore={<Icon path={mdiCodeJson} size={0.8} />}
                    />
                ),
                code: `
<AIOButton
    type='multiselect' text='skills'
    value={skills}
    onChange={(skills) => this.setState({ skills })}
    options={[
        { text: 'JS', value: 'js' },
        { text: 'CSS', value: 'css' },
        { text: 'HTML', value: 'html' }
    ]}
    optionBefore={<Icon path={mdiCodeJson} size={0.8} />}
/>
                `
            },
            {
                type: 'multiselect', props: ['optionBefore'],
                html: () => (
                    <AIOButton
                        type='multiselect' text='skills' value={skills}
                        onChange={(skills) => this.setState({ skills })}
                        options={[
                            { text: 'JS', value: 'js' },
                            { text: 'CSS', value: 'css' },
                            { text: 'HTML', value: 'html' }
                        ]}
                        optionBefore={(option) => {
                            return {
                                'js': <Icon path={mdiCodeJson} size={0.8} />,
                                'css': <Icon path={mdiLanguageCss3} size={0.8} />,
                                'html': <Icon path={mdiLanguageHtml5} size={0.8} />
                            }[option.value]
                        }}
                    />
                ),
                code: `
<AIOButton
    type='multiselect' text='skills' value={skills}
    onChange={(skills) => this.setState({ skills })}
    options={[
        { text: 'JS', value: 'js' },
        { text: 'CSS', value: 'css' },
        { text: 'HTML', value: 'html' }
    ]}
    optionBefore={(option) => {
        return {
            'js': <Icon path={mdiCodeJson} size={0.8} />,
            'css': <Icon path={mdiLanguageCss3} size={0.8} />,
            'html': <Icon path={mdiLanguageHtml5} size={0.8} />
        }[option.value]
    }}
/>
                `
            },
            {
                type: 'multiselect', props: ['optionAfter'],
                html: () => (
                    <AIOButton
                        type='multiselect' text='skills' value={skills}
                        onChange={(skills) => this.setState({ skills })}
                        options={[
                            { text: 'JS', value: 'js' },
                            { text: 'CSS', value: 'css' },
                            { text: 'HTML', value: 'html' }
                        ]}
                        optionAfter={<Icon path={mdiCodeJson} size={0.8} />}
                    />
                ),
                code: `
<AIOButton
    type='multiselect' text='skills' value={skills}
    onChange={(skills) => this.setState({ skills })}
    options={[
        { text: 'JS', value: 'js' },
        { text: 'CSS', value: 'css' },
        { text: 'HTML', value: 'html' }
    ]}
    optionAfter={<Icon path={mdiCodeJson} size={0.8} />}
/>
                `
            },
            {
                type: 'multiselect', props: ['optionAfter'],
                html: () => (
                    <AIOButton
                        type='multiselect' text='skills' value={skills}
                        onChange={(skills) => this.setState({ skills })}
                        options={[
                            { text: 'JS', value: 'js', amount: 3 },
                            { text: 'CSS', value: 'css', amount: 5 },
                            { text: 'HTML', value: 'html', amount: 7 }
                        ]}
                        optionAfter={(option) => {
                            return (
                                <div
                                    style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: 24 }}
                                >{option.amount}</div>
                            )
                        }}
                    />
                ),
                code: `
<AIOButton
    type='multiselect' text='skills' value={skills}
    onChange={(skills) => this.setState({ skills })}
    options={[
        { text: 'JS', value: 'js', amount: 3 },
        { text: 'CSS', value: 'css', amount: 5 },
        { text: 'HTML', value: 'html', amount: 7 }
    ]}
    optionAfter={(option) => {
        return (
            <div
                style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: 24 }}
            >{option.amount}</div>
        )
    }}
/>
                `
            },
            {
                type: 'multiselect', props: ['optionDisabled'],
                html: () => (
                    <AIOButton
                        type='multiselect' text='skills' value={skills}
                        onChange={(skills) => this.setState({ skills })}
                        options={[
                            { text: 'JS', value: 'js' },
                            { text: 'CSS', value: 'css' },
                            { text: 'HTML', value: 'html' }
                        ]}
                        optionDisabled='option.value === "css"'
                    />
                ),
                code: `
<AIOButton
    type='multiselect' text='skills' value={skills}
    onChange={(skills) => this.setState({ skills })}
    options={[
        { text: 'JS', value: 'js' },
        { text: 'CSS', value: 'css' },
        { text: 'HTML', value: 'html' }
    ]}
    optionDisabled='option.value === "css"'
/>
                `
            },
            {
                type: 'multiselect', props: ['optionDisabled'],
                html: () => (
                    <AIOButton
                        type='multiselect' text='skills' value={skills}
                        onChange={(skills) => this.setState({ skills })}
                        options={[
                            { text: 'JS', value: 'js', amount: 3 },
                            { text: 'CSS', value: 'css', amount: 5 },
                            { text: 'HTML', value: 'html', amount: 7 }
                        ]}
                        optionDisabled={(option) => {
                            return option.value === 'css'
                        }}
                    />
                ),
                code: `
<AIOButton
    type='multiselect' text='skills' value={skills}
    onChange={(skills) => this.setState({ skills })}
    options={[
        { text: 'JS', value: 'js', amount: 3 },
        { text: 'CSS', value: 'css', amount: 5 },
        { text: 'HTML', value: 'html', amount: 7 }
    ]}
    optionDisabled={(option) => {
        return option.value === 'css'
    }}
/>
                `
            },
            {
                type: 'multiselect', props: ['optionStyle'],
                html: () => (
                    <AIOButton
                        type='multiselect' text='skills' value={skills}
                        onChange={(skills) => this.setState({ skills })}
                        options={[
                            { text: 'JS', value: 'js', color: 'yellow' },
                            { text: 'CSS', value: 'css', color: 'lightblue' },
                            { text: 'HTML', value: 'html', color: 'orange' }
                        ]}
                        optionStyle='{background:option.color}'
                    />
                ),
                code: `
<AIOButton
    type='multiselect' text='skills' value={skills}
    onChange={(skills) => this.setState({ skills })}
    options={[
        { text: 'JS', value: 'js', color: 'yellow' },
        { text: 'CSS', value: 'css', color: 'lightblue' },
        { text: 'HTML', value: 'html', color: 'orange' }
    ]}
    optionStyle='{background:option.color}'
/>
                `
            },
            {
                type: 'multiselect', props: ['optionStyle'],
                html: () => (
                    <AIOButton
                        type='multiselect' text='skills' value={skills}
                        onChange={(skills) => this.setState({ skills })}
                        options={[
                            { text: 'JS', value: 'js' },
                            { text: 'CSS', value: 'css' },
                            { text: 'HTML', value: 'html' }
                        ]}
                        optionStyle={(option) => {
                            return {
                                background: {
                                    'js': 'yellow',
                                    'css': 'lightblue',
                                    'html': 'orange'
                                }[option.value]
                            }
                        }}
                    />
                ),
                code: `
<AIOButton
    type='multiselect' text='skills' value={skills}
    onChange={(skills) => this.setState({ skills })}
    options={[
        { text: 'JS', value: 'js' },
        { text: 'CSS', value: 'css' },
        { text: 'HTML', value: 'html' }
    ]}
    optionStyle={(option) => {
        return {
            background: {
                'js': 'yellow',
                'css': 'lightblue',
                'html': 'orange'
            }[option.value]
        }
    }}
/>
                `
            },
            {
                type: 'multiselect', props: ['label'],
                html: () => (
                    <AIOButton
                        type='multiselect' text='skills' value={skills}
                        options={[
                            { text: 'JS', value: 'js' },
                            { text: 'CSS', value: 'css' },
                            { text: 'HTML', value: 'html' }
                        ]}
                        onChange={(skills) => this.setState({ skills })}
                        className='dabs1'
                        label='this is my label'
                    />
                ),
                code: `
<AIOButton
    type='multiselect' text='skills' value={skills}
    options={[
        { text: 'JS', value: 'js' },
        { text: 'CSS', value: 'css' },
        { text: 'HTML', value: 'html' }
    ]}
    onChange={(skills) => this.setState({ skills })}
    className='dabs1'
    label='this is my label'
/>
                `
            },
            //tabs
            {
                type: 'tabs', props: ['options'],
                html: () => (
                    <AIOButton
                        type='tabs' value={tab}
                        options={[
                            { text: 'Page1', value: '0' },
                            { text: 'Page2', value: '1' },
                            { text: 'Page3', value: '2' }
                        ]}
                        onChange={(tab) => this.setState({ tab })}
                    />
                ),
                code: `
<AIOButton
    type='tabs' value={tab}
    options={[
        { text: 'Page1', value: '0' },
        { text: 'Page2', value: '1' },
        { text: 'Page3', value: '2' }
    ]}
    onChange={(tab) => this.setState({ tab })}
/>
                `
            },
            {
                type: 'tabs', props: ['before'],
                html: () => (
                    <AIOButton
                        type='tabs' value={tab}
                        options={[
                            { text: 'Page1', value: '0' },
                            { text: 'Page2', value: '1' },
                            { text: 'Page3', value: '2' }
                        ]}
                        onChange={(tab) => this.setState({ tab })}
                        before={<Icon path={mdiAccount} size={0.8} />}
                    />
                ),
                code: `
<AIOButton
    type='tabs' value={tab}
    options={[
        { text: 'Page1', value: '0' },
        { text: 'Page2', value: '1' },
        { text: 'Page3', value: '2' }
    ]}
    onChange={(tab) => this.setState({ tab })}
    before={<Icon path={mdiAccount} size={0.8} />}
/>
                `
            },
            {
                type: 'tabs', props: ['after'],
                html: () => (
                    <AIOButton
                        type='tabs' value={tab}
                        options={[
                            { text: 'Page1', value: '0' },
                            { text: 'Page2', value: '1' },
                            { text: 'Page3', value: '2' }
                        ]}
                        onChange={(tab) => this.setState({ tab })}
                        after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
                    />
                ),
                code: `
<AIOButton
    type='tabs' value={tab}
    options={[
        { text: 'Page1', value: '0' },
        { text: 'Page2', value: '1' },
        { text: 'Page3', value: '2' }
    ]}
    onChange={(tab) => this.setState({ tab })}
    after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
/>
                `
            },
            {
                type: 'tabs', props: ['style'],
                html: () => (
                    <AIOButton
                        type='tabs' value={tab}
                        options={[
                            { text: 'Page1', value: '0' },
                            { text: 'Page2', value: '1' },
                            { text: 'Page3', value: '2' }
                        ]}
                        onChange={(tab) => this.setState({ tab })}
                        style={{ background: 'lightblue' }}
                    />
                ),
                code: `
<AIOButton
    type='tabs' value={tab}
    options={[
        { text: 'Page1', value: '0' },
        { text: 'Page2', value: '1' },
        { text: 'Page3', value: '2' }
    ]}
    onChange={(tab) => this.setState({ tab })}
    style={{ background: 'lightblue' }}
/>
                `
            },
            {
                type: 'tabs', props: ['disabled'],
                html: () => (
                    <AIOButton
                        type='tabs' value={tab}
                        options={[
                            { text: 'Page1', value: '0' },
                            { text: 'Page2', value: '1' },
                            { text: 'Page3', value: '2' }
                        ]}
                        onChange={(tab) => this.setState({ tab })}
                        disabled={true}
                    />
                ),
                code: `
<AIOButton
    type='tabs' value={tab}
    options={[
        { text: 'Page1', value: '0' },
        { text: 'Page2', value: '1' },
        { text: 'Page3', value: '2' }
    ]}
    onChange={(tab) => this.setState({ tab })}
    disabled={true}
/>
                `
            },
            {
                type: 'tabs', props: ['optionText', 'optionValue'],
                html: () => (
                    <AIOButton
                        type='tabs' value={tab}
                        onChange={(tab) => this.setState({ tab })}
                        options={['0', '1', '2']}
                        optionText='"Page" + (parseInt(option) + 1)'
                        optionValue='option'
                    />
                ),
                code: `
<AIOButton
    type='tabs' value={tab}
    onChange={(tab) => this.setState({ tab })}
    options={['0', '1', '2']}
    optionText='"Page" + (parseInt(option) + 1)'
    optionValue='option'
/>
                `
            },
            {
                type: 'tabs', props: ['optionBefore'],
                html: () => (
                    <AIOButton
                        type='tabs' value={tab}
                        onChange={(tab) => this.setState({ tab })}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        optionBefore={<Icon path={mdiAccount} size={0.8} />}
                    />
                ),
                code: `
<AIOButton
    type='tabs' value={tab}
    onChange={(tab) => this.setState({ tab })}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    optionBefore={<Icon path={mdiAccount} size={0.8} />}
/>
                `
            },
            {
                type: 'tabs', props: ['optionBefore'],
                html: () => (
                    <AIOButton
                        type='tabs' value={tab}
                        onChange={(tab) => this.setState({ tab })}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        optionBefore={(option) => {
                            return {
                                '0': <Icon path={mdiAccount} size={0.8} />,
                                '1': <Icon path={mdiAttachment} size={0.8} />,
                                '2': <Icon path={mdiFile} size={0.8} />
                            }[option.value]
                        }}
                    />
                ),
                code: `
<AIOButton
    type='tabs' value={tab}
    onChange={(tab) => this.setState({ tab })}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    optionBefore={(option) => {
        return {
            '0': <Icon path={mdiAccount} size={0.8} />,
            '1': <Icon path={mdiAttachment} size={0.8} />,
            '2': <Icon path={mdiFile} size={0.8} />
        }[option.value]
    }}
/>
                `
            },
            {
                type: 'tabs', props: ['optionAfter'],
                html: () => (
                    <AIOButton
                        type='tabs' value={tab}
                        onChange={(tab) => this.setState({ tab })}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        optionAfter={<Icon path={mdiAccount} size={0.8} />}
                    />
                ),
                code: `
<AIOButton
    type='tabs' value={tab}
    onChange={(tab) => this.setState({ tab })}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    optionAfter={<Icon path={mdiAccount} size={0.8} />}
/>
                `
            },
            {
                type: 'tabs', props: ['optionAfter'],
                html: () => (
                    <AIOButton
                        type='tabs' value={tab}
                        onChange={(tab) => this.setState({ tab })}
                        options={[
                            { text: 'Option1', value: '0', amount: 3 },
                            { text: 'Option2', value: '1', amount: 5 },
                            { text: 'Option3', value: '2', amount: 7 }
                        ]}
                        optionAfter={(option) => {
                            return (
                                <div
                                    style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: 24 }}
                                >{option.amount}</div>
                            )
                        }}
                    />
                ),
                code: `
<AIOButton
    type='tabs' value={tab}
    onChange={(tab) => this.setState({ tab })}
    options={[
        { text: 'Option1', value: '0', amount: 3 },
        { text: 'Option2', value: '1', amount: 5 },
        { text: 'Option3', value: '2', amount: 7 }
    ]}
    optionAfter={(option) => {
        return (
            <div
                style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: 24 }}
            >{option.amount}</div>
        )
    }}
/>
                `
            },
            {
                type: 'tabs', props: ['optionDisabled'],
                html: () => (
                    <AIOButton
                        type='tabs' value={tab}
                        onChange={(tab) => this.setState({ tab })}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        optionDisabled='option.value === "1"'
                    />
                ),
                code: `
<AIOButton
    type='tabs' value={tab}
    onChange={(tab) => this.setState({ tab })}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    optionDisabled='option.value === "1"'
/>
                `
            },
            {
                type: 'tabs', props: ['optionDisabled'],
                html: () => (
                    <AIOButton
                        type='tabs' value={tab}
                        onChange={(tab) => this.setState({ tab })}
                        options={[
                            { text: 'Option1', value: '0', amount: 3 },
                            { text: 'Option2', value: '1', amount: 5 },
                            { text: 'Option3', value: '2', amount: 7 }
                        ]}
                        optionDisabled={(option) => {
                            return option.value === '1'
                        }}
                    />
                ),
                code: `
<AIOButton
    type='tabs' value={tab}
    onChange={(tab) => this.setState({ tab })}
    options={[
        { text: 'Option1', value: '0', amount: 3 },
        { text: 'Option2', value: '1', amount: 5 },
        { text: 'Option3', value: '2', amount: 7 }
    ]}
    optionDisabled={(option) => {
        return option.value === '1'
    }}
/>
                `
            },
            {
                type: 'tabs', props: ['optionStyle'],
                html: () => (
                    <AIOButton
                        type='tabs' value={tab}
                        onChange={(tab) => this.setState({ tab })}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        optionStyle='{background:option.value === "1"?"lightblue":"#fff"}'
                    />
                ),
                code: `
<AIOButton
    type='tabs' value={tab}
    onChange={(tab) => this.setState({ tab })}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    optionStyle='{background:option.value === "1"?"lightblue":"#fff"}'
/>
                `
            },
            {
                type: 'tabs', props: ['optionStyle'],
                html: () => (
                    <AIOButton
                        type='tabs' value={tab}
                        onChange={(tab) => this.setState({ tab })}
                        options={[
                            { text: 'Option1', value: '0', amount: 3 },
                            { text: 'Option2', value: '1', amount: 5 },
                            { text: 'Option3', value: '2', amount: 7 }
                        ]}
                        optionStyle={(option) => {
                            return { background: option.value === '2' ? 'lightblue' : '#fff' }
                        }}
                    />
                ),
                code: `
<AIOButton
    type='tabs' value={tab}
    onChange={(tab) => this.setState({ tab })}
    options={[
        { text: 'Option1', value: '0', amount: 3 },
        { text: 'Option2', value: '1', amount: 5 },
        { text: 'Option3', value: '2', amount: 7 }
    ]}
    optionStyle={(option) => {
        return { background: option.value === '2' ? 'lightblue' : '#fff' }
    }}
/>
                `
            },
            //radio
            {
                type: 'radio', props: ['options'],
                html: () => (
                    <AIOButton
                        type='radio' value={option}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        onChange={(option) => this.setState({ option })}
                    />
                ),
                code: `
<AIOButton
    type='radio' value={option}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    onChange={(option) => this.setState({ option })}
/>
                `
            },
            {
                type: 'radio', props: ['options', 'multiple'],
                html: () => (
                    <AIOButton
                        type='radio' multiple={true} value={options}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        onChange={(options) => this.setState({ options })}
                    />
                ),
                code: `
<AIOButton
    type='radio' multiple={true} value={options}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    onChange={(options) => this.setState({ options })}
/>
                `
            },
            {
                type: 'radio', props: ['style'],
                html: () => (
                    <AIOButton
                        type='radio' value={option}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        onChange={(option) => this.setState({ option })}
                        style={{ background: 'lightblue' }}
                    />
                ),
                code: `
<AIOButton
    type='radio' value={option}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    onChange={(option) => this.setState({ option })}
    style={{ background: 'lightblue' }}
/>
                `
            },
            {
                type: 'radio', props: ['disabled'],
                html: () => (
                    <AIOButton
                        type='radio' value={option}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        onChange={(option) => this.setState({ option })}
                        disabled={true}
                    />
                ),
                code: `
<AIOButton
    type='radio' value={option}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    onChange={(option) => this.setState({ option })}
    disabled={true}
/>
                `
            },
            {
                type: 'radio', props: ['optionText', 'optionValue'],
                html: () => (
                    <AIOButton
                        type='radio' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={['0', '1', '2']}
                        optionText='"Option" + (parseInt(option) + 1)'
                        optionValue='option'
                    />
                ),
                code: `
<AIOButton
    type='radio' value={option}
    onChange={(option) => this.setState({ option })}
    options={['0', '1', '2']}
    optionText='"Option" + (parseInt(option) + 1)'
    optionValue='option'
/>
                `
            },
            {
                type: 'radio', props: ['optionBefore'],
                html: () => (
                    <AIOButton
                        type='radio' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        optionBefore={<Icon path={mdiAccount} size={0.8} />}
                    />
                ),
                code: `
<AIOButton
    type='radio' value={option}
    onChange={(option) => this.setState({ option })}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    optionBefore={<Icon path={mdiAccount} size={0.8} />}
/>
                `
            },
            {
                type: 'radio', props: ['optionBefore'],
                html: () => (
                    <AIOButton
                        type='radio' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        optionBefore={(option) => {
                            return {
                                '0': <Icon path={mdiAccount} size={0.8} />,
                                '1': <Icon path={mdiAttachment} size={0.8} />,
                                '2': <Icon path={mdiFile} size={0.8} />
                            }[option.value]
                        }}
                    />
                ),
                code: `
<AIOButton
    type='radio' value={option}
    onChange={(option) => this.setState({ option })}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    optionBefore={(option) => {
        return {
            '0': <Icon path={mdiAccount} size={0.8} />,
            '1': <Icon path={mdiAttachment} size={0.8} />,
            '2': <Icon path={mdiFile} size={0.8} />
        }[option.value]
    }}
/>
                `
            },
            {
                type: 'radio', props: ['optionAfter'],
                html: () => (
                    <AIOButton
                        type='radio' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        optionAfter={<Icon path={mdiAccount} size={0.8} />}
                    />
                ),
                code: `
<AIOButton
    type='radio' value={option}
    onChange={(option) => this.setState({ option })}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    optionAfter={<Icon path={mdiAccount} size={0.8} />}
/>
                `
            },
            {
                type: 'radio', props: ['optionAfter'],
                html: () => (
                    <AIOButton
                        type='radio' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0', amount: 3 },
                            { text: 'Option2', value: '1', amount: 5 },
                            { text: 'Option3', value: '2', amount: 7 }
                        ]}
                        optionAfter={(option) => {
                            return (
                                <div
                                    style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: 24 }}
                                >{option.amount}</div>
                            )
                        }}
                    />
                ),
                code: `
<AIOButton
    type='radio' value={option}
    onChange={(option) => this.setState({ option })}
    options={[
        { text: 'Option1', value: '0', amount: 3 },
        { text: 'Option2', value: '1', amount: 5 },
        { text: 'Option3', value: '2', amount: 7 }
    ]}
    optionAfter={(option) => {
        return (
            <div
                style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: 24 }}
            >{option.amount}</div>
        )
    }}
/>
                `
            },
            {
                type: 'radio', props: ['optionDisabled'],
                html: () => (
                    <AIOButton
                        type='radio' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        optionDisabled='option.value === "1"'
                    />
                ),
                code: `
<AIOButton
    type='radio' value={option}
    onChange={(option) => this.setState({ option })}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    optionDisabled='option.value === "1"'
/>
                `
            },
            {
                type: 'radio', props: ['optionDisabled'],
                html: () => (
                    <AIOButton
                        type='radio' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0', amount: 3 },
                            { text: 'Option2', value: '1', amount: 5 },
                            { text: 'Option3', value: '2', amount: 7 }
                        ]}
                        optionDisabled={(option) => {
                            return option.value === '1'
                        }}
                    />
                ),
                code: `
<AIOButton
    type='radio' value={option}
    onChange={(option) => this.setState({ option })}
    options={[
        { text: 'Option1', value: '0', amount: 3 },
        { text: 'Option2', value: '1', amount: 5 },
        { text: 'Option3', value: '2', amount: 7 }
    ]}
    optionDisabled={(option) => {
        return option.value === '1'
    }}
/>
                `
            },
            {
                type: 'radio', props: ['optionStyle'],
                html: () => (
                    <AIOButton
                        type='radio' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        optionStyle='{background:option.value === "1"?"lightblue":"#fff"}'
                    />
                ),
                code: `
<AIOButton
    type='radio' value={option}
    onChange={(option) => this.setState({ option })}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    optionStyle='{background:option.value === "1"?"lightblue":"#fff"}'
/>
                `
            },
            {
                type: 'radio', props: ['optionStyle'],
                html: () => (
                    <AIOButton
                        type='radio' value={option}
                        onChange={(option) => this.setState({ option })}
                        options={[
                            { text: 'Option1', value: '0', amount: 3 },
                            { text: 'Option2', value: '1', amount: 5 },
                            { text: 'Option3', value: '2', amount: 7 }
                        ]}
                        optionStyle={(option) => {
                            return { background: option.value === '2' ? 'lightblue' : '#fff' }
                        }}
                    />
                ),
                code: `
<AIOButton
    type='radio' value={option}
    onChange={(option) => this.setState({ option })}
    options={[
        { text: 'Option1', value: '0', amount: 3 },
        { text: 'Option2', value: '1', amount: 5 },
        { text: 'Option3', value: '2', amount: 7 }
    ]}
    optionStyle={(option) => {
        return { background: option.value === '2' ? 'lightblue' : '#fff' }
    }}
/>
                `
            },
            {
                type: 'radio', props: ['label'],
                html: () => (
                    <AIOButton
                        type='radio' value={option}
                        options={[
                            { text: 'Option1', value: '0' },
                            { text: 'Option2', value: '1' },
                            { text: 'Option3', value: '2' }
                        ]}
                        onChange={(option) => this.setState({ option })}
                        className='dabs1'
                        label='this is my label'
                    />
                ),
                code: `
<AIOButton
    type='radio' value={option}
    options={[
        { text: 'Option1', value: '0' },
        { text: 'Option2', value: '1' },
        { text: 'Option3', value: '2' }
    ]}
    onChange={(option) => this.setState({ option })}
/>
                `
            },
            //checkbox
            {
                type: 'checkbox', props: ['text'],
                html: () => (
                    <AIOButton
                        text='Is Active' type='checkbox' value={active}
                        onChange={(active) => this.setState({ active: !active })}
                    />
                ),
                code: `
<AIOButton
    text='Is Active' type='checkbox' value={active}
    onChange={(active) => this.setState({ active: !active })}
/>
                `
            },
            {
                type: 'checkbox', props: ['before'],
                html: () => (
                    <AIOButton
                        text='Is Active'
                        type='checkbox'
                        value={active}
                        onChange={(active) => {
                            this.setState({ active: !active })
                        }}
                        before={<Icon path={mdiAccount} size={0.8} />}
                    />
                ),
                code: `
<AIOButton
    text='Is Active'
    type='checkbox'
    value={active}
    onChange={(active) => {
        this.setState({ active: !active })
    }}
    before={<Icon path={mdiAccount} size={0.8} />}
/>
                `
            },
            {
                type: 'checkbox', props: ['after'],
                html: () => (
                    <AIOButton
                        text='Is Active' type='checkbox' value={active}
                        onChange={(active) => this.setState({ active: !active })}
                        after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
                    />
                ),
                code: `
<AIOButton
    text='Is Active' type='checkbox' value={active}
    onChange={(active) => this.setState({ active: !active })}
    after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
/>
                `
            },
            {
                type: 'checkbox', props: ['style'],
                html: () => (
                    <AIOButton
                        text='Is Active' type='checkbox' value={active}
                        onChange={(active) => this.setState({ active: !active })}
                        style={{ background: 'lightblue' }}
                    />
                ),
                code: `
<AIOButton
    text='Is Active' type='checkbox' value={active}
    onChange={(active) => this.setState({ active: !active })}
    style={{ background: 'lightblue' }}
/>
                `
            },
            {
                type: 'checkbox', props: ['disabled'],
                html: () => (
                    <AIOButton
                        text='Is Active' type='checkbox' value={active}
                        onChange={(active) => this.setState({ active: !active })}
                        disabled={true}
                    />
                ),
                code: `
<AIOButton
    text='Is Active' type='checkbox' value={active}
    onChange={(active) => this.setState({ active: !active })}
    disabled={true}
/>
                `
            },
            {
                type: 'checkbox', props: ['label'],
                html: () => (
                    <AIOButton
                        text='Is Active' type='checkbox' value={active}
                        onChange={(active) => this.setState({ active: !active })}
                        className='dabs1'
                        label='this is my label'
                    />
                ),
                code: `
<AIOButton
    text='Is Active' type='checkbox' value={active}
    onChange={(active) => this.setState({ active: !active })}
    className='dabs1'
    label='this is my label'
/>
                `
            },
            //text
            {
                type: 'text', props: ['label'],
                html: () => (
                    <AIOButton
                        type='text'
                        value={name}
                        onChange={(name) => {
                            this.setState({ name })
                        }}
                        label='this is my label'
                    />
                ),
                code: `
<AIOButton
    type='text'
    value={name}
    onChange={(name) => {
        this.setState({ name })
    }}
    label='this is my label'
/>
                `
            },
            {
                type: 'text', props: ['justNumber'],
                html: () => (
                    <AIOButton
                        type='text'
                        value={name}
                        onChange={(name) => {
                            this.setState({ name })
                        }}
                        justNumber={true}
                    />
                ),
                code: `
<AIOButton
    type='text'
    value={name}
    onChange={(name) => {
        this.setState({ name })
    }}
    justNumber={true}
/>
                `
            },
            {
                type: 'text', props: ['filter'],
                html: () => (
                    <AIOButton
                        type='text'
                        value={name}
                        onChange={(name) => {
                            this.setState({ name })
                        }}
                        filter={[' ', '@']}
                    />
                ),
                code: `
<AIOButton
    type='text'
    value={name}
    onChange={(name) => {
        this.setState({ name })
    }}
    filter={[' ', '@']}
/>
                `
            },
            {
                type: 'text', props: ['options'],
                html: () => (
                    <AIOButton
                        type='text'
                        options={[{ text: 'moahmamd' }, { text: 'ali' }]}
                        value={name}
                        onChange={(name) => {
                            this.setState({ name })
                        }}
                    />
                ),
                code: `
<AIOButton
    type='text'
    options={[{ text: 'moahmamd' }, { text: 'ali' }]}
    value={name}
    onChange={(name) => {
        this.setState({ name })
    }}
/>
                `
            },
            {
                type: 'text', props: ['optionText'],
                html: () => (
                    <AIOButton
                        type='text'
                        options={['moahmamd', 'ali']}
                        optionText='option'
                        value={name}
                        onChange={(name) => {
                            this.setState({ name })
                        }}
                    />
                ),
                code: `
<AIOButton
    type='text'
    options={['moahmamd', 'ali']}
    optionText='option'
    value={name}
    onChange={(name) => {
        this.setState({ name })
    }}
/>
                `
            },
            {
                type: 'text', props: ['after'],
                html: () => (
                    <AIOButton
                        type='text'
                        value={name}
                        onChange={(name) => {
                            this.setState({ name })
                        }}
                        after={<Icon path={mdiMagnify} size={1} style={{ color: '#aaa' }} />}
                    />
                ),
                code: `
<AIOButton
    type='text'
    value={name}
    onChange={(name) => {
        this.setState({ name })
    }}
    after={<Icon path={mdiMagnify} size={1} style={{ color: '#aaa' }} />}
/>
                `
            },
            {
                type: 'text', props: ['before'],
                html: () => (
                    <AIOButton
                        type='number'
                        value={name}
                        onChange={(name) => {
                            this.setState({ name })
                        }}
                        before={<Icon path={mdiAccount} size={0.8} style={{ color: '#aaa' }} />}
                    />
                ),
                code: `
<AIOButton
    type='number'
    value={name}
    onChange={(name) => {
        this.setState({ name })
    }}
    before={<Icon path={mdiAccount} size={0.8} style={{ color: '#aaa' }} />}
/>
                `
            },
            //number
            {
                type: 'number', props: ['label'],
                html: () => (
                    <AIOButton
                        type='number'
                        value={age}
                        onChange={(age) => {
                            if (age > 40) { age = 40 }
                            this.setState({ age })
                        }}
                        label='this is my label'
                    />
                ),
                code: `
<AIOButton
    type='number'
    value={age}
    onChange={(age) => {
        if (age > 40) { age = 40 }
        this.setState({ age })
    }}
    label='this is my label'
/>
                `
            },
            {
                type: 'number', props: ['swip'],
                html: () => (
                    <AIOButton
                        type='number'
                        value={age}
                        onChange={(age) => {
                            if (age > 40) { age = 40 }
                            this.setState({ age })
                        }}
                        swip={true}
                    />
                ),
                code: `
<AIOButton
    type='number'
    value={age}
    onChange={(age) => {
        if (age > 40) { age = 40 }
        this.setState({ age })
    }}
    swip={true}
/>
                `
            },
            {
                type: 'number', props: ['spin'],
                html: () => (
                    <AIOButton
                        type='number'
                        value={age}
                        onChange={(age) => {
                            if (age > 40) { age = 40 }
                            this.setState({ age })
                        }}
                        spin={false}
                    />
                ),
                code: `
<AIOButton
    type='number'
    value={age}
    onChange={(age) => {
        if (age > 40) { age = 40 }
        this.setState({ age })
    }}
    spin={false}
/>
                `
            },
            {
                type: 'number', props: ['after'],
                html: () => (
                    <AIOButton
                        type='number'
                        value={age}
                        onChange={(age) => {
                            if (age > 40) { age = 40 }
                            this.setState({ age })
                        }}
                        after={<Icon path={mdiMagnify} size={1} style={{ color: '#aaa' }} />}
                    />
                ),
                code: `
<AIOButton
    type='number'
    value={age}
    onChange={(age) => {
        if (age > 40) { age = 40 }
        this.setState({ age })
    }}
    after={<Icon path={mdiMagnify} size={1} style={{ color: '#aaa' }} />}
/>
                `
            },
            {
                type: 'number', props: ['before'],
                html: () => (
                    <AIOButton
                        type='number'
                        value={age}
                        onChange={(age) => {
                            if (age > 40) { age = 40 }
                            this.setState({ age })
                        }}
                        before={<Icon path={mdiAccount} size={0.8} style={{ color: '#aaa' }} />}
                    />
                ),
                code: `
<AIOButton
    type='number'
    value={age}
    onChange={(age) => {
        if (age > 40) { age = 40 }
        this.setState({ age })
    }}
    before={<Icon path={mdiAccount} size={0.8} style={{ color: '#aaa' }} />}
/>
                `
            },
            //textarea
            {
                type: 'textarea', props: ['label'],
                html: () => (
                    <AIOButton
                        type='textarea'
                        value={desc}
                        onChange={(desc) => {
                            this.setState({ desc })
                        }}
                        label='this is my label'
                    />
                ),
                code: `
<AIOButton
    type='textarea'
    value={desc}
    onChange={(desc) => {
        this.setState({ desc })
    }}
    label='this is my label'
/>
                `
            },
            {
                type: 'textarea', props: ['autoHeight'],
                html: () => (
                    <AIOButton
                        type='textarea'
                        value={desc}
                        onChange={(desc) => {
                            this.setState({ desc })
                        }}
                        autoHeight={true}
                    />
                ),
                code: `
<AIOButton
    type='textarea'
    value={desc}
    onChange={(desc) => {
        this.setState({ desc })
    }}
    autoHeight={true}
/>
                `
            },
            {
                type: 'textarea', props: ['before'],
                html: () => (
                    <AIOButton
                        type='textarea'
                        value={desc}
                        onChange={(desc) => {
                            this.setState({ desc })
                        }}
                        before={<Icon path={mdiAccount} size={1} style={{ color: '#aaa' }} />}
                    />
                ),
                code: `
<AIOButton
    type='textarea'
    value={desc}
    onChange={(desc) => {
        this.setState({ desc })
    }}
    before={<Icon path={mdiAccount} size={1} style={{ color: '#aaa' }} />}
/>
                `
            },
            {
                type: 'textarea', props: ['after'],
                html: () => (
                    <AIOButton
                        type='textarea'
                        value={desc}
                        onChange={(desc) => {
                            this.setState({ desc })
                        }}
                        after={<Icon path={mdiMagnify} size={1} style={{ color: '#aaa' }} />}
                    />
                ),
                code: `
<AIOButton
    type='textarea'
    value={desc}
    onChange={(desc) => {
        this.setState({ desc })
    }}
    after={<Icon path={mdiMagnify} size={1} style={{ color: '#aaa' }} />}
/>
                `
            },
            //color
            {
                type:'color',props:['label'],
                html:()=>(
                    <AIOButton 
                        type='color' text='select color' value={color} 
                        onChange={(color)=>this.setState({color})}
                        className='dabs1'
                        label='this is my label'
                    />
                ),
                code:`
<AIOButton 
    type='color' text='select color' value={color} 
    onChange={(color)=>this.setState({color})}
/>
                `
            },
            //table
            {
                type:'table',props:['getValue'],
                html:()=>(
                    <AIOButton 
                        type='table'
                        columns={[
                            {template:'avatar',size:60},
                            {title:'Name',value:'row.firstname',size:100,cellAttrs:'cellAttrs'},
                            {title:'Family',value:'row.lastname',after:'after',before:'before',subtext:'this is your subtext'},
                            {title:'Age',value:'row.age',size:68,justify:true},
                            {title:'Salary',size:96,value:'row.salary',template:'salary'}
                        ]}
                        getValue={{
                            after:()=><Icon path={mdiAccount} size={.9}/>,
                            before:()=><Icon path={mdiAccount} size={.9}/>,
                            cellAttrs:(row)=>{
                                let style = {background:row.gender === 'male'?'lightblue':'pink'}
                                return {style}
                            },
                            salary:(row)=>{
                                return row.salary + ' $'
                            },
                            avatar:(row)=>{
                                let src;
                                if(row.gender === 'male'){
                                    src = 'https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg'
                                }
                                else if(row.gender === 'female'){
                                    src = 'https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png'
                                }
                                return (
                                    <img src={src} width={36} height={36} alt=''/>
                                )
                            }
                        }}
                        rows={[
                            {firstname:'john',lastname:'doe',age:18,gender:'male',salary:14000},
                            {firstname:'martin',lastname:'graham',age:26,gender:'male',salary:2500000},
                            {firstname:'alexa',lastname:'mills',age:32,gender:'female',salary:3600000},
                        ]}
                    />
                ),
                code:`
<AIOButton 
    type='table'
    columns={[
        {template:'avatar',size:60},
        {title:'Name',value:'row.firstname',size:100,cellAttrs:'cellAttrs'},
        {title:'Family',value:'row.lastname',after:'after',before:'before',subtext:'this is your subtext'},
        {title:'Age',value:'row.age',size:68,justify:true},
        {title:'Salary',size:96,value:'row.salary',template:'salary'}
    ]}
    getValue={{
        after:()=><Icon path={mdiAccount} size={.9}/>,
        before:()=><Icon path={mdiAccount} size={.9}/>,
        cellAttrs:(row)=>{
            let style = {background:row.gender === 'male'?'lightblue':'pink'}
            return {style}
        },
        salary:(row)=>{
            return row.salary + ' $'
        },
        avatar:(row)=>{
            let src;
            if(row.gender === 'male'){
                src = 'https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg'
            }
            else if(row.gender === 'female'){
                src = 'https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png'
            }
            return (
                <img src={src} width={36} height={36} alt=''/>
            )
        }
    }}
    rows={[
        {firstname:'john',lastname:'doe',age:18,gender:'male',salary:14000},
        {firstname:'martin',lastname:'graham',age:26,gender:'male',salary:2500000},
        {firstname:'alexa',lastname:'mills',age:32,gender:'female',salary:3600000},
    ]}
/>
                `
            },
            {
                type:'table',props:['columns','rows'],
                html:()=>(
                    <AIOButton 
                        type='table'
                        columns={[
                            {
                                template:(row)=><img src={row.avatar} width={36} height={36} alt=''/>,
                                size:60
                            },
                            {
                                title:'Name',value:'row.firstname',size:100,
                                cellAttrs:'{style:{background:row.gender === "male"?"lightblue":"pink"}}'
                            },
                            {
                                title:'Family',value:'row.lastname',
                                after:<Icon path={mdiAccount} size={.9}/>,
                                before:<Icon path={mdiAccount} size={.9}/>,
                                subtext:'this is your subtext'
                            },
                            {title:'Age',value:'row.age',size:68,justify:true},
                            {title:'Salary',size:96,value:'row.salary',template:'row.salary + " $"'}
                        ]}
                        rows={[
                            {
                                firstname:'john',lastname:'doe',age:18,gender:'male',salary:14000,
                                avatar:'https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg'
                            },
                            {
                                firstname:'martin',lastname:'graham',age:26,gender:'male',salary:2500000,
                                avatar:'https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg'
                            },
                            {
                                firstname:'alexa',lastname:'mills',age:32,gender:'female',salary:3600000,
                                avatar:'https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png'
                            },
                        ]}
                    />
                ),
                code:`
<AIOButton 
    type='table'
    columns={[
        {
            template:(row)=><img src={row.avatar} width={36} height={36} alt=''/>,
            size:60
        },
        {
            title:'Name',value:'row.firstname',size:100,
            cellAttrs:'{style:{background:row.gender === "male"?"lightblue":"pink"}}'
        },
        {
            title:'Family',value:'row.lastname',
            after:<Icon path={mdiAccount} size={.9}/>,
            before:<Icon path={mdiAccount} size={.9}/>,
            subtext:'this is your subtext'
        },
        {title:'Age',value:'row.age',size:68,justify:true},
        {title:'Salary',size:96,value:'row.salary',template:'row.salary + " $"'}
    ]}
    rows={[
        {
            firstname:'john',lastname:'doe',age:18,gender:'male',salary:14000,
            avatar:'https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg'
        },
        {
            firstname:'martin',lastname:'graham',age:26,gender:'male',salary:2500000,
            avatar:'https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg'
        },
        {
            firstname:'alexa',lastname:'mills',age:32,gender:'female',salary:3600000,
            avatar:'https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png'
        },
    ]}
/>
                `
            },
            {
                type:'table',props:['header'],
                html:()=>(
                    <AIOButton 
                        type='table'
                        header='this is my header'
                        columns={[
                            {title:'Name',value:'row.firstname',size:100},
                            {title:'Family',value:'row.lastname'},
                            {title:'Age',value:'row.age',size:68,justify:true,type:'number'},
                            {title:'Salary',size:96,value:'row.salary'}
                        ]}
                        rows={[
                            {firstname:'john',lastname:'doe',age:18,gender:'male',salary:14000},
                            {firstname:'martin',lastname:'graham',age:26,gender:'male',salary:2500000},
                            {firstname:'alexa',lastname:'mills',age:32,gender:'female',salary:3600000},
                        ]}
                    />
                ),
                code:`
<AIOButton 
    type='table'
    header='this is my header'
    columns={[
        {
            template:(row)=><img src={row.avatar} width={36} height={36} alt=''/>,
            size:60
        },
        {
            title:'Name',value:'row.firstname',size:100,
            cellAttrs:'{style:{background:row.gender === "male"?"lightblue":"pink"}}'
        },
        {
            title:'Family',value:'row.lastname',
            after:<Icon path={mdiAccount} size={.9}/>,
            before:<Icon path={mdiAccount} size={.9}/>,
            subtext:'this is your subtext'
        },
        {title:'Age',value:'row.age',size:68,justify:true},
        {title:'Salary',size:96,value:'row.salary',template:'row.salary + " $"'}
    ]}
    rows={[
        {
            firstname:'john',lastname:'doe',age:18,gender:'male',salary:14000,
            avatar:'https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg'
        },
        {
            firstname:'martin',lastname:'graham',age:26,gender:'male',salary:2500000,
            avatar:'https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg'
        },
        {
            firstname:'alexa',lastname:'mills',age:32,gender:'female',salary:3600000,
            avatar:'https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png'
        },
    ]}
/>
                `
            },
            {
                type:'table',props:['add'],
                html:()=>(
                    <AIOButton 
                        type='table'
                        add={{firstname:'',lastname:'',age:'',gender:'',salary:''}}
                        columns={[
                            {title:'Name',value:'row.firstname',size:100},
                            {title:'Family',value:'row.lastname'},
                            {title:'Age',value:'row.age',size:68,justify:true,type:'number'},
                            {title:'Salary',size:96,value:'row.salary'}
                        ]}
                        rows={rows}
                        onChange={(rows)=>this.setState({rows})}
                    />
                ),
                code:`
<AIOButton 
    type='table'
    add={{firstname:'',lastname:'',age:'',gender:'',salary:''}}
    columns={[
        {title:'Name',value:'row.firstname',size:100},
        {title:'Family',value:'row.lastname'},
        {title:'Age',value:'row.age',size:68,justify:true,type:'number'},
        {title:'Salary',size:96,value:'row.salary'}
    ]}
    rows={rows}
    onChange={(rows)=>this.setState({rows})}
/>
                `
            },
            {
                type:'table',props:['add'],
                html:()=>(
                    <AIOButton 
                        type='table'
                        add={()=>{
                            let newRows = [{firstname:'',lastname:'',age:'',gender:'',salary:''},...rows];
                            this.setState({rows:newRows})
                        }}
                        columns={[
                            {title:'Name',value:'row.firstname',size:100},
                            {title:'Family',value:'row.lastname'},
                            {title:'Age',value:'row.age',size:68,justify:true,type:'number'},
                            {title:'Salary',size:96,value:'row.salary'}
                        ]}
                        rows={rows}
                        onChange={(rows)=>this.setState({rows})}
                    />
                ),
                code:`
<AIOButton 
    type='table'
    add={()=>{
        let newRows = [{firstname:'',lastname:'',age:'',gender:'',salary:''},...rows];
        this.setState({rows:newRows})
    }}
    columns={[
        {title:'Name',value:'row.firstname',size:100},
        {title:'Family',value:'row.lastname'},
        {title:'Age',value:'row.age',size:68,justify:true,type:'number'},
        {title:'Salary',size:96,value:'row.salary'}
    ]}
    rows={rows}
    onChange={(rows)=>this.setState({rows})}
/>
                `
            },
            {
                type:'table',props:['header','columns','rows','add','remove'],
                html:()=>(
                    <AIOButton 
                        type='table'
                        add={()=>{
                            let newRows = [{firstname:'',lastname:'',age:'',gender:'',salary:''},...rows];
                            this.setState({rows:newRows})
                        }}
                        remove={true}
                        header='this is my header'
                        columns={[
                            {title:'Name',value:'row.firstname',size:100},
                            {title:'Family',value:'row.lastname'},
                            {title:'Age',value:'row.age',size:68,justify:true,type:'number'},
                            {title:'Salary',size:96,value:'row.salary'}
                        ]}
                        rows={rows}
                        onChange={(rows)=>this.setState({rows})}
                    />
                ),
                code:`
<AIOButton 
    type='table'
    add={()=>{
        let newRows = [{firstname:'',lastname:'',age:'',gender:'',salary:''},...rows];
        this.setState({rows:newRows})
    }}
    header='this is my header'
    columns={[
        {title:'Name',value:'row.firstname',size:100},
        {title:'Family',value:'row.lastname'},
        {title:'Age',value:'row.age',size:68,justify:true,type:'number'},
        {title:'Salary',size:96,value:'row.salary'}
    ]}
    rows={rows}
    onChange={(rows)=>this.setState({rows})}
/>
                `
            },
            {
                type:'table',props:['header','columns','rows','add','remove'],
                html:()=>(
                    <AIOButton 
                        type='table'
                        add={()=>{
                            let newRows = [{firstname:'',lastname:'',age:'',gender:'',salary:''},...rows];
                            this.setState({rows:newRows})
                        }}
                        remove={(row)=>{
                            this.setState({rows:rows.filter((o)=>o.id !== row.id)})
                        }}
                        header='this is my header'
                        columns={[
                            {title:'Name',value:'row.firstname',size:100},
                            {title:'Family',value:'row.lastname'},
                            {title:'Age',value:'row.age',size:68,justify:true,type:'number'},
                            {title:'Salary',size:96,value:'row.salary'}
                        ]}
                        rows={rows}
                        onChange={(rows)=>this.setState({rows})}
                    />
                ),
                code:`
<AIOButton 
    type='table'
    add={()=>{
        let newRows = [{firstname:'',lastname:'',age:'',gender:'',salary:''},...rows];
        this.setState({rows:newRows})
    }}
    header='this is my header'
    columns={[
        {title:'Name',value:'row.firstname',size:100},
        {title:'Family',value:'row.lastname'},
        {title:'Age',value:'row.age',size:68,justify:true,type:'number'},
        {title:'Salary',size:96,value:'row.salary'}
    ]}
    rows={rows}
    onChange={(rows)=>this.setState({rows})}
/>
                `
            }
        ]
        return (
            <div style={{ position: 'fixed', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '90px auto',
                    background: 'lightblue',
                    padding: 12,
                    boxSizing: 'border-box'
                }}>
                    <div>input type</div>
                    <AIOButton
                        type='select' multiple={true} value={show.type}
                        options={show.types}
                        optionText='option' optionValue='option'
                        onChange={(value) => { this.changeControl('type',value) }}
                    />
                    <div>input props</div>
                    <AIOButton
                        type='select' multiple={true} value={show.prop}
                        options={show.props}
                        optionText='option' optionValue='option'
                        onChange={(value) => { this.changeControl('prop',value) }}
                    />
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
                    {
                        ex.map(({ type, props, html, code }) => {
                            if(type !== show.type){return ''}
                            if(show.prop !== 'all' && props.indexOf(show.prop) === -1){return ''}
                            return (
                                <>
                                    {Titr(`${type} (${props.toString()} props)`)}
                                    {html()}
                                    {Code(code)}
                                </>
                            )
                        })
                    }








                </div>
            </div>

        )
    }
}





