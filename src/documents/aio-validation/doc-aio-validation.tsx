import { FC, useState } from 'react';
import { AIRadio, AISelect, AIText } from '../../npm/aio-input/index.tsx';
import DOC from '../../resuse-components/doc.tsx';
import { AV_operator,Validation } from '../../npm/aio-utils';
import { ParseString } from '../../npm/aio-utils/index.tsx';
export default function DOC_Validation(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items: () => [
                    { text: 'try it', id: 'try it', render: () => <TryIt /> }
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
        result: 'firstname should be contain letter'
    },
    {
        config: {
            "title": "firstname",
            "lang": "en",
            "value": "'42342342f'",
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
        result: 'firstname should be contain number'
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
        result: 'firstname should be contain symbol'
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
        result: 'firstname should be contain uppercase'
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
        result: 'firstname should be contain lowercase'
    },
    {
        config: {
            "title": "list",
            "lang": "en",
            "value": [
                1,
                2
            ],
            "validations": [
                "<,3"
            ]
        },
        result: 'value is match by operator and target'
    },
    {
        config: {
            "title": "list",
            "lang": "en",
            "value": [
                1,
                2,
                3
            ],
            "validations": [
                "<,3"
            ]
        },
        result: 'list should be less than 3 items(s)'
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
    let [ops] = useState<any[]>([
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
    function changeModelByField(field:string,value:any){
        setModel({...model,[field]:value})
    }
    let { message, code,result } = getResult(model)
    return (
        <div className="example">
            <div className="flex-row">
                <div className="flex-row align-v gap-12">
                    <AIText label='title' value={model.title} onChange={(title)=>changeModelByField('title',title)}/>
                    <AIRadio 
                        label='lang' options={['en', 'fa']} option={{ text: 'option', value: 'option' } }
                        value={model.lang} onChange={(lang)=>changeModelByField('lang',lang)} 
                    />
                </div>
                <div className="flex-row align-v gap-12">
                    <AIText label='value' value={model.value} onChange={(value)=>changeModelByField('value',value)}/>
                    <AISelect
                        label='operator' options={ops} option={{ text: 'option', value: 'option' }} 
                        value={model.operator} onChange={(operator)=>changeModelByField('operator',operator)}
                    />
                    <AIText label='target' value={model.target} onChange={(target)=>changeModelByField('target',target)}/>
                </div>
            </div>
            <div className="flex-col gap-12">
                <div className="flex-col p-24 brd-c-20 m-12">
                    <div className="">Config</div>
                    <pre>{code}</pre>
                </div>
                <div className="flex-col p-24 brd-c-20 m-12">
                    <div className="">Result Message</div>
                    <div style={{ color: result ? 'green' : 'red', direction: model.lang === 'fa' ? 'rtl' : 'ltr' }}>{message}</div>
                </div>
            </div>
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
        let inst = new Validation(config)
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