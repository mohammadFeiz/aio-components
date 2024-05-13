import React, { Component, FC, useState } from 'react';
import AIOInput, { AIOValidation } from '../../npm/aio-input/index.tsx';
import DOC from '../../resuse-components/doc.tsx';
import RVD from '../../npm/react-virtual-dom/index.tsx';
import { AV_operator } from '../../npm/aio-input';
import { ParseString } from '../../npm/aio-utils/index.tsx';
export default function DOC_AIOValidation(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items: () => [
                    { text: 'try it', id: 'try it', render: () => <TryIt /> },

                ]
            }}
        />
    )
}
type I_textCase = { config: { title: string, lang: 'en' | 'fa', value: any, validations: string[] }, result: string } 
const testCases: I_textCase[] = [
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad sha",
            "validations": ["<,12"]
        },
        result: 'firstname should be less than 12 character(s)'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad sh",
            "validations": ["<,12"]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad sha",
            "validations": ["<=,12"]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad shag",
            "validations": ["<=,12"]
        },
        result: 'firstname should be less than or equal 12 character(s)'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad sh",
            "validations": [
                    "<=,12"
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad sha",
            "validations": [
                    "!<,12",
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad shahg",
            "validations": [
                    "!<,12",
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad sh",
            "validations": [
                    "!<,12",
            ]
        },
        result: 'firstname could not be less than 12 character(s)'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad shar",
            "validations": [
                    "!<=,12",
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad sha",
            "validations": [
                    "!<=,12",
            ]
        },
        result: 'firstname could not be less than or equal 12 character(s)'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad sh",
            "validations": [
                    "!<=,12",
            ]
        },
        result: 'firstname could not be less than or equal 12 character(s)'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad sh",
            "validations": [
                    ">,12",
            ]
        },
        result: 'firstname should be more than 12 character(s)'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad sha",
            "validations": [
                    ">,12",
            ]
        },
        result: 'firstname should be more than 12 character(s)'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad shad",
            "validations": [
                    ">,12",
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad sh",
            "validations": [
                    ">=,12",
            ]
        },
        result: 'firstname should be more than or equal 12 character(s)'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad sha",
            "validations": [
                    ">=,12",
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad shaf",
            "validations": [
                    ">=,12",
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad sh",
            "validations": [
                    "!>,12",
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad shg",
            "validations": [
                    "!>,12",
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad shgh",
            "validations": [
                    "!>,12",
            ]
        },
        result: 'firstname could not be more than 12 character(s)'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad sh",
            "validations": [
                    "!>=,12",
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad sha",
            "validations": [
                    "!>=,12",
            ]
        },
        result: 'firstname could not be more than or equal 12 character(s)'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "mohammad shar",
            "validations": [
                    "!>=,12",
            ]
        },
        result: 'firstname could not be more than or equal 12 character(s)'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "42342342",
            "validations": [
                    "contain,'letter'"
            ]
        },
        result: 'firstname should be contain letter character(s)'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "42342342f",
            "validations": [
                    "contain,'letter'",
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "fsdfsdfsd",
            "validations": [
                    "contain,'number'",
            ]
        },
        result: 'firstname should be contain number character(s)'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "fsdfsdfsd4",
            "validations": [
                    "contain,'number'",
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "fsdfsdfsd4#",
            "validations": [
                    "contain,'symbol'",
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "fsdfsdfsd4",
            "validations": [
                    "contain,'symbol'",
            ]
        },
        result: 'firstname should be contain symbol character(s)'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "fsdfsdfsd4R",
            "validations": [
                    "contain,'uppercase'",
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "fsdfsdfsd4",
            "validations": [
                    "contain,'uppercase'",
            ]
        },
        result: 'firstname should be contain uppercase character(s)'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "fsdfsdfsd4",
            "validations": [
                    "contain,'lowercase'",
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "RWEFSD",
            "validations": [
                    "contain,'lowercase'",
            ]
        },
        result: 'firstname should be contain lowercase character(s)'
    },


]

const TryIt: FC = () => {
    let [model, setModel] = useState<any>({
        title: 'list',
        lang: 'en',
        value: '[1,2,3]',
        operator: '=',
        target: 3,
    })
    let [ops] = useState<AV_operator[]>([
        'required', 'contain', '!contain', '=', '!=', '<', '!<', '>', '!>', '<=', '!<=', '>=', '!>='
    ])
    let testMode = false;
    if (testMode) {
        let allResult = true
        for (let i = 0; i < testCases.length; i++) {
            let {config,result} = testCases[i];
            let { title, lang, value, validations } = config;
            let [operator,target] = validations[0].split(',');
            if(target !== undefined){
                if(i === 23){debugger}
                target = ParseString(target);
                console.log(target)
            }
            let { message,success } = getResult({ title, lang, value, operator:operator as AV_operator,target })
            if(!success){
                allResult = false;
                alert(`testCase[${i}] was not success to execute`)
                return <button type='button' onClick={()=>window.location.reload()}>Try Again</button>
            }
            if(message !== result){
                allResult = false;
                alert(`testCase[${i}] was success but is not match`)
                return <button type='button' onClick={()=>window.location.reload()}>Try Again</button>
            }
        }
        if(allResult){alert('Good Job!!! all test cases was success and was match')}
    }
    let { message, code, success,result } = getResult(model)
    return (
        <div className="example">
            <AIOInput
                type='form'
                value={{ ...model }}
                onChange={(newValue) => setModel({ ...newValue })}
                inputs={{
                    column: [
                        {
                            row: [
                                { input: { type: 'text' }, label: 'title', field: 'value.title' },
                                { input: { type: 'radio', popover: { fitHorizontal: true }, options: ['en', 'fa'], option: { text: 'option', value: 'option' } }, label: 'lang', field: 'value.lang' },
                            ]
                        },
                        
                        {
                            row: [
                                { input: { type: 'text' }, label: 'value', field: 'value.value' },
                                { input: { type: 'select', options: ops, option: { text: 'option', value: 'option' } }, label: 'operator', field: 'value.operator' },
                                { input: { type: 'text' }, label: 'target', field: 'value.target' },
                            ]
                        }
                    ]
                }}
            />
            <RVD
                rootNode={{
                    column: [
                        {
                            className: 'p-24 brd-c-20 m-12',
                            column: [
                                { html: 'Config' },
                                { html: <pre>{code}</pre> }
                            ]
                        },
                        { size: 12 },
                        {
                            className: 'p-24 brd-c-20 m-12',
                            column: [
                                { html: 'Result Message' },
                                { html: message, style: { color: result ? 'green' : 'red', direction: model.lang === 'fa' ? 'rtl' : 'ltr' } }
                            ]
                        }
                    ]
                }}
            />
        </div>
    )
}
function getResult(p: { target: any, title: string, lang: 'en' | 'fa', value: any, operator: AV_operator }) {
    let { target, title, lang, value, operator } = p;
    let parsedValue = ParseString(value)
    let message;
    let result;
    let code;
    let success = false;
    try {
        success = true;
        let config = {
            title: title,
            lang: lang,
            value:parsedValue,
            validations: [`${operator},${target}`]
        }
        code = JSON.stringify(config, null, 4)
        let inst = new AIOValidation(config)
        message = inst.validate()
        if (!message) { 
            message = 'value is match by operator and target' 
            result = true
        }
        else {
            result = false
        }
    }
    catch {
        message = '';
        code = '';
        success = false
    }
    return { message, code, success ,result}
}