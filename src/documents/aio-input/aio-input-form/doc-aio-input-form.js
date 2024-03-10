import React, { Component, useState } from 'react';
import DOC from '../../../resuse-components/doc';
import AIODoc from '../../../npm/aio-documentation/aio-documentation';
import RVD from '../../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from '../../../npm/aio-input/aio-input';
import './doc-aio-input-form.css';
import { Icon } from '@mdi/react';
import { mdiHumanMale, mdiHumanFemale, mdiAbTesting, mdiFile, mdiAccount, mdiAccountAlert, mdiChevronDown, mdiChevronDoubleDown, mdiCheckboxOutline, mdiCheckboxBlankOutline, mdiGenderFemale, mdiGenderMale } from '@mdi/js';
const DOC_options = [
    {name:'john',id:'1',gender:'male'},
    {name:'stephan',id:'2',gender:'male'},
    {name:'edvard',id:'3',gender:'male'},
    {name:'luis',id:'4',gender:'male'},
    {name:'carlos',id:'5',gender:'male'},
    {name:'kate',id:'6',gender:'female'},
    {name:'fernando',id:'7',gender:'male'},
    {name:'mark',id:'8',gender:'male'},
    {name:'nicol',id:'9',gender:'female'},
    {name:'lisa',id:'10',gender:'female'},
    {name:'lucas',id:'11',gender:'male'},
    {name:'maria',id:'12',gender:'female'}
]
const DOC_options_code = 
`
options:[
    {name:'john',id:'1',gender:'male'},
    {name:'stephan',id:'2',gender:'male'},
    {name:'edvard',id:'3',gender:'male'},
    {name:'luis',id:'4',gender:'male'},
    {name:'carlos',id:'5',gender:'male'},
    {name:'kate',id:'6',gender:'female'},
    {name:'fernando',id:'7',gender:'male'},
    {name:'mark',id:'8',gender:'male'},
    {name:'nicol',id:'9',gender:'female'},
    {name:'lisa',id:'10',gender:'female'},
    {name:'lucas',id:'11',gender:'male'},
    {name:'maria',id:'12',gender:'female'}
],
optionText:'option.name',
optionValue:'option.id'`
export default class DOC_AIOInput_Form extends Component {
    render() {
        let items = [
            { type: 'text' },
            { type: 'number' },
            { type: 'textarea' },
            { type: 'password' },
            { type: 'color' },
            { 
                type: 'file',
                description:(
                    <>
                        <h3>value props</h3>
                        <h5>value props can have this types:</h5>
                        <ul>
                            <li>object (if multiple props is false)</li>
                            <li>array of objects (if multiple props is true)</li>
                        </ul>
                        <h5>each object can be:</h5>
                        <ul>
                            <li>standard file object (picked from input file)</li>
                            {AIODoc().Code(`
{
    lastModified:1678315052406,
    lastModifiedDate:Thu Mar 09 2023 02:07:32 GMT+0330 (Iran Standard Time),
    name:"pasta_alferedo.png",
    size:21829,
    type:"image/png",
    webkitRelativePath:""
}
                            `)}
                            <li>or an object contain name size url (for example if file is read from api server)</li>
                            If the URL is set, the file can be downloaded by the user
                            {AIODoc().Code(`
{
    name:'this is my file name',
    size:12334443,
    url:'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg'
}
                            `)}
                        </ul>
                        <h3>onChange props</h3>
                        <h5>is a function</h5>
                        <ul>
                            <li>in multiple type (multiple:ture) will call by file objects array(picked by input type file) </li>
                            <li>in single type (multiple:false) will call by file object or undefined (undefined means that the file has been deleted by the user) </li>
                        </ul>
                    </>
                    
                ),
                model: {
                    value__multiple_file___:[
                        {
                            name:'this is my file name',
                            size:12334443,
                            url:'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg'
                        },
                        {
                            name:'this is my other file name',
                            size:123343,
                            url:'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg'
                        }
                    ],
                    value__single_file___:{
                        name:'this is my file name',
                        size:12334443,
                        url:'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg'
                    }
                }
            },
            { 
                type:'select',
                allInputProps:{
                    options:DOC_options,
                    optionText:'option.name',
                    optionValue:'option.id'
                },
                allInputFooters:DOC_options_code
                
            },
            { 
                type:'multiselect',
                allInputProps:{
                    options:DOC_options,
                    optionText:'option.name',
                    optionValue:'option.id',
                    text:'this is my text',
                },
                allInputFooters:`
${DOC_options_code}
text:'this is my text,'
                `
            },
            { 
                type:'radio',
                allInputProps:{
                    options:DOC_options,
                    optionText:'option.name',
                    optionValue:'option.id'
                },
                allInputFooters:DOC_options_code
                
            },
            { 
                type:'tabs',
                allInputProps:{
                    options:DOC_options,
                    optionText:'option.name',
                    optionValue:'option.id'
                },
                allInputFooters:DOC_options_code
                
            },
            {
                type:'slider',
                model:{
                    multiple__slider___:[100,200]
                },
                allInputProps:{
                    start:20,step:1,end:240,
                },
                allInputFooters:`
start:20,step:1,end:100,
                `
            },
            {type:'datepicker'},
            { type: 'checkbox',allInputProps:{text:'this is my text'} },
            {
                type:'image',
                model:{
                    before:{url:'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'},
                    after:{url:'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'},
                    subtext:{url:'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'},
                    width_height:{url:'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'},
                    width:{url:'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'},
                    height:{url:'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'},
                    attrs:{url:'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'},
                    disabled:{url:'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'},
                    loading:{url:'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'}
                },
                allInputFooters:`
value:{url:'https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg'}
                `
            },
            {
                type:'time',
                model:{
                    minute_second:{minute:10,second:0},
                    hour_minute_second:{hour:3,minute:12,second:30},
                    year_month_day:{year:2022,month:6,day:25},
                    year_month_day_hour_minute:{year:2022,month:6,day:25,hour:12,minute:30},
                    before:{minute:10,second:0},
                    after:{minute:10,second:0},
                    subtext:{minute:10,second:0},
                    disabled:{minute:10,second:0},
                    loading:{minute:10,second:0},
                    attrs:{minute:10,second:0},

                },
                
            },
            { prop:'after'},
            
        ]
        return (<DOC {...this.props} nav={{items:getNavItems(items)}}/>)
    }
}
function e_exist(type, prop) {
    let dic = {
        text: {
            before: true,after: true,subtext: true, 
            disabled: true,
            placeholder: true,
            inputAttrs_style: true,
            justify: true, 
            loading: true, 
            justNumber_true: true, justNumber_array: true,maxLength: true, filter: true,
            caret_false: true,caret_html:true,
            options:true,
            optionText_optionValue: true, 
            optionAttrs__object___: true, optionAttrs__function___: true,
            attrs:true,
            style:true,
            popover:true,
            optionSubtext__string___:true,
            optionSubtext__function___:true,
            optionBafore__string___:true,
            optionBefore__function___:true,
            optionAfter__string___:true,
            optionAfter__function___:true,
            optionDisabled__string___:true,
            optionDisabled__function___:true,
        },
        number: { 
            before: true, after: true,subtext: true,
            placeholder: true, 
            inputAttrs_style: true,
            disabled: true, 
            justify: true, 
            loading: true, 
            swip:true,
            caret_false: true,caret_html:true,
            options__number___:true,
            optionText_optionValue__number___: true, 
            optionAttrs__object___: true,optionAttrs__function___: true,
            attrs:true,
            style:true,
            popover:true,
        },
        textarea: { 
            before: true,after: true,subtext: true, 
            placeholder: true,
            inputAttrs_style: true,
            disabled: true,
            loading: true, 
            maxLength: true,
            filter:true,
            justify: true, 
            justNumber_true: true, justNumber_array: true,maxLength: true, filter: true,
            caret_false: true,caret_html:true,
            options:true,
            optionText_optionValue: true, 
            optionAttrs__object___: true, optionAttrs__function___: true,
            attrs:true,
            style:true,
            popover:true,
            optionSubtext__string___:true,
            optionSubtext__function___:true,
            optionBafore__string___:true,
            optionBefore__function___:true,
            optionAfter__string___:true,
            optionAfter__function___:true,
            optionDisabled__string___:true,
            optionDisabled__function___:true,
        },
        password: {
            before: true,after: true,subtext: true, 
            placeholder: true,
            inputAttrs_style: true,
            disabled: true,
            justify: true, 
            loading: true, 
            filter:true,
            justNumber_true: true, justNumber_array: true,maxLength: true, filter: true,
            visible:true,
            attrs:true,
            style:true
        },
        color: {
            before: true,after: true,subtext: true, 
            disabled: true,
            loading: true, 
            options__type_color___:true,
            attrs:true,
            style:true,
        },
        file: {
            text:true,
            before: true,after: true,
            subtext: true, 
            disabled: true,
            loading: true, 
            attrs:true,
            style:true,
            multiple__file___:true,
            value__single_file___:true,
            value__multiple_file___:true
            
        },
        select: {
            text:true,
            before: true,
            after: true,subtext: true, 
            disabled: true,
            loading: true, 
            caret_false: true,caret_html:true,
            options:true,
            optionText_optionValue: true, 
            optionAttrs__object___: true, optionAttrs__function___: true,
            attrs:true,
            style:true,
            popover:true,
            popover__fitHorizontal___:true,
            placeholder:true,
            search:true,
            optionSubtext__string___:true,
            optionSubtext__function___:true,
            optionClose:true,
            optionChecked__string___:true,
            optionChecked__function___:true,
            optionBafore__string___:true,
            optionBefore__function___:true,
            optionAfter__string___:true,
            optionAfter__function___:true,
            optionDisabled__string___:true,
            optionDisabled__function___:true,
            
        },
        multiselect: {
            text:true,
            before: true,
            after: true,subtext: true, 
            disabled: true,
            loading: true, 
            caret_false: true,caret_html:true,
            options:true,
            optionText_optionValue: true, 
            optionAttrs__object___: true, optionAttrs__function___: true,
            attrs:true,
            style:true,
            popover:true,
            search:true,
            optionTagBefore__html___:true,
            optionTagBefore__function___:true,
            optionTagAfter__html___:true,
            optionTagAfter__function___:true,
            hideTags:true,
            optionTagAttrs__object___:true,
            optionTagAttrs__function___:true,
            optionCheckIcon__function___:true,
            optionCheckIcon__object___:true,
            optionSubtext__string___:true,
            optionSubtext__function___:true,
            optionBafore__string___:true,
            optionBefore__function___:true,
            optionAfter__string___:true,
            optionAfter__function___:true,
            optionDisabled__string___:true,
            optionDisabled__function___:true,
        },
        radio: {
            before: true,
            after: true,subtext: true, 
            disabled: true,
            loading: true, 
            options:true,
            optionText_optionValue: true, 
            optionAttrs__object___: true, optionAttrs__function___: true,
            attrs:true,
            optionSubtext__string___:true,
            optionSubtext__function___:true,
            optionBafore__string___:true,
            optionBefore__function___:true,
            optionAfter__string___:true,
            optionAfter__function___:true,
            optionDisabled__string___:true,
            optionDisabled__function___:true,
            optionCheckIcon__function___:true,
            optionCheckIcon__object___:true,
            set_radio_option_style__width___:true,
            multiple:true
        },
        tabs: {
            before: true,
            after: true,
            subtext: true, 
            disabled: true,
            loading: true, 
            options:true,
            optionText_optionValue: true, 
            optionAttrs__object___: true, optionAttrs__function___: true,
            attrs:true,
            optionSubtext__string___:true,
            optionSubtext__function___:true,
            optionBafore__string___:true,
            optionBefore__function___:true,
            optionAfter__string___:true,
            optionAfter__function___:true,
            optionDisabled__string___:true,
            optionDisabled__function___:true,
            optionCheckIcon__function___:true,
            optionCheckIcon__object___:true,
        },
        checkbox: {
            text:true,
            before: true,after: true,subtext: true, 
            disabled: true,
            loading: true, 
            attrs:true,
            style:true,
            checkIcon__function___:true,
            checkIcon__object___:true, 
        },
        slider:{
            start_step_end:true,
            before: true,after: true,
            disabled: true,
            loading: true, 
            attrs:true,
            style:true,
            showValue__false___:true,
            showValue__true___:true,
            showValue__inline___:true,
            lineStyle:true,
            fillStyle:true,
            pointStyle:true,
            valueStyle:true,
            min_max:true,
            multiple__slider___:true

        },
        datepicker: {
            before: true,
            after: true,
            subtext: true, 
            disabled: true,
            placeholder: true,
            loading: true, 
            caret_false: true,caret_html:true,
            attrs:true,
            popover:true,
            calendarType:true,
            unit_month:true,
            unit_hour:true,
            theme:true,
            size:true,
            startYear_endYear__number___:true,
            startYear_endYear__string___:true,
            dateDisabled__between___:true,
            dateDisabled__between_equal___:true,
            dateDisabled__between_equal___:true,
            dateDisabled__not_between___:true,
            dateDisabled__not_between_equal___:true,
            dateDisabled__equal___:true,
            dateDisabled__not_equal___:true,
            dateDisabled__greater___:true,
            dateDisabled__greater_equal___:true,
            dateDisabled__less___:true,
            dateDisabled__less_equal___:true,
            dateDisabled__weekday_equal___:true,
            dateDisabled__weekday_not_equal___:true,
            dateAttrs:true,
            remove:true,
        },
        image:{
            placeholder:true,
            before: true,
            after: true,
            subtext: true, 
            width_height:true,
            width:true,
            height:true,
            attrs:true,
            style:true,
            disabled: true,
            loading: true, 
        },
        time:{
            minute_second:true,
            hour_minute_second:true,
            year_month_day:true,
            year_month_day_hour_minute:true,
            before:true,
            after:true,
            subtext:true,
            disabled:true,
            loading:true,
            attrs:true,
            style:true
        },
        list: {},
        table: {},
        form: {},
    }
    if(!type && !prop){return dic}
    if(!prop){return dic[type]}
    return !!dic[type][prop]
}
function getPropDetails(prop,type) {
    if (prop === 'before') {//////////////////////////////////////////////////////////////////////////////// before
        return [
            { before: <Icon path={mdiAccount} size={.8} /> },
            `
before:<Icon path={mdiAccount} size={.8}/>
            `,
        ]
    }
    if (prop === 'after') {//////////////////////////////////////////////////////////////////////////////// after
        return [
            { after: <div className='after'>after</div> },
            `
after:<div className='after'>after</div>
            `,
        ]
    }
    if (prop === 'justNumber_true') {////////////////////////////////////////////////////////////////////// justNumber_true
        return [
            { justNumber: true },
            `
justNumber:true
            `
        ]
    }
    if (prop === 'justNumber_array') {////////////////////////////////////////////////////////////////////// justNumber_array
        return [
            { justNumber: ['-'] },
            `
justNumber:['-']
            `
        ]
    }
    if (prop === 'text') {/////////////////////////////////////////////////////////////////////////////// text
        let footer = type === 'multiselect'?'':
            `
text: 'this is my text'
            `
        return [
            { text: 'this is my text' },
            footer    
        ]
    }
    if (prop === 'subtext') {/////////////////////////////////////////////////////////////////////////////// subtext
        return [
            { 
                text:'my text',
                subtext: 'my subtext' 
            },
            `
text:'my text',
subtext:'my subtext'
            `
        ]
    }
    if (prop === 'maxLength') {//////////////////////////////////////////////////////////////////////////// maxLength
        return [
            { maxLength: 5 },
            `
maxLength:5
            `
        ]
    }
    if (prop === 'filter') {/////////////////////////////////////////////////////////////////////////////// filter
        return [
            { filter: ['a', 'b', 'c'] },
            `
filter:['a','b','c']
            `
        ]
    }
    if (prop === 'placeholder') {////////////////////////////////////////////////////////////////////////// placeholder
        return [
            { placeholder: 'my placeholder' },
            `
placeholder : 'my placeholder'
            `
        ]
    }
    if (prop === 'disabled') {////////////////////////////////////////////////////////////////////////////// disabled
        return [
            { disabled: true },
            `
disabled:true
            `
        ]
    }
    if (prop === 'inputAttrs_style') {//////////////////////////////////////////////////////////////////// inputAttrs_style
        return [
            { inputAttrs: { style: { letterSpacing: 16 } } },
            `
inputAttrs:{style:{letterSpacing: 16}}
            `
        ]
    }
    if (prop === 'justify') {///////////////////////////////////////////////////////////////////////////// justify
        return [
            { justify: true },
            `
justify:true
            `
        ]
    }
    if (prop === 'loading') {///////////////////////////////////////////////////////////////////////////// loading
        return [
            { loading: true },
            `
loading:true
            `
        ]
    }
    if (prop === 'options') {///////////////////////////////////////////////////////////////////////////// options
        return [
            { 
                options: DOC_options,
                optionText:'option.name',
                optionValue:'option.id' 
            },
            DOC_options_code
        ]
    }
    if (prop === 'optionText_optionValue') {////////////////////////////////////////////////////////////// optionText_optionValue
        return [
            { options: DOC_options, optionText: 'option.name',optionValue:'option.id' },
            DOC_options_code
        ]
    }
    if (prop === 'options__number___') {///////////////////////////////////////////////////////////////////////////// options
        return [
            { 
                options: [
                    {Value:1235,id:'1235'},
                    {Value:13454,id:'13454'},
                    {Value:112433,id:'112433'},
                    {Value:112223,id:'112223'},
                    {Value:12223,id:'12223'}
                ],
                optionText:'option.Value',
                optionValue:'option.id',
            },
            `
options: [
    {Value:1235,id:'1235'},
    {Value:13454,id:'13454'},
    {Value:112433,id:'112433'},
    {Value:112223,id:'112223'},
    {Value:12223,id:'12223'}
],
optionText:'option.Value',
optionValue:'option.id',
            `
        ]
    }
    if (prop === 'optionText_optionValue__number___') {////////////////////////////////////////////////////////////// optionText_optionValue
        return [
            { 
                options: [
                    {Value:1235,id:'1235'},
                    {Value:13454,id:'13454'},
                    {Value:112433,id:'112433'},
                    {Value:112223,id:'112223'},
                    {Value:12223,id:'12223'}
                ],
                optionText:'option.Value',
                optionValue:'option.id',
            },
            `
options: [
    {Value:1235,id:'1235'},
    {Value:13454,id:'13454'},
    {Value:112433,id:'112433'},
    {Value:112223,id:'112223'},
    {Value:12223,id:'12223'}
],
optionText:'option.Value',
optionValue:'option.id',
            `
        ]
    }
    if (prop === 'optionAttrs__object___') {
        return [
            {
                options: DOC_options,
                optionText:'option.name',
                optionValue:'option.id',
                optionAttrs: { style: { background: 'pink' } }
            },
            `
optionAttrs:{style:{background:'pink'}}
            `
        ]
    }
    if (prop === 'set_radio_option_style__width___') {
        return [
            {
                options: DOC_options,
                optionText:'option.name',
                optionValue:'option.id',
                optionAttrs: { style: { width: '100%' } }
            },
            `
optionAttrs: { style: { width: '100%' } }
            `
        ]
    }
    if (prop === 'optionAttrs__function___') {
        return [
            {
                options: DOC_options,
                optionText:'option.name',
                optionValue:'option.id',
                optionAttrs: (option) => {
                    if (option.name === 'stephan') {
                        return { style: { background: 'pink' } }
                    }
                }
            },
            `
optionAttrs:(option)=>{
    if(option.name === 'stephan'){
        return {style:{background:'pink'}}
    }
}
            `
        ]
    }
    if (prop === 'caret_false') {
        if(type === 'datepicker'){
            return [
                {
                    caret: false
                },
                `
caret:false
                `
            ]
        }
        return [
            {
                options: DOC_options,
                optionText:'option.name',
                optionValue:'option.id',
                caret: false
            },
            `
caret:false
        `
        ]
    }
    if (prop === 'caret_html') {
        if(type === 'datepicker'){
            return [
                {
                    caret: <Icon path={mdiChevronDoubleDown} size={.7}/>
                },
                `
caret:<Icon path={mdiChevronDoubleDown} size={.7}/>
                `
            ]
        }
        return [
            {
                options: DOC_options,
                optionText:'option.name',
                optionValue:'option.id',
                caret: <Icon path={mdiChevronDoubleDown} size={.7} />
            },
            `
caret:<Icon path={mdiChevronDoubleDown} size={.7}/>
        `
        ]
    }
    if (prop === 'swip') {
        return [
            {swip:true},
            `
swip:true
            `
        ]
    }
    if (prop === 'visible') {
        return [
            {visible:true},
            `
visible:true
            `
        ]
    }
    if (prop === 'options__type_color___') {
        return [
            {options:['#ff0000','#00ff00','#0000ff','#ffff00','#00ffff','#ffffff','#000000']},
            `
options:['#ff0000','#00ff00','#0000ff','#ffff00','#00ffff','#ffffff','#000000']
            `
        ]
    }
    if (prop === 'attrs') {
        return [
            {attrs:{style:{boxShadow:'0 0 12px 2px lightblue'}}},
            `
attrs:{style:{boxShadow:'0 0 12px 2px lightblue'}}
            `
        ]
    }
    if (prop === 'style') {
        return [
            {style:{boxShadow:'0 0 12px 2px lightblue'}},
            `
style:{boxShadow:'0 0 12px 2px lightblue'}
            `
        ]
    }
    if (prop === 'popover') {///////////////////////////////////////////////////////////////////////////////////// popover
        if(type === 'datepicker'){
            return [
                { 
                    popover:{
                        position:'center',
                        backdrop:{
                            attrs:{
                                style:{
                                    background:'rgba(0,0,0,0.8)'
                                }
                            }
                        },
                    }
                },
                `
    popover:{
        position:'center',
        backdrop:{
            attrs:{
                style:{
                    background:'rgba(0,0,0,0.8)'
                }
            }
        },
    }
                `
            ]
        }
        return [
            { 
                options:DOC_options,
                optionText:'option.name',
                optionValue:'option.id',
                popover:{
                    position:'center',
                    backdrop:{
                        attrs:{
                            style:{
                                background:'rgba(0,0,0,0.8)'
                            }
                        }
                    },
                }
            },
            `
${type === 'select' || type === 'multiselect'?'':DOC_options_code}
popover:{
    position:'center',
    backdrop:{
        attrs:{
            style:{
                background:'rgba(0,0,0,0.8)'
            }
        }
    },
}
            `
        ]
    }
    if (prop === 'popover__fitHorizontal___') {///////////////////////////////////////////////////////////////////////////////////// popover__fitHorizontal___
        return [
            { 
                options: DOC_options,
                optionText:'option.name',
                optionValue:'option.id',
                popover:{
                    fitHorizontal:true
                }
            },
            `
${DOC_options_code}
popover:{
    fitHorizontal:true
}
            `
        ]
    }
    if (prop === 'multiple__file___') {
        return [
            {multiple:true},
            `
multiple:true
            `
        ]
    }
    if (prop === 'value__multiple_file___') {
        return [
            {multiple:true},
            `
value:[
    {
        name:'this is my file name',
        size:12334443,
        url:'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg'
    }
],
multiple:true
            `
        ]
    }
    if (prop === 'value__single_file___') {
        return [
            {},
            `
value : {
    name:'this is my file name',
    size:12334443,
    url:'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg'
}
            `
        ]
    }
    if (prop === 'search') {
        return [
            {search:false},
            `
search:false
            `
        ]
    }
    if (prop === 'optionTagBefore__html___') {
        return [
            {optionTagBefore:<Icon path={mdiAccount} size={.6}/>},
            `
optionTagBefore:<Icon path={mdiAccount} size={.6}/>
            `
        ]
    }
    if (prop === 'optionTagBefore__function___') {
        return [
            {optionTagBefore:(option)=><Icon path={mdiAccount} size={.6}/>},
            `
optionTagBefore:(option)=><Icon path={mdiAccount} size={.6}/>
            `
        ]
    }
    if (prop === 'optionTagAfter__html___') {
        return [
            {optionTagAfter:'TM'},
            `
optionTagAfter:'TM'
            `
        ]
    }
    if (prop === 'optionTagAfter__function___') {
        return [
            {optionTagAfter:(option)=>option.id},
            `
optionTagAfter:(option)=>option.id
            `
        ]
    }
    if (prop === 'hideTags') {
        return [
            {hideTags:true},
            `
hideTags:true
            `
        ]
    }
    if (prop === 'optionTagAttrs__object___') {
        return [
            {optionTagAttrs:{style:{background:'red'}}},
            `
optionTagAttrs:{style:{background:'red'}}
            `
        ]
    }
    if (prop === 'optionTagAttrs__function___') {
        return [
            {
                optionTagAttrs:(option)=>{
                    if(option.name === 'luis'){
                        return {style:{background:'red'}}
                    }
                }
            },
            `
optionTagAttrs:(option)=>{
    if(option.name === 'luis'){
        return {style:{background:'red'}}
    }
}
            `
        ]
    }
    if (prop === 'optionCheckIcon__function___') {
        return [
            {
                optionCheckIcon:(checked)=>{
                    return <Icon path={checked?mdiCheckboxOutline:mdiCheckboxBlankOutline} size={0.9}/>
                }
            },
            `
optionCheckIcon:(checked)=>{
    let path = checked?mdiCheckboxOutline:mdiCheckboxBlankOutline
    return <Icon path={path} size={0.9}/>
}
            `
        ]
    }
    if (prop === 'optionCheckIcon__object___') {
        return [
            {
                optionCheckIcon:{
                    width:12,
                    height:12,
                    padding:2,
                    borderColor:'#aaa',
                    background:'orange',
                    borderRadius:1
                }
            },
            `
optionCheckIcon:{
    width:12,
    height:12,
    padding:2,
    borderColor:'#aaa',
    background:'orange',
    borderRadius:1
}
            `
        ]
    }
    if (prop === 'optionSubtext__string___') {
        return [
            {optionSubtext:'option.gender',options:DOC_options,optionText:'option.name',optionValue:'option.id'},
            `
optionSubtext:'option.gender'
            `
        ]
    }
    if (prop === 'optionSubtext__function___') {
        return [
            {optionSubtext:(option)=>option.gender,options:DOC_options,optionText:'option.name',optionValue:'option.id'},
            `
optionSubtext:(option)=>option.gender
            `
        ]
    }
    if (prop === 'optionClose') {
        return [
            {optionClose:false},
            `
optionClose:false
            `
        ]
    }
    if (prop === 'optionChecked__string___') {
        return [
            {optionChecked:'option.id === props.value'},
            `
optionChecked:'option.id === props.value'
            `
        ]
    }
    if (prop === 'optionChecked__function___') {
        return [
            {optionChecked:(option,props)=>option.id === props.value},
            `
optionChecked:(option,props)=>option.id === prop.value
            `
        ]
    }
    if (prop === 'optionBafore__string___') {
        return [
            {optionBefore:'option.gender === "male"?"M":"F"',options:DOC_options,optionText:'option.name',optionValue:'option.id'},
            `
optionBefore:'option.gender === "male"?"M":"F"'
            `
        ]
    }
    if (prop === 'optionBefore__function___') {
        return [
            {optionBefore:(option)=><Icon path={option.gender === 'male'?mdiGenderMale:mdiGenderFemale} size={.8}/>,options:DOC_options,optionText:'option.name',optionValue:'option.id'},
            `
optionBefore:(option)=><Icon path={option.gender === 'male'?mdiGenderMale:mdiGenderFemale} size={.8}/>
            `
        ]
    }
    if (prop === 'optionAfter__string___') {
        return [
            {
                optionAfter:'option.gender',
                options:DOC_options,
                optionText:'option.name',
                optionValue:'option.id'
            },
            `
optionAfter:'option.gender'
            `
        ]
    }
    if (prop === 'optionAfter__function___') {
        return [
            {
                optionAfter:(option)=>option.gender,
                options:DOC_options,
                optionText:'option.name',
                optionValue:'option.id'
            },
            `
optionAfter:(option)=>option.gender,
            `
        ]
    }
    if (prop === 'optionDisabled__string___') {
        return [
            {
                optionDisabled:'option.id === "2"',
                options:DOC_options,
                optionText:'option.name',
                optionValue:'option.id'
            },
            `
optionDisabled:'option.id === "2"'
            `
        ]
    }
    if (prop === 'optionDisabled__function___') {
        return [
            {
                optionDisabled:(option)=>option.id === '2',
                options:DOC_options,
                optionText:'option.name',
                optionValue:'option.id'
            },
            `
optionDisabled:(option)=>option.id === '2'
            `
        ]
    }
    if (prop === 'multiple') {
        return [
            {multiple:true},
            `
multiple:true
            `
        ]
    }
    if (prop === 'checkIcon__function___') {
        return [
            {
                checkIcon:(checked)=>{
                    return <Icon path={checked?mdiCheckboxOutline:mdiCheckboxBlankOutline} size={0.9}/>
                }
            },
            `
checkIcon:(checked)=>{
    let path = checked?mdiCheckboxOutline:mdiCheckboxBlankOutline
    return <Icon path={path} size={0.9}/>
}
            `
        ]
    }
    if (prop === 'checkIcon__object___') {
        return [
            {
                checkIcon:{
                    width:12,
                    height:12,
                    padding:2,
                    borderColor:'#aaa',
                    background:'orange',
                    borderRadius:1
                }
            },
            `
checkIcon:{
    width:12,
    height:12,
    padding:2,
    borderColor:'#aaa',
    background:'orange',
    borderRadius:1
}
            `
        ]
    }
    if (prop === 'start_step_end') {
        return [
            {start:20,step:1,end:240},
            `
start:20,step:1,end:240
            `
        ]
    }
    if (prop === 'showValue__false___') {
        return [
            {showValue:false},
            `
showValue:false
            `
        ]
    }
    if (prop === 'showValue__true___') {
        return [
            {showValue:true},
            `
showValue:true
            `
        ]
    }
    if (prop === 'showValue__inline___') {
        return [
            {showValue:'inline'},
            `
showValue:'inline'
            `
        ]
    }
    if (prop === 'lineStyle') {
        return [
            {lineStyle:{height:5,background:'lightblue'}},
            `
lineStyle:{height:5,background:'lightblue'}
            `
        ]
    }
    if (prop === 'fillStyle') {
        return [
            {fillStyle:{height:5,background:'orange'}},
            `
fillStyle:{height:5,background:'orange'}
            `
        ]
    }
    if (prop === 'valueStyle') {
        return [
            {valueStyle:{background:'pink'}},
            `
valueStyle:{background:'pink'}
            `
        ]
    }
    if (prop === 'pointStyle') {
        return [
            {pointStyle:{background:'green'},showValue:true},
            `
pointStyle:{background:'green'},showValue:true
            `
        ]
    }
    if (prop === 'min_max') {
        return [
            {min:60,max:220},
            `
min:60,max:220
            `
        ]
    }
    if (prop === 'multiple__slider___') {
        return [
            {multiple:true},
            `
multiple:true,value:[100,200]
            `
        ]
    }
    if (prop === 'width_height') {
        return [
            {
                width:100,height:100,
            },
            `
width:100,
height:100,
            `
        ]
    }
    if (prop === 'width') {
        return [
            {
                width:'50%'
            },
            `
width:'50%',
            `
        ]
    }
    if (prop === 'height') {
        return [
            {
                height:240
            },
            `
height:240,
            `
        ]
    }
    if (prop === 'minute_second') {
        return [
            {},
            `
value:{minute:10,second:0}
            `
        ]
    }
    if (prop === 'hour_minute_second') {
        return [
            {},
            `
value:{hour:3,minute:12,second:30}
            `
        ]
    }
    if (prop === 'year_month_day') {
        return [
            {},
            `
value:{year:2022,month:6,day:25},
            `
        ]
    }
    if (prop === 'year_month_day_hour_minute') {
        return [
            {},
            `
value:{year:2022,month:6,day:25,hour:12,minute:30}
            `
        ]
    }
    if (prop === 'calendarType') {
        return [
            {calendarType:'jalali'},
            `
calendarType:'jalali'
            `
        ]
    }
    if (prop === 'unit_month') {
        return [
            {unit:'month'},
            `
unit:'month'
            `
        ]
    }
    if (prop === 'unit_hour') {
        return [
            {unit:'hour'},
            `
unit:'hour'
            `
        ]
    }
    if (prop === 'theme') {
        return [
            {theme:['#add8e6','#777']},
            `
theme:['#add8e6','#777']
            `
        ]
    }
    if (prop === 'size') {
        return [
            {size:100},
            `
size:100
            `
        ]
    }
    if (prop === 'startYear_endYear__number___') {
        return [
            {startYear:2012,endYear:2030},
            `
startYear:2012,endYear:2030
            `
        ]
    }
    if (prop === 'startYear_endYear__string___') {
        return [
            {startYear:'-10',endYear:'+5'},
            `
startYear:'-10',endYear:'+5'
            `
        ]
    }
    if (prop === 'dateDisabled__between___') {
        return [
            {dateDisabled:['<>,2022,2024']},
            `
dateDisabled:['<>,2022,2024']
            `
        ]
    }
    if (prop === 'dateDisabled__between_equal___') {
        return [
            {dateDisabled:['<=>,2022,2024']},
            `
dateDisabled:['<=>,2022,2024']
            `
        ]
    }
    if (prop === 'dateDisabled__not_between___') {
        return [
            {dateDisabled:['!<>,2022,2024']},
            `
dateDisabled:['!<>,2022,2024']
            `
        ]
    }
    if (prop === 'dateDisabled__not_between_equal___') {
        return [
            {dateDisabled:['!<=>,2022,2024']},
            `
dateDisabled:['!<=>,2022,2024']
            `
        ]
    }
    if (prop === 'dateDisabled__equal___') {
        return [
            {dateDisabled:['=,2022/4/5,2022/6/7,2022/8/12']},
            `
dateDisabled:['=,2022/4/5,2022/6/7,2022/8/12']
            `
        ]
    }
    if (prop === 'dateDisabled__not_equal___') {
        return [
            {dateDisabled:['!=,2022/4/5']},
            `
dateDisabled:['!=,2022/4/5']
            `
        ]
    }
    if (prop === 'dateDisabled__greater___') {
        return [
            {dateDisabled:['>,2022/4/5']},
            `
dateDisabled:['>,2022/4/5']
            `
        ]
    }
    if (prop === 'dateDisabled__greater_equal___') {
        return [
            {dateDisabled:['>=,2022/4/5']},
            `
dateDisabled:['>=,2022/4/5']
            `
        ]
    }
    if (prop === 'dateDisabled__less___') {
        return [
            {dateDisabled:['<,2022/4/5']},
            `
dateDisabled:['<,2022/4/5']
            `
        ]
    }
    if (prop === 'dateDisabled__less_equal___') {
        return [
            {dateDisabled:['<=,2022/4/5']},
            `
dateDisabled:['<=,2022/4/5']
            `
        ]
    }
    if (prop === 'dateDisabled__weekday_equal___') {
        return [
            {dateDisabled:['w,6,4']},
            `
dateDisabled:['w,6,4']
            `
        ]
    }
    if (prop === 'dateDisabled__weekday_not_equal___') {
        return [
            {dateDisabled:['!w,6']},
            `
dateDisabled:['!w,6']
            `
        ]
    }
    if (prop === 'dateAttrs') {
        return [
            {
                dateAttrs:({isMatch,isActive,isToday})=>{
                    if(isActive){
                        return {
                            style:{
                                background:'dodgerblue',
                                color:'#fff' 
                            }
                        }
                    }
                    if(isToday){
                        return {
                            style:{
                                color:'red',fontSize:14,fontWeight:'bold',border:'1px solid',borderRadius:'100%'
                            }
                        }
                    }
                    let matchers = [
                        '<>,2022/4/5,2022/4/18'
                    ];
                    if(isMatch(matchers)){
                        return {
                            style:{
                                background:'orange'
                            }
                        }
                    }
                }
            },
            `
dateAttrs:({isMatch,isActive,isToday})=>{
    if(isActive){
        return {
            style:{
                background:'dodgerblue',
                color:'#fff' 
            }
        }
    }
    if(isToday){
        return {
            style:{
                color:'red',fontSize:14,fontWeight:'bold',border:'1px solid',borderRadius:'100%'
            }
        }
    }
    let matchers = [
        '<>,2022/4/5,2022/4/18'
    ];
    if(isMatch(matchers)){
        return {
            style:{
                background:'orange'
            }
        }
    }
}
            `
        ]
    }
    if (prop === 'remove') {
        return [
            {remove:true},
            `
remove:true
            `
        ]
    }
    if (prop === '') {
        return [
            {},
            `

            `
        ]
    }
    if (prop === '') {
        return [
            {},
            `

            `
        ]
    }
    
}

