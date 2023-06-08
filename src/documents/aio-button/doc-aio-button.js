import React, { Component } from "react";
import DOC from './../../resuse-components/doc';
import AIOButton from './../../npm/aio-button/aio-button';
import { Icon } from '@mdi/react';
import { mdiAccount, mdiAccountBox, mdiAttachment, mdiMagnify, mdiCodeJson, mdiFile, mdiLanguageCss3, mdiLanguageHtml5 } from '@mdi/js';
import AIODoc from './../../npm/aio-documentation/aio-documentation';
export default class DOC_AIOButton extends Component {
    state = {
        files: [],
        gender: 'female',
        skills: [],
        tab: '0',
        option: '1',
        options: [],
        active: false,
        name: '',
        list: [],
        age: '',
        desc:'',
        list2:[]
    }
    render() {
        let { files, gender, skills, tab, option, options, active, name, list, age,desc,list2 } = this.state
        let { Titr, Code } = AIODoc();
        return (
            <div className='example'>
                {Titr('button')}
                <AIOButton
                    type='button'
                    text='click here'
                    onClick={() => alert()}
                />
                {Code(`
<AIOButton
    type='button'
    text='click here'
    onClick={()=>alert()}
/>
                `)}
                {Titr('file')}
                <AIOButton
                    type='file'
                    text='select file'
                    value={files}
                    onChange={(files) => {
                        this.setState({ files })
                    }}
                    onAdd={(filesToAdd) => {
                        return true
                    }}
                    onRemove={(filename) => {
                        return true
                    }}
                />
                {Code(`
<AIOButton
    type='file'
    text='select file'
    value={files}
    onChange={(files)=>{
        this.setState({files})
    }}
    onAdd={(filesToAdd)=>{
        return true
    }}
    onRemove={(filename)=>{
        return true
    }}
/>
                `)}
                {Titr('select')}
                <AIOButton
                    type='select'
                    value={gender}
                    options={[
                        { text: 'not selected', value: null },
                        { text: 'Male', value: 'male' },
                        { text: 'Female', value: 'female' }
                    ]}
                    onChange={(gender) => {
                        this.setState({ gender })
                    }}
                />
                {Code(`
<AIOButton
    type='select'
    value={gender}
    options={[
        {text:'not selected',value:null},
        {text:'Male',value:'male'},
        {text:'Female',value:'female'}
    ]}
    onChange={(gender)=>{
        this.setState({gender})
    }}
/>
                `)}
                {Titr('multiselect')}
                <AIOButton
                    type='multiselect'
                    text='skills'
                    value={skills}
                    options={[
                        { text: 'JS', value: 'js' },
                        { text: 'CSS', value: 'css' },
                        { text: 'HTML', value: 'html' }
                    ]}
                    onChange={(skills) => {
                        this.setState({ skills })
                    }}
                />
                {Code(`
<AIOButton
    type='multiselect'
    value={skills}
    options={[
        {text:'JS',value:'js'},
        {text:'CSS',value:'css'},
        {text:'HTML',value:'html'}
    ]}
    onChange={(skills)=>{
        this.setState({skills})
    }}
/>
                `)}
                {Titr('tabs')}
                <AIOButton
                    type='tabs'
                    value={tab}
                    options={[
                        { text: 'Page1', value: '0' },
                        { text: 'Page2', value: '1' },
                        { text: 'Page3', value: '2' }
                    ]}
                    onChange={(tab) => {
                        this.setState({ tab })
                    }}
                />
                {Code(`
<AIOButton
    type='tabs'
    value={tab}
    options={[
        {text:'Page1',value:'0'},
        {text:'Page2',value:'1'},
        {text:'Page3',value:'2'}
    ]}
    onChange={(tab)=>{
        this.setState({tab})
    }}
/>
                `)}
                {Titr('radio')}
                <AIOButton
                    type='radio'
                    value={option}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                />
                {Code(`
<AIOButton
    type='radio'
    value={option}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    onChange={(option)=>{
        this.setState({option})
    }}
/>
                `)}
                {Titr('radio(checklist)')}
                <AIOButton
                    type='radio'
                    multiple={true}
                    value={options}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    onChange={(options) => {
                        this.setState({ options })
                    }}
                />
                {Code(`
<AIOButton
    type='radio'
    multiple={true}
    value={options}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    onChange={(options)=>{
        this.setState({options})
    }}
/>
                `)}
                {Titr('checkbox')}
                <AIOButton
                    text='Is Active'
                    type='checkbox'
                    value={active}
                    onChange={(active) => {
                        this.setState({ active: !active })
                    }}
                />
                {Code(`
<AIOButton
    text='Is Active'
    type='checkbox'
    value={active}
    onChange={(active)=>{
        this.setState({active:!active})
    }}
/>
                `)}
                {Titr('text')}
                <AIOButton
                    type='text'
                    value={name}
                    onChange={(name) => {
                        this.setState({ name })
                    }}
                />
                {Code(`
<AIOButton
    type='text'
    value={name}
    onChange={(name)=>{
        this.setState({name})
    }}
/>
                `)}
                <h5>text (label props)</h5>
                <AIOButton
                    type='text'
                    value={name}
                    onChange={(name) => {
                        this.setState({ name })
                    }}
                    label='this is my label'
                />
                {Code(`
<AIOButton
    type='text'
    value={name}
    onChange={(name)=>{
        this.setState({name})
    }}
    label='this is my label'
/>
                `)}
                <h5>text (justNumber props)</h5>
                <AIOButton
                    type='text'
                    value={name}
                    onChange={(name) => {
                        this.setState({ name })
                    }}
                    justNumber={true}
                />
                {Code(`
<AIOButton
    type='text'
    value={name}
    onChange={(name)=>{
        this.setState({name})
    }}
    justNumber={true}
/>
                `)}
                <h5>text (filter props)</h5>
                <h6>cannot type ' ' or '@'</h6>
                <AIOButton
                    type='text'
                    value={name}
                    onChange={(name) => {
                        this.setState({ name })
                    }}
                    filter={[' ', '@']}
                />
                {Code(`
<Input
    type='text'
    value={name}
    onChange={(name)=>{
        this.setState({name})
    }}
    filter={[' ','@']}
/>
                `)}
                <h5>text (list props)</h5>
                <AIOButton
                    type='text'
                    onAdd={(text) => {
                        this.setState({ list: [text, ...list] })
                    }}
                    onRemove={(text, index) => {
                        this.setState({ list: list.filter((o) => o !== text) })
                    }}
                    list={list}
                />
                {Code(`
<AIOButton
    type='text'
    onAdd={(text)=>{
        this.setState({list:[text,...list]})
    }}
    onRemove={(text,index)=>{
        this.setState({list:list.filter((o)=>o !== text)})
    }}
    list={list}
/>
                `)}
                <h5>text (options props)</h5>
                <AIOButton
                    type='text'
                    options={[{ text: 'moahmamd' }, { text: 'ali' }]}
                    value={name}
                    onChange={(name) => {
                        this.setState({ name })
                    }}
                />
                {Code(`
<AIOButton
    type='text'
    options={['moahmamd','ali']}
    optionText='option'
    value={name}
    onChange={(name)=>{
        this.setState({name})
    }}
/>
                `)}
                <h5>text (optionText props)</h5>
                <AIOButton
                    type='text'
                    options={['moahmamd', 'ali']}
                    optionText='option'
                    value={name}
                    onChange={(name) => {
                        this.setState({ name })
                    }}
                />
                {Code(`
<AIOButton
    type='text'
    options={['moahmamd','ali']}
    optionText='option'
    value={name}
    onChange={(name)=>{
        this.setState({name})
    }}
/>
                `)}
                <h5>text (after props)</h5>
                <AIOButton
                    type='text'
                    value={name}
                    onChange={(name) => {
                        this.setState({ name })
                    }}
                    after={<Icon path={mdiMagnify} size={1} style={{ color: '#aaa' }} />}
                />
                {Code(`
<AIOButton
    type='text'
    value={name}
    onChange={(name) => {
        this.setState({ name })
    }}
    after={<Icon path={mdiMagnify} size={1} style={{ color: '#aaa' }} />}
/>
                `)}
                <h5>text (before props)</h5>
                <AIOButton
                    type='number'
                    value={name}
                    onChange={(name) => {
                        this.setState({ name })
                    }}
                    before={<Icon path={mdiAccount} size={0.8} style={{ color: '#aaa' }} />}
                />
                {Code(`
<AIOButton
    type='number'
    label='input type Number(before)'
    value={name}
    onChange={(name) => {
        this.setState({ name })
    }}
    before={<Icon path={mdiAccount} size={0.8} style={{ color: '#aaa' }} />}
/>
                `)}
                {Titr('number')}
                <AIOButton
                    type='number'
                    value={age}
                    onChange={(age) => {
                        if (age > 40) { age = 40 }
                        this.setState({ age })
                    }}
                />
                {Code(`
<AIOButton
    type='number'
    value={age}
    onChange={(age) => {
        if (age > 40) { age = 40 }
        this.setState({ age })
    }}
/>
                `)}
                <h5>number (label props)</h5>
                <AIOButton
                    type='number'
                    value={age}
                    onChange={(age) => {
                        if (age > 40) { age = 40 }
                        this.setState({ age })
                    }}
                    label='this is my label'
                />
                {Code(`
<AIOButton
    type='number'
    value={age}
    onChange={(age) => {
        if (age > 40) { age = 40 }
        this.setState({ age })
    }}
    label='this is my label'
/>
                `)}
                <h5>number (swip props)</h5>
                <AIOButton
                    type='number'
                    value={age}
                    onChange={(age) => {
                        if (age > 40) { age = 40 }
                        this.setState({ age })
                    }}
                    swip={true}
                />
                {Code(`
<AIOButton
    type='number'
    value={age}
    onChange={(age) => {
        if (age > 40) { age = 40 }
        this.setState({ age })
    }}
    swip={true}
/>
                `)}
                <h5>number (spin props)</h5>
                <AIOButton
                    type='number'
                    value={age}
                    onChange={(age) => {
                        if (age > 40) { age = 40 }
                        this.setState({ age })
                    }}
                    spin={false}
                />
                {Code(`
<AIOButton
    type='number'
    value={age}
    onChange={(age) => {
        if (age > 40) { age = 40 }
        this.setState({ age })
    }}
    spin={false}
/>
                `)}
                <h5>number (after props)</h5>
                <AIOButton
                    type='number'
                    value={age}
                    onChange={(age) => {
                        if (age > 40) { age = 40 }
                        this.setState({ age })
                    }}
                    after={<Icon path={mdiMagnify} size={1} style={{ color: '#aaa' }} />}
                />
                {Code(`
<AIOButton
    type='number'
    value={age}
    onChange={(age) => {
        if (age > 40) { age = 40 }
        this.setState({ age })
    }}
    after={<Icon path={mdiMagnify} size={1} style={{ color: '#aaa' }} />}
/>
                `)}
                <h5>number (before props)</h5>
                <AIOButton
                    type='number'
                    value={age}
                    onChange={(age) => {
                        if (age > 40) { age = 40 }
                        this.setState({ age })
                    }}
                    before={<Icon path={mdiAccount} size={0.8} style={{ color: '#aaa' }} />}
                />
                {Code(`
<AIOButton
    type='number'
    value={age}
    onChange={(age) => {
        if (age > 40) { age = 40 }
        this.setState({ age })
    }}
    before={<Icon path={mdiAccount} size={0.8} style={{ color: '#aaa' }} />}
/>
                `)}
                {Titr('textarea')}
                <AIOButton
                    type='textarea'
                    value={desc}
                    onChange={(desc) => {
                        this.setState({ desc })
                    }}
                />
                {Code(`
<AIOButton
    type='textarea'
    value={desc}
    onChange={(desc) => {
        this.setState({ desc })
    }}
/>
                `)}
                <h5>textarea (label props)</h5>
                <AIOButton
                    type='textarea'
                    value={desc}
                    onChange={(desc) => {
                        this.setState({ desc })
                    }}
                    label='this is my label'
                />
                {Code(`
<AIOButton
    type='textarea'
    value={desc}
    onChange={(desc) => {
        this.setState({ desc })
    }}
    label='this is my label'
/>
                `)}
                <h5>textarea (autoHeight props)</h5>
                <AIOButton
                    type='textarea'
                    value={desc}
                    onChange={(desc) => {
                        this.setState({ desc })
                    }}
                    autoHeight={true}
                />
                {Code(`
<AIOButton
    type='textarea'
    value={desc}
    onChange={(desc) => {
        this.setState({ desc })
    }}
    autoHeight={true}
/>
                `)}
                <h5>textarea (before props)</h5>
                <AIOButton
                    type='textarea'
                    value={desc}
                    onChange={(desc) => {
                        this.setState({ desc })
                    }}
                    before={<Icon path={mdiAccount} size={1} style={{ color: '#aaa' }} />}
                />
                {Code(`
<AIOButton
    type='textarea'
    value={desc}
    onChange={(desc) => {
        this.setState({ desc })
    }}
    before={<Icon path={mdiAccount} size={1} style={{ color: '#aaa' }} />}
/>
                `)}
                <h5>textarea (after props)</h5>
                <AIOButton
                    type='textarea'
                    value={desc}
                    onChange={(desc) => {
                        this.setState({ desc })
                    }}
                    after={<Icon path={mdiMagnify} size={1} style={{ color: '#aaa' }} />}
                />
                {Code(`
<AIOButton
    type='textarea'
    value={desc}
    onChange={(desc) => {
        this.setState({ desc })
    }}
    after={<Icon path={mdiMagnify} size={1} style={{ color: '#aaa' }} />}
/>
                `)}
                {Titr('list')}
                <AIOButton 
                    type='list'
                    columns={[
                        {title:'Name',field:'firstname',size:100},
                        {title:'Family',field:'lastname'},
                    ]}
                    list={list2}
                    onChange={(list2)=>this.setState({list2})}
                />
                {Code(`
<AIOButton 
    type='list'
    columns={[
        {title:'Name',field:'firstname',size:100},
        {title:'Family',field:'lastname'},
    ]}
    list={list2}
    onChange={(list2)=>this.setState({list2})}
/>
                `)}
                {Titr('before props')}
                <h5>button</h5>
                <AIOButton
                    type='button'
                    text='click here'
                    onClick={() => alert()}
                    before={<Icon path={mdiAccount} size={0.8} />}
                />
                <h5>file</h5>
                <AIOButton
                    type='file'
                    text='select file'
                    value={files}
                    onChange={(files) => {
                        this.setState({ files })
                    }}
                    onAdd={(filesToAdd) => {
                        return true
                    }}
                    onRemove={(filename) => {
                        return true
                    }}
                    before={<Icon path={mdiAccount} size={0.8} />}
                />
                <h5>select</h5>
                <AIOButton
                    type='select'
                    value={gender}
                    options={[
                        { text: 'not selected', value: null },
                        { text: 'Male', value: 'male' },
                        { text: 'Female', value: 'female' }
                    ]}
                    onChange={(gender) => {
                        this.setState({ gender })
                    }}
                    before={<Icon path={mdiAccount} size={0.8} />}
                />
                <h5>multiselect</h5>
                <AIOButton
                    type='multiselect'
                    text='skills'
                    value={skills}
                    options={[
                        { text: 'JS', value: 'js' },
                        { text: 'CSS', value: 'css' },
                        { text: 'HTML', value: 'html' }
                    ]}
                    onChange={(skills) => {
                        this.setState({ skills })
                    }}
                    before={<Icon path={mdiAccount} size={0.8} />}
                />
                <h5>tabs</h5>
                <AIOButton
                    type='tabs'
                    value={tab}
                    options={[
                        { text: 'Page1', value: '0' },
                        { text: 'Page2', value: '1' },
                        { text: 'Page3', value: '2' }
                    ]}
                    onChange={(tab) => {
                        this.setState({ tab })
                    }}
                    before={<Icon path={mdiAccount} size={0.8} />}
                />
                <h5>checkbox</h5>
                <AIOButton
                    text='Is Active'
                    type='checkbox'
                    value={active}
                    onChange={(active) => {
                        this.setState({ active: !active })
                    }}
                    before={<Icon path={mdiAccount} size={0.8} />}
                />
                <h5>radio</h5>
                <div style={{ color: 'red' }}>not allowed</div>
                {Code(`
<AIOButton
    ...
    before={<Icon path={mdiAccount} size={0.8}/>}
    ...
/>
                `)}
                {Titr('after props')}
                <h5>button</h5>
                <AIOButton
                    type='button'
                    text='click here'
                    onClick={() => alert()}
                    after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
                />
                <h5>file</h5>
                <AIOButton
                    type='file'
                    text='select file'
                    value={files}
                    onChange={(files) => {
                        this.setState({ files })
                    }}
                    onAdd={(filesToAdd) => {
                        return true
                    }}
                    onRemove={(filename) => {
                        return true
                    }}
                    after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
                />
                <h5>select</h5>
                <AIOButton
                    type='select'
                    value={gender}
                    options={[
                        { text: 'not selected', value: null },
                        { text: 'Male', value: 'male' },
                        { text: 'Female', value: 'female' }
                    ]}
                    onChange={(gender) => {
                        this.setState({ gender })
                    }}
                    after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
                />
                <h5>multiselect</h5>
                <AIOButton
                    type='multiselect'
                    text='skills'
                    value={skills}
                    options={[
                        { text: 'JS', value: 'js' },
                        { text: 'CSS', value: 'css' },
                        { text: 'HTML', value: 'html' }
                    ]}
                    onChange={(skills) => {
                        this.setState({ skills })
                    }}
                    after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
                />
                <h5>tabs</h5>
                <AIOButton
                    type='tabs'
                    value={tab}
                    options={[
                        { text: 'Page1', value: '0' },
                        { text: 'Page2', value: '1' },
                        { text: 'Page3', value: '2' }
                    ]}
                    onChange={(tab) => {
                        this.setState({ tab })
                    }}
                    after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
                />
                <h5>checkbox</h5>
                <AIOButton
                    text='Is Active'
                    type='checkbox'
                    value={active}
                    onChange={(active) => {
                        this.setState({ active: !active })
                    }}
                    after={<div style={{ background: 'dodgerblue', color: '#fff', padding: '0 6px', borderRadius: '100%' }}>5</div>}
                />
                <h5>radio</h5>
                <div style={{ color: 'red' }}>not allowed</div>
                {Code(`
<AIOButton
    ...
    after={<Icon path={mdiAccount} size={0.8}/>}
    ...
/>
                `)}
                {Titr('style props')}
                <h5>button</h5>
                <AIOButton
                    type='button'
                    text='click here'
                    onClick={() => alert()}
                    style={{ background: 'lightblue' }}
                />
                <h5>file</h5>
                <AIOButton
                    type='file'
                    text='select file'
                    value={files}
                    onChange={(files) => {
                        this.setState({ files })
                    }}
                    onAdd={(filesToAdd) => {
                        return true
                    }}
                    onRemove={(filename) => {
                        return true
                    }}
                    style={{ background: 'lightblue' }}
                />
                <h5>select</h5>
                <AIOButton
                    type='select'
                    value={gender}
                    options={[
                        { text: 'not selected', value: null },
                        { text: 'Male', value: 'male' },
                        { text: 'Female', value: 'female' }
                    ]}
                    onChange={(gender) => {
                        this.setState({ gender })
                    }}
                    style={{ background: 'lightblue' }}
                />
                <h5>multiselect</h5>
                <AIOButton
                    type='multiselect'
                    text='skills'
                    value={skills}
                    options={[
                        { text: 'JS', value: 'js' },
                        { text: 'CSS', value: 'css' },
                        { text: 'HTML', value: 'html' }
                    ]}
                    onChange={(skills) => {
                        this.setState({ skills })
                    }}
                    style={{ background: 'lightblue' }}
                />
                <h5>tabs</h5>
                <AIOButton
                    type='tabs'
                    value={tab}
                    options={[
                        { text: 'Page1', value: '0' },
                        { text: 'Page2', value: '1' },
                        { text: 'Page3', value: '2' }
                    ]}
                    onChange={(tab) => {
                        this.setState({ tab })
                    }}
                    style={{ background: 'lightblue' }}
                />
                <h5>checkbox</h5>
                <AIOButton
                    text='Is Active'
                    type='checkbox'
                    value={active}
                    onChange={(active) => {
                        this.setState({ active: !active })
                    }}
                    style={{ background: 'lightblue' }}
                />
                <h5>radio</h5>
                <AIOButton
                    type='radio'
                    value={option}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    style={{ background: 'lightblue' }}
                />
                {Code(`
<AIOButton
    ...
    style={{background:'lightblue'}}
    ...
/>
                `)}
                {Titr('className props')}
                {Code(`
<AIOButton
    ...
    className='example-1'
    ...
/>
                `)}
                {Titr('disabled props')}
                <h5>button</h5>
                <AIOButton
                    type='button'
                    text='click here'
                    onClick={() => alert()}
                    disabled={true}
                />
                <h5>file</h5>
                <AIOButton
                    type='file'
                    text='select file'
                    value={files}
                    onChange={(files) => {
                        this.setState({ files })
                    }}
                    onAdd={(filesToAdd) => {
                        return true
                    }}
                    onRemove={(filename) => {
                        return true
                    }}
                    disabled={true}
                />
                <h5>select</h5>
                <AIOButton
                    type='select'
                    value={gender}
                    options={[
                        { text: 'not selected', value: null },
                        { text: 'Male', value: 'male' },
                        { text: 'Female', value: 'female' }
                    ]}
                    onChange={(gender) => {
                        this.setState({ gender })
                    }}
                    disabled={true}
                />
                <h5>multiselect</h5>
                <AIOButton
                    type='multiselect'
                    text='skills'
                    value={skills}
                    options={[
                        { text: 'JS', value: 'js' },
                        { text: 'CSS', value: 'css' },
                        { text: 'HTML', value: 'html' }
                    ]}
                    onChange={(skills) => {
                        this.setState({ skills })
                    }}
                    disabled={true}
                />
                <h5>tabs</h5>
                <AIOButton
                    type='tabs'
                    value={tab}
                    options={[
                        { text: 'Page1', value: '0' },
                        { text: 'Page2', value: '1' },
                        { text: 'Page3', value: '2' }
                    ]}
                    onChange={(tab) => {
                        this.setState({ tab })
                    }}
                    disabled={true}
                />
                <h5>checkbox</h5>
                <AIOButton
                    text='Is Active'
                    type='checkbox'
                    value={active}
                    onChange={(active) => {
                        this.setState({ active: !active })
                    }}
                    disabled={true}
                />
                <h5>radio</h5>
                <AIOButton
                    type='radio'
                    value={option}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    disabled={true}
                />
                {Code(`
<AIOButton
    ...
    disabled={true}
    ...
/>
                `)}
                {Titr('optionText,optionValue props')}
                <h5>select</h5>
                <AIOButton
                    type='select'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    options={['0', '1', '2']}
                    optionText='"option " + option'
                    optionValue='option'
                />
                {Code(`
<AIOButton
    type='select'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={['0','1','2']}
    optionText='"option " + option'
    optionValue='option'
/>
                `)}
                <h5>multiselect</h5>
                <AIOButton
                    type='multiselect'
                    text='skills'
                    value={skills}
                    onChange={(skills) => {
                        this.setState({ skills })
                    }}
                    options={['js', 'css', 'html']}
                    optionText='option.toUpperCase()'
                    optionValue='option'
                />
                {Code(`
<AIOButton
    type='multiselect'
    text='skills'
    value={skills}
    onChange={(skills)=>{
        this.setState({skills})
    }}
    options={['js','css','html']}
    optionText='option.toUpperCase()'
    optionValue='option'
/>
                `)}
                <h5>tabs</h5>
                <AIOButton
                    type='tabs'
                    value={tab}
                    onChange={(tab) => {
                        this.setState({ tab })
                    }}
                    options={['0', '1', '2']}
                    optionText='"Page" + (parseInt(option) + 1)'
                    optionValue='option'
                />
                {Code(`
<AIOButton
    type='tabs'
    value={tab}
    onChange={(tab)=>{
        this.setState({tab})
    }}
    options={['0','1','2']}
    optionText='"Page" + (parseInt(option) + 1)'
    optionValue='option'
/>
                `)}
                <h5>radio</h5>
                <AIOButton
                    type='radio'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    options={['0', '1', '2']}
                    optionText='"Option" + (parseInt(option) + 1)'
                    optionValue='option'
                />
                {Code(`
<AIOButton
    type='radio'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={['0','1','2']}
    optionText='"Option" + (parseInt(option) + 1)'
    optionValue='option'
/>
                `)}
                {Titr('optionBefore props')}
                <h5>select</h5>
                <AIOButton
                    type='select'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    optionBefore={<Icon path={mdiAccount} size={0.8} />}
                />
                {Code(`
<AIOButton
    type='select'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    optionBefore={<Icon path={mdiAccount} size={0.8}/>}
/>
                `)}
                <AIOButton
                    type='select'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
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
                {Code(`
<AIOButton
    type='select'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    optionBefore={(option)=>{
        return {
            '0':<Icon path={mdiAccount} size={0.8}/>,
            '1':<Icon path={mdiAttachment} size={0.8}/>,
            '2':<Icon path={mdiFile} size={0.8}/>
        }[option.value]
    }}
/>
                `)}
                <h5>multiselect</h5>
                <AIOButton
                    type='multiselect'
                    text='skills'
                    value={skills}
                    onChange={(skills) => {
                        this.setState({ skills })
                    }}
                    options={[
                        { text: 'JS', value: 'js' },
                        { text: 'CSS', value: 'css' },
                        { text: 'HTML', value: 'html' }
                    ]}
                    optionBefore={<Icon path={mdiCodeJson} size={0.8} />}
                />
                {Code(`
<AIOButton
    type='multiselect'
    text='skills'
    value={skills}
    onChange={(skills)=>{
        this.setState({skills})
    }}
    options={[
        {text:'JS',value:'js'},
        {text:'CSS',value:'css'},
        {text:'HTML',value:'html'}
    ]}
    optionBefore={<Icon path={mdiCodeJson} size={0.8}/>}
/>
                `)}
                <AIOButton
                    type='multiselect'
                    text='skills'
                    value={skills}
                    onChange={(skills) => {
                        this.setState({ skills })
                    }}
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
                {Code(`
<AIOButton
    type='multiselect'
    text='skills'
    value={skills}
    onChange={(skills)=>{
        this.setState({skills})
    }}
    options={[
        {text:'JS',value:'js'},
        {text:'CSS',value:'css'},
        {text:'HTML',value:'html'}
    ]}
    optionBefore={(option)=>{
        return {
            'js':<Icon path={mdiCodeJson} size={0.8}/>,
            'css':<Icon path={mdiLanguageCss3} size={0.8}/>,
            'html':<Icon path={mdiLanguageHtml5} size={0.8}/>
        }[option.value]
    }}
/>
                `)}
                <h5>tabs</h5>
                <AIOButton
                    type='tabs'
                    value={tab}
                    onChange={(tab) => {
                        this.setState({ tab })
                    }}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    optionBefore={<Icon path={mdiAccount} size={0.8} />}
                />
                {Code(`
<AIOButton
    type='tabs'
    value={tab}
    onChange={(tab)=>{
        this.setState({tab})
    }}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    optionBefore={<Icon path={mdiAccount} size={0.8}/>}
/>
                `)}
                <AIOButton
                    type='tabs'
                    value={tab}
                    onChange={(tab) => {
                        this.setState({ tab })
                    }}
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
                {Code(`
<AIOButton
    type='tabs'
    value={tab}
    onChange={(tab)=>{
        this.setState({tab})
    }}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    optionBefore={(option)=>{
        return {
            '0':<Icon path={mdiAccount} size={0.8}/>,
            '1':<Icon path={mdiAttachment} size={0.8}/>,
            '2':<Icon path={mdiFile} size={0.8}/>
        }[option.value]
    }}
/>
                `)}
                <h5>radio</h5>
                <AIOButton
                    type='radio'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    optionBefore={<Icon path={mdiAccount} size={0.8} />}
                />
                {Code(`
<AIOButton
    type='radio'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    optionBefore={<Icon path={mdiAccount} size={0.8}/>}
/>
                `)}
                <AIOButton
                    type='radio'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
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
                {Code(`
<AIOButton
    type='radio'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    optionBefore={(option)=>{
        return {
            '0':<Icon path={mdiAccount} size={0.8}/>,
            '1':<Icon path={mdiAttachment} size={0.8}/>,
            '2':<Icon path={mdiFile} size={0.8}/>
        }[option.value]
    }}
/>
                `)}
                {Titr('optionAfter props')}
                <h5>select</h5>
                <AIOButton
                    type='select'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    optionAfter={<Icon path={mdiAccount} size={0.8} />}
                />
                {Code(`
<AIOButton
    type='select'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    optionAfter={<Icon path={mdiAccount} size={0.8}/>}
/>
                `)}
                <AIOButton
                    type='select'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
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
                {Code(`
<AIOButton
    type='select'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0',amount:23},
        {text:'Option2',value:'1',amount:12},
        {text:'Option3',value:'2',amount:5}
    ]}
    optionAfter={(option)=>{
        return (
            <div 
                style={{background:'dodgerblue',color:'#fff',padding:'0 6px',borderRadius:24}}
            >{option.amount}</div>
        )
    }}
/>
                `)}
                <h5>multiselect</h5>
                <AIOButton
                    type='multiselect'
                    text='skills'
                    value={skills}
                    onChange={(skills) => {
                        this.setState({ skills })
                    }}
                    options={[
                        { text: 'JS', value: 'js' },
                        { text: 'CSS', value: 'css' },
                        { text: 'HTML', value: 'html' }
                    ]}
                    optionAfter={<Icon path={mdiCodeJson} size={0.8} />}
                />
                {Code(`
<AIOButton
    type='multiselect'
    text='skills'
    value={skills}
    onChange={(skills)=>{
        this.setState({skills})
    }}
    options={[
        {text:'JS',value:'js'},
        {text:'CSS',value:'css'},
        {text:'HTML',value:'html'}
    ]}
    optionAfter={<Icon path={mdiCodeJson} size={0.8}/>}
/>
                `)}
                <AIOButton
                    type='multiselect'
                    text='skills'
                    value={skills}
                    onChange={(skills) => {
                        this.setState({ skills })
                    }}
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
                {Code(`
<AIOButton
    type='multiselect'
    text='skills'
    value={skills}
    onChange={(skills)=>{
        this.setState({skills})
    }}
    options={[
        {text:'JS',value:'js',amount:3},
        {text:'CSS',value:'css',amount:5},
        {text:'HTML',value:'html',amount:7}
    ]}
    optionAfter={(option)=>{
        return (
            <div 
                style={{background:'dodgerblue',color:'#fff',padding:'0 6px',borderRadius:24}}
            >{option.amount}</div>
        )
    }}
/>
                `)}
                <h5>tabs</h5>
                <AIOButton
                    type='tabs'
                    value={tab}
                    onChange={(tab) => {
                        this.setState({ tab })
                    }}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    optionAfter={<Icon path={mdiAccount} size={0.8} />}
                />
                {Code(`
<AIOButton
    type='tabs'
    value={tab}
    onChange={(tab)=>{
        this.setState({tab})
    }}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    optionAfter={<Icon path={mdiAccount} size={0.8}/>}
/>
                `)}
                <AIOButton
                    type='tabs'
                    value={tab}
                    onChange={(tab) => {
                        this.setState({ tab })
                    }}
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
                {Code(`
<AIOButton
    type='tabs'
    value={tab}
    onChange={(tab)=>{
        this.setState({tab})
    }}
    options={[
        {text:'Option1',value:'0',amount:3},
        {text:'Option2',value:'1',amount:5},
        {text:'Option3',value:'2',amount:7}
    ]}
    optionAfter={(option)=>{
        return (
            <div 
                style={{background:'dodgerblue',color:'#fff',padding:'0 6px',borderRadius:24}}
            >{option.amount}</div>
        )
    }}
/>
                `)}
                <h5>radio</h5>
                <AIOButton
                    type='radio'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    optionAfter={<Icon path={mdiAccount} size={0.8} />}
                />
                {Code(`
<AIOButton
    type='radio'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    optionAfter={<Icon path={mdiAccount} size={0.8}/>}
/>
                `)}
                <AIOButton
                    type='radio'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
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
                {Code(`
<AIOButton
    type='radio'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0',amount:3},
        {text:'Option2',value:'1',amount:5},
        {text:'Option3',value:'2',amount:7}
    ]}
    optionAfter={(option)=>{
        return (
            <div 
                style={{background:'dodgerblue',color:'#fff',padding:'0 6px',borderRadius:24}}
            >{option.amount}</div>
        )
    }}
/>
                `)}
                {Titr('optionDisabled props')}
                <h5>select</h5>
                <AIOButton
                    type='select'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    optionDisabled='option.value === "2"'
                />
                {Code(`
<AIOButton
    type='select'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    optionDisabled='option.value === "2"'
/>
                `)}
                <AIOButton
                    type='select'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    options={[
                        { text: 'Option1', value: '0', amount: 23 },
                        { text: 'Option2', value: '1', amount: 12 },
                        { text: 'Option3', value: '2', amount: 5 }
                    ]}
                    optionDisabled={(option) => {
                        return option.amount > 10
                    }}
                />
                {Code(`
<AIOButton
    type='select'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0',amount:23},
        {text:'Option2',value:'1',amount:12},
        {text:'Option3',value:'2',amount:5}
    ]}
    optionDisabled={(option)=>{
        return option.amount > 10
    }}
/>
                `)}
                <h5>multiselect</h5>
                <AIOButton
                    type='multiselect'
                    text='skills'
                    value={skills}
                    onChange={(skills) => {
                        this.setState({ skills })
                    }}
                    options={[
                        { text: 'JS', value: 'js' },
                        { text: 'CSS', value: 'css' },
                        { text: 'HTML', value: 'html' }
                    ]}
                    optionDisabled='option.value === "css"'
                />
                {Code(`
<AIOButton
    type='multiselect'
    text='skills'
    value={skills}
    onChange={(skills)=>{
        this.setState({skills})
    }}
    options={[
        {text:'JS',value:'js'},
        {text:'CSS',value:'css'},
        {text:'HTML',value:'html'}
    ]}
    optionDisabled='option.value === "css"'
/>
                `)}
                <AIOButton
                    type='multiselect'
                    text='skills'
                    value={skills}
                    onChange={(skills) => {
                        this.setState({ skills })
                    }}
                    options={[
                        { text: 'JS', value: 'js', amount: 3 },
                        { text: 'CSS', value: 'css', amount: 5 },
                        { text: 'HTML', value: 'html', amount: 7 }
                    ]}
                    optionDisabled={(option) => {
                        return option.value === 'css'
                    }}
                />
                {Code(`
<AIOButton
    type='multiselect'
    text='skills'
    value={skills}
    onChange={(skills)=>{
        this.setState({skills})
    }}
    options={[
        {text:'JS',value:'js',amount:3},
        {text:'CSS',value:'css',amount:5},
        {text:'HTML',value:'html',amount:7}
    ]}
    optionDisabled={(option)=>{
        return option.value === 'css'
    }}
/>
                `)}
                <h5>tabs</h5>
                <AIOButton
                    type='tabs'
                    value={tab}
                    onChange={(tab) => {
                        this.setState({ tab })
                    }}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    optionDisabled='option.value === "1"'
                />
                {Code(`
<AIOButton
    type='tabs'
    value={tab}
    onChange={(tab)=>{
        this.setState({tab})
    }}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    optionDisabled='option.value === "1"'
/>
                `)}
                <AIOButton
                    type='tabs'
                    value={tab}
                    onChange={(tab) => {
                        this.setState({ tab })
                    }}
                    options={[
                        { text: 'Option1', value: '0', amount: 3 },
                        { text: 'Option2', value: '1', amount: 5 },
                        { text: 'Option3', value: '2', amount: 7 }
                    ]}
                    optionDisabled={(option) => {
                        return option.value === '1'
                    }}
                />
                {Code(`
<AIOButton
    type='tabs'
    value={tab}
    onChange={(tab)=>{
        this.setState({tab})
    }}
    options={[
        {text:'Option1',value:'0',amount:3},
        {text:'Option2',value:'1',amount:5},
        {text:'Option3',value:'2',amount:7}
    ]}
    optionDisabled={(option)=>{
        return option.value === '1'
    }}
/>
                `)}
                <h5>radio</h5>
                <AIOButton
                    type='radio'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    optionDisabled='option.value === "1"'
                />
                {Code(`
<AIOButton
    type='radio'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    optionDisabled='option.value === "1"'
/>
                `)}
                <AIOButton
                    type='radio'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    options={[
                        { text: 'Option1', value: '0', amount: 3 },
                        { text: 'Option2', value: '1', amount: 5 },
                        { text: 'Option3', value: '2', amount: 7 }
                    ]}
                    optionDisabled={(option) => {
                        return option.value === '1'
                    }}
                />
                {Code(`
<AIOButton
    type='radio'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0',amount:3},
        {text:'Option2',value:'1',amount:5},
        {text:'Option3',value:'2',amount:7}
    ]}
    optionDisabled={(option)=>{
        return option.value === '1'
    }}
/>
                `)}
                {Titr('optionStyle props')}
                <h5>select</h5>
                <AIOButton
                    type='select'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    optionStyle='{background:"lightblue"}'
                />
                {Code(`
<AIOButton
    type='select'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    optionStyle='{background:"lightblue"}'
/>
                `)}
                <AIOButton
                    type='select'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    options={[
                        { text: 'Option1', value: '0', amount: 23 },
                        { text: 'Option2', value: '1', amount: 12 },
                        { text: 'Option3', value: '2', amount: 5 }
                    ]}
                    optionStyle={(option) => {
                        return { background: option.amount > 10 ? 'lightblue' : 'fff' }
                    }}
                />
                {Code(`
<AIOButton
    type='select'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0',amount:23},
        {text:'Option2',value:'1',amount:12},
        {text:'Option3',value:'2',amount:5}
    ]}
    optionStyle={(option)=>{
        return {background:option.amount > 10?'lightblue':'fff'}
    }}
/>
                `)}
                <h5>multiselect</h5>
                <AIOButton
                    type='multiselect'
                    text='skills'
                    value={skills}
                    onChange={(skills) => {
                        this.setState({ skills })
                    }}
                    options={[
                        { text: 'JS', value: 'js', color: 'yellow' },
                        { text: 'CSS', value: 'css', color: 'lightblue' },
                        { text: 'HTML', value: 'html', color: 'orange' }
                    ]}
                    optionStyle='{background:option.color}'
                />
                {Code(`
<AIOButton
    type='multiselect'
    text='skills'
    value={skills}
    onChange={(skills)=>{
        this.setState({skills})
    }}
    options={[
        {text:'JS',value:'js'},
        {text:'CSS',value:'css'},
        {text:'HTML',value:'html'}
    ]}
    optionStyle='{background:option.color}'
/>
                `)}
                <AIOButton
                    type='multiselect'
                    text='skills'
                    value={skills}
                    onChange={(skills) => {
                        this.setState({ skills })
                    }}
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
                {Code(`
<AIOButton
type='multiselect'
text='skills'
value={skills}
onChange={(skills)=>{
    this.setState({skills})
}}
options={[
    {text:'JS',value:'js'},
    {text:'CSS',value:'css'},
    {text:'HTML',value:'html'}
]}
optionStyle={(option)=>{
    return {
        'js':'yellow',
        'css':'lightblue',
        'html':'orange'
    }[option.value]
}}
/>
                `)}
                <h5>tabs</h5>
                <AIOButton
                    type='tabs'
                    value={tab}
                    onChange={(tab) => {
                        this.setState({ tab })
                    }}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    optionStyle='{background:option.value === "1"?"lightblue":"#fff"}'
                />
                {Code(`
<AIOButton
    type='tabs'
    value={tab}
    onChange={(tab)=>{
        this.setState({tab})
    }}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    optionStyle='{background:option.value === "1"?"lightblue":"#fff"}'
/>
                `)}
                <AIOButton
                    type='tabs'
                    value={tab}
                    onChange={(tab) => {
                        this.setState({ tab })
                    }}
                    options={[
                        { text: 'Option1', value: '0', amount: 3 },
                        { text: 'Option2', value: '1', amount: 5 },
                        { text: 'Option3', value: '2', amount: 7 }
                    ]}
                    optionStyle={(option) => {
                        return { background: option.value === '2' ? 'lightblue' : '#fff' }
                    }}
                />
                {Code(`
<AIOButton
    type='tabs'
    value={tab}
    onChange={(tab)=>{
        this.setState({tab})
    }}
    options={[
        {text:'Option1',value:'0',amount:3},
        {text:'Option2',value:'1',amount:5},
        {text:'Option3',value:'2',amount:7}
    ]}
    optionStyle={(option)=>{
        return {background:option.value === '2'?'lightblue':'#fff'}
    }}
/>
                `)}
                <h5>radio</h5>
                <AIOButton
                    type='radio'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    options={[
                        { text: 'Option1', value: '0' },
                        { text: 'Option2', value: '1' },
                        { text: 'Option3', value: '2' }
                    ]}
                    optionStyle='{background:option.value === "1"?"lightblue":"#fff"}'
                />
                {Code(`
<AIOButton
    type='radio'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0'},
        {text:'Option2',value:'1'},
        {text:'Option3',value:'2'}
    ]}
    optionStyle='{background:option.value === "1"?"lightblue":"#fff"}'
/>
                `)}
                <AIOButton
                    type='radio'
                    value={option}
                    onChange={(option) => {
                        this.setState({ option })
                    }}
                    options={[
                        { text: 'Option1', value: '0', amount: 3 },
                        { text: 'Option2', value: '1', amount: 5 },
                        { text: 'Option3', value: '2', amount: 7 }
                    ]}
                    optionStyle={(option) => {
                        return { background: option.value === '2' ? 'lightblue' : '#fff' }
                    }}
                />
                {Code(`
<AIOButton
    type='radio'
    value={option}
    onChange={(option)=>{
        this.setState({option})
    }}
    options={[
        {text:'Option1',value:'0',amount:3},
        {text:'Option2',value:'1',amount:5},
        {text:'Option3',value:'2',amount:7}
    ]}
    optionStyle={(option)=>{
        return {background:option.value === '2'?'lightblue':'#fff'}
    }}
/>
                `)}
            </div>

        )
    }
}
