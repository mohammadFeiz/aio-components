import React, { Component } from "react";
import Input from './../../npm/aio-input/aio-input';
import { Icon } from '@mdi/react';
import { mdiAccount, mdiMagnify, mdiCheckCircle } from '@mdi/js';
import AIODoc from './../../npm/aio-documentation/aio-documentation';
import './index.css';
export default class DOC_AIOInput extends Component {
    state = {
        age: '',
        name: '',
        desc: '',
        password: ''
    }
    render() {
        let { age, name, desc, password } = this.state;
        let { Titr, Code } = AIODoc();
        return (
            <div className='example'>
                <button onClick={()=>this.props.goToHome()} style={{margin:24}}>Go To Home</button>
                <Input
                    type='number'
                    label='input type number'
                    value={age}
                    onChange={(age) => {
                        if (age > 40) { age = 40 }
                        this.setState({ age })
                    }}
                />
                <br />
                <Input
                    type='number'
                    label='input type Number(swip)'
                    value={age}
                    swip={true}
                    onChange={(age) => {
                        if (age > 40) { age = 40 }
                        this.setState({ age })
                    }}
                />
                <br />
                <Input
                    type='number'
                    label='input type Number(spin)'
                    value={age}
                    spin={false}
                    onChange={(age) => {
                        if (age > 40) { age = 40 }
                        this.setState({ age })
                    }}
                />
                <br />
                <Input
                    type='number'
                    label='input type Number(after)'
                    value={age}
                    after={<Icon path={mdiMagnify} size={1} style={{ color: '#aaa' }} />}
                    onChange={(age) => {
                        if (age > 40) { age = 40 }
                        this.setState({ age })
                    }}
                />
                <br />
                <Input
                    type='number'
                    label='input type Number(before)'
                    value={age}
                    before={<Icon path={mdiAccount} size={0.8} style={{ color: '#aaa' }} />}
                    onChange={(age) => {
                        if (age > 40) { age = 40 }
                        this.setState({ age })
                    }}
                />
                <br />
                <Input
                    type='text'
                    label='input type text'
                    msf={true}
                    value={name}
                    onChange={(name) => {
                        this.setState({ name })
                    }}
                />
                <br />
                <Input
                    type='text'
                    label='input type text (options)'
                    options={['moahmamd', 'ali']}
                    optionText='option'
                    //optionValue='option'
                    value={name}
                    onChange={(name) => {
                        this.setState({ name })
                    }}
                />
                <br />
                <Input
                    type='text'
                    label='input type text (justNumber)'
                    justNumber={true}
                    filter={[' ']}
                    value={name}
                    onChange={(name) => {
                        this.setState({ name })
                    }}
                />
                <br />
                <Input
                    type='text'
                    label='input type text (filter)'
                    filter={[' ', '@']}
                    value={name}
                    onChange={(name) => {
                        this.setState({ name })
                    }}
                />
                <br />
                <Input
                    type='textarea'
                    label='textarea'
                    value={desc}
                    onChange={(desc) => {
                        this.setState({ desc })
                    }}
                />
                <br />
                <Input
                    type='textarea'
                    label='textarea (autoHeight)'
                    value={desc}
                    autoHeight={true}
                    onChange={(desc) => {
                        this.setState({ desc })
                    }}
                />
                <br />
                <Input
                    type='textarea'
                    before={<Icon path={mdiAccount} size={1} style={{ color: '#aaa' }} />}
                    label='textarea (before)'
                    value={desc}
                    onChange={(desc) => {
                        this.setState({ desc })
                    }}
                />
                <br />
                <Input
                    type='textarea'
                    after={<Icon path={mdiMagnify} size={1} style={{ color: '#aaa' }} />}
                    label='textarea (after)'
                    value={desc}
                    onChange={(desc) => {
                        this.setState({ desc })
                    }}
                />
                <br />
                <Input
                    type='text'
                    className='ex1'
                    label='style1'
                    value={age}
                    before={<Icon path={mdiAccount} size={0.7} style={{ color: '#711ddf', margin: '0 12px' }} />}
                    after={<Icon path={mdiCheckCircle} size={0.7} style={{ color: '#711ddf', margin: '0 12px' }} />}
                    onChange={(age) => {
                        if (age > 40) { age = 40 }
                        this.setState({ age })
                    }}
                />
                <br />
                <Input
                    type='text'
                    className='ex2'
                    attrs={{ placeholder: 'style2' }}
                    value={age}
                    onChange={(age) => {
                        if (age > 40) { age = 40 }
                        this.setState({ age })
                    }}
                />
                <br />
                <div className='ex3'>
                    <Input
                        type='text'
                        attrs={{ placeholder: 'style2' }}
                        value={age}
                        onChange={(age) => {
                            if (age > 40) { age = 40 }
                            this.setState({ age })
                        }}
                        before={<Icon path={mdiAccount} size={0.7} />}
                    />
                </div>
                <div className='ex4'>
                    <div className='title'>Style4</div>
                    <Input
                        type='text'
                        attrs={{ placeholder: 'Email' }}
                        value={age}
                        onChange={(age) => {
                            if (age > 40) { age = 40 }
                            this.setState({ age })
                        }}
                    />
                    <Input
                        type='password'
                        attrs={{ placeholder: 'Password' }}
                        value={password}
                        onChange={(password) => {
                            if (age > 40) { age = 40 }
                            this.setState({ password })
                        }}
                    />
                </div>
            </div>
        )
    }
}