function getNavItems(items){
    return items.map((o)=>{
        return { 
            text: `${!!o.type?`type:${o.type}`:''} ${!!o.prop?`prop:${o.prop}`:''}`, 
            id: o.type + o.prop, 
            render: () => <AIOINPUT key={o.type + o.prop} {...{...o,initModel:o.model}}/> 
        }
    })
}
function getInputObjects(type, prop,allInputProps,allInputFooters) {
    let types = Object.keys(e_exist());
    let res = []
    for (let i = 0; i < types.length; i++) {
        let t = types[i];
        if (type && t !== type) { continue }
        let props = Object.keys(e_exist(t))
        for (let j = 0; j < props.length; j++) {
            let p = props[j];
            if (prop && p !== prop) { continue }
            if (!e_exist(t, p)) { continue }
            res.push(getInput(t, p,!type?t:undefined,allInputProps,allInputFooters));
        }
    }
    return res;
}
function Code({code}){
    let [show,setShow] = useState(false);
    return (
        <RVD
            rootNode={{
                column:[
                    {size:6},
                    {html:<div>{show?'hide code':'show code'}</div>,className:'fs-10 bold',style:{color:show?'red':'blue'},onClick:()=>setShow(!show)},
                    {show:!!show,html:()=>AIODoc().Code(code),className:'m-b-12'},
                    {size:12}
                ]
            }}
        />
    )
} 

