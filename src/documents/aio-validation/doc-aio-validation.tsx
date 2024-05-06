import React, { Component, FC, useState } from 'react';
import AIOInput, { AIOValidation } from '../../npm/aio-input/index.tsx';
import DOC from '../../resuse-components/doc.tsx';
import RVD from '../../npm/react-virtual-dom/index.tsx';
import { AV_operator } from '../../npm/aio-input/types.tsx';
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
const testCases = [
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad sha",
    "validations": [
        {
            "operator": "less",
            "target": 12
        }
    ]
        },
        result:'firstname should be less than 12 character(s)'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad sh",
    "validations": [
        {
            "operator": "less",
            "target": 12
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad sha",
    "validations": [
        {
            "operator": "less_equal",
            "target": 12
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad shag",
    "validations": [
        {
            "operator": "less_equal",
            "target": 12
        }
    ]
        },
        result:'firstname should be less than or equal 12 character(s)'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad sh",
    "validations": [
        {
            "operator": "less_equal",
            "target": 12
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad sha",
    "validations": [
        {
            "operator": "not_less",
            "target": 12
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad shahg",
    "validations": [
        {
            "operator": "not_less",
            "target": 12
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad sh",
    "validations": [
        {
            "operator": "not_less",
            "target": 12
        }
    ]
        },
        result:'firstname could not be less than 12 character(s)'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad shar",
    "validations": [
        {
            "operator": "not_less_equal",
            "target": 12
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad sha",
    "validations": [
        {
            "operator": "not_less_equal",
            "target": 12
        }
    ]
        },
        result:'firstname could not be less than or equal 12 character(s)'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad sh",
    "validations": [
        {
            "operator": "not_less_equal",
            "target": 12
        }
    ]
        },
        result:'firstname could not be less than or equal 12 character(s)'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad sh",
    "validations": [
        {
            "operator": "greater",
            "target": 12
        }
    ]
        },
        result:'firstname should be more than 12 character(s)'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad sha",
    "validations": [
        {
            "operator": "greater",
            "target": 12
        }
    ]
        },
        result:'firstname should be more than 12 character(s)'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad shad",
    "validations": [
        {
            "operator": "greater",
            "target": 12
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad sh",
    "validations": [
        {
            "operator": "greater_equal",
            "target": 12
        }
    ]
        },
        result:'firstname should be more than or equal 12 character(s)'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad sha",
    "validations": [
        {
            "operator": "greater_equal",
            "target": 12
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad shaf",
    "validations": [
        {
            "operator": "greater_equal",
            "target": 12
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad sh",
    "validations": [
        {
            "operator": "not_greater",
            "target": 12
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad shg",
    "validations": [
        {
            "operator": "not_greater",
            "target": 12
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad shgh",
    "validations": [
        {
            "operator": "not_greater",
            "target": 12
        }
    ]
        },
        result:'firstname could not be more than 12 character(s)'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad sh",
    "validations": [
        {
            "operator": "not_greater_equal",
            "target": 12
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad sha",
    "validations": [
        {
            "operator": "not_greater_equal",
            "target": 12
        }
    ]
        },
        result:'firstname could not be more than or equal 12 character(s)'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "mohammad shar",
    "validations": [
        {
            "operator": "not_greater_equal",
            "target": 12
        }
    ]
        },
        result:'firstname could not be more than or equal 12 character(s)'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "42342342",
    "validations": [
        {
            "operator": "contain",
            "target": "letter"
        }
    ]
        },
        result:'firstname should be contain letter character(s)'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "42342342f",
    "validations": [
        {
            "operator": "contain",
            "target": "letter"
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "fsdfsdfsd",
    "validations": [
        {
            "operator": "contain",
            "target": "number"
        }
    ]
        },
        result:'firstname should be contain number character(s)'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "fsdfsdfsd4",
    "validations": [
        {
            "operator": "contain",
            "target": "number"
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "fsdfsdfsd4#",
    "validations": [
        {
            "operator": "contain",
            "target": "symbol"
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "fsdfsdfsd4",
    "validations": [
        {
            "operator": "contain",
            "target": "symbol"
        }
    ]
        },
        result:'firstname should be contain symbol character(s)'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "fsdfsdfsd4R",
    "validations": [
        {
            "operator": "contain",
            "target": "uppercase"
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "fsdfsdfsd4",
    "validations": [
        {
            "operator": "contain",
            "target": "uppercase"
        }
    ]
        },
        result:'firstname should be contain uppercase character(s)'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "fsdfsdfsd4",
    "validations": [
        {
            "operator": "contain",
            "target": "lowercase"
        }
    ]
        },
        result:'value is match by operator and target'
    },
    {
        config:{
            "title": "firstname",
    "lang": "en",
    "value": "RWEFSD",
    "validations": [
        {
            "operator": "contain",
            "target": "lowercase"
        }
    ]
        },
        result:'firstname should be contain lowercase character(s)'
    },
    {
        config:{
            
        },
        result:''
    },
    {
        config:{
            
        },
        result:''
    },
    {
        config:{
            
        },
        result:''
    },
    {
        config:{
            
        },
        result:''
    },
    {
        config:{
            
        },
        result:''
    },
    {
        config:{
            
        },
        result:''
    },
    {
        config:{
            
        },
        result:''
    },
    {
        config:{
            
        },
        result:''
    },
    {
        config:{
            
        },
        result:''
    },
    {
        config:{
            
        },
        result:''
    },
    {
        config:{
            
        },
        result:''
    },

]
const TryIt: FC = () => {
    let [model, setModel] = useState<any>({
        title: 'firstname',
        lang: 'en',
        value: 'mohammad sh',
        operator: 'equal',
        target: 'mohammad sh',
        targetType: 'string'
    })
    let [ops] = useState<AV_operator[]>([
        'required', 'function', 'contain', 'not_contain', 'equal', 'not_equal', 'less', 'not_less', 'greater', 'not_greater', 'less_equal', 'not_less_equal', 'greater_equal', 'not_greater_equal'
    ])
    let result;
    let code;
    let targetStr = '';
    try{targetStr = JSON.parse(model.target)} catch{}
    console.log('target',model.target,targetStr)
    try {
        let config = {
            title: model.title,
            lang: model.lang,            
            value:model.value,
            validations: [{ operator: model.operator, target: model.targetType === 'number' ? +model.target : JSON.parse(model.target) }]
        }
        code = JSON.stringify(config, null, 4)
        result = new AIOValidation(config).validate()
    }
    catch {
        result = '';
        code = '';
    }
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
                            row:[
                                { input: { type: 'radio', options: ['string', 'number'], option: { text: 'option', value: 'option' } }, label: 'target type', field: 'value.targetType' },
                                { input: { type: 'text' }, label: 'target', field: 'value.target' }
                            ]
                        },
                        {
                            row: [
                                { input: { type: 'text' }, label: 'value', field: 'value.value' },
                                { input: { type: 'select', options: ops, option: { text: 'option', value: 'option' } }, label: 'operator', field: 'value.operator' },
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
                                { show: !!result, html: result, style: { color: 'red', direction: model.lang === 'fa' ? 'rtl' : 'ltr' } },
                                { show: !result, html: 'value is match by operator and target', style: { color: 'green' } }
                            ]
                        }
                    ]
                }}
            />
        </div>
    )
} 