function getPropLabel(prop){
    return `${prop.replaceAll('___',' ) ').replaceAll('__',' ( ').replaceAll('_',' ')}`;
}
function getInput(type, prop,Label,allInputProps,allInputFooters) {
    let input = { type }
    let footer = `type:"${type}",`
    if(allInputFooters){footer += allInputFooters;}
    let [propValue, footerValue] = getPropDetails(prop,type)
    for (let p in propValue) {input[p] = propValue[p];}
    for (let p in allInputProps) {input[p] = allInputProps[p];}
    let label = Label?Label:getPropLabel(prop,type);
    if(footer.indexOf(footerValue) === -1){footer += footerValue;}
    return { input, field: `value.${prop}`, footer: <Code code={footer}/>,label }
}
function AIOINPUT({type,prop,initModel = {},allInputProps,allInputFooters,description}) {
    let [model,setModel] = useState(initModel);
    let [tabs] = useState([
        {value:'ex',text:'Examples'},
        {value:'desc',text:'Description'},
    ])
    let [tab,setTab] = useState('ex')
    let [inputs,setInputs] = useState(getInputObjects(type,prop,allInputProps,allInputFooters))
    function preview() {
        return (
            <div className='example' style={{padding:0}}>
                <RVD
                    rootNode={{
                        className:'h-100',
                        column:[
                            {html:<AIOInput type='tabs' options={tabs} value={tab} onChange={(v)=>setTab(v)} attrs={{style:{background:'#eee'}}}/>},
                            {
                                flex:1,
                                show:tab === 'ex',
                                html:(
                                    <AIOInput 
                                        type='form' 
                                        inputs={{ column: inputs }} 
                                        value={{...model}} 
                                        onChange={(newModel) => setModel({...newModel})} 
                                        labelAttrs={{style:{fontSize:14,fontWeight:'bold'}}}
                                    />
                                )
                            },
                            {flex:1,show:tab === 'desc',html:(description),style:{flexDirection:'column'},className:'ofy-auto'}
                        ]
                    }}
                />
            </div>
        )
    }
    return (<Example preview={() => preview()} />)
}
class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'preview',
            tabs: [
                { text: 'Preview', value: 'preview' },
                { text: 'Code', value: 'code' }
            ]
        }
    }
    body_layout() {
        let { tab } = this.state;
        return tab === 'preview' ? this.preview_layout() : this.code_layout()
    }
    preview_layout() {
        let { preview } = this.props;
        return {
            flex: 1,
            className: 'p-12',
            html: preview()
        }
    }
    code_layout() {
        let { code, rtl = false } = this.props;
        return {
            flex: 1,
            html: (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'auto' }}>
                    <pre style={{ padding: 12 }}>{AIODoc().Code(code())}</pre>
                </div>
            )
        }
    }
    toolbar_layout() {
        let { toolbar } = this.props;
        if (!toolbar) { return false }
        return {
            html: toolbar()
        }
    }
    render() {
        return (
            <RVD
            rootNode={{
                    column: [
                        this.toolbar_layout(),
                        this.body_layout()
                    ]
                }}
            />
        )
    }
}