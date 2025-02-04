import { FC } from "react";
import DOC from "../../resuse-components/doc";
import { I_formNode, useForm } from "../../npm/aio-input";
import { Code } from "../../npm/aio-components";
import { name } from "agenda/dist/agenda/name";

export default function DOC_UseForm(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items: () => [
                    { text: 'basic', id: 'basic', render: () => <Basic /> },
                    { text: 'getLayout', id: 'getLayout', render: () => <GetLayout /> },
                    { text: 'required', id: 'required', render: () => <Required /> },
                    { text: 'validate', id: 'validate', render: () => <Validate /> },
                    { text: 'dynamic', id: 'dynamic', render: () => <Dynamic /> },
                    { text: 'reset', id: 'reset', render: () => <Reset /> },
                    { text: 'complex layout', id: 'complex layout', render: () => <ComplexLayput /> },
                    { text: 'nested', id: 'nested', render: () => <Nested /> },
                    {
                        text: 'validate', id: 'validate',
                        items: [
                            { text: 'email', id: 'validateemail', render: () => <ValidateEmail /> },
                            { text: 'ir mobile', id: 'validateirmobile', render: () => <ValidateIrMobile /> },
                            { text: 'ir national code', id: 'validateirnationalcode', render: () => <ValidateIrNationalCode /> }
                        ]
                    },
                    { text: 'visibility', id: 'visibility', render: () => <Visibility /> },

                ]
            }}
        />
    )
}
type I_form = {
    name: string,
    email: string,
    password: string,
}
type I_form_2 = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}
type I_form_3 = {
    name: string,
    acounts: {
        emali: string,
        github: string
    }
}
type I_form_4 = {
    name: string,
    mobile: string
}
type I_form_5 = {
    name: string,
    nationalCode: string
}
const Basic: FC = () => {
    const form = useForm<I_form>({
        initData: {},
        onSubmit: (data) => {
            console.log(data)
        },
        getLayout: ({ renderSubmitButton }) => {
            return {
                v: [
                    { input: { type: 'text', field: 'name', label: 'Name' } },
                    { input: { type: 'text', field: 'email', label: 'Email' } },
                    { input: { type: 'password', field: 'password', label: 'Password' } },
                    {
                        className: 'p-v-12-',
                        h: [
                            { html: renderSubmitButton('Submit') }
                        ]
                    }
                ]
            }
        }
    })
    return (
        <div className="example">
            {form.renderLayout}
            {Code(`
type I_form = {
    name:string,
    email:string,
    password:string,
}
const Basic:FC = ()=>{
    const form = useForm<I_form>({
        initData:{
            name:'',
            email:'',
            password:'',
        },
        onSubmit:(data)=>{
            console.log(data)
        },
        getLayout:({renderSubmitButton})=>{
            return {
                v:[
                    {input:{type:'text',field:'name',label:'Name'}},
                    {input:{type:'text',field:'email',label:'Email'}},
                    {input:{type:'password',field:'password',label:'Password'}},
                    {
                        className:'p-v-12-',
                        h:[
                            {html:renderSubmitButton('Submit')}
                        ]
                    }
                ]
            }
        }
    })
    return (
        <>
            {form.renderLayout}
        </>
    )
}
            `)}
        </div>
    )
}
const GetLayout: FC = () => {
    const form = useForm<I_form>({
        initData: {
            name: '',
            email: '',
            password: '',
        },
        onSubmit: (data) => {
            console.log(data)
        },
        getLayout: ({ renderSubmitButton }) => {
            return {
                v: [
                    {
                        h: [
                            { input: { type: 'text', field: 'name', label: 'Name' } },
                            { input: { type: 'text', field: 'email', label: 'Email' } },
                        ]
                    },
                    {
                        h: [
                            { input: { type: 'password', field: 'password', label: 'Password' } },
                        ]
                    },
                    {
                        className: 'p-v-12-',
                        h: [
                            { html: renderSubmitButton('Submit') }
                        ]
                    }
                ]
            }
        }
    })
    return (
        <div className="example">
            {form.renderLayout}
            {Code(`
type I_form = {
    name:string,
    email:string,
    password:string,
}
const GetLayout:FC = ()=>{
    const form = useForm<I_form>({
        initData:{
            name:'',
            email:'',
            password:'',
        },
        onSubmit:(data)=>{
            console.log(data)
        },
        getLayout:({renderSubmitButton})=>{
            return {
                v:[
                    {
                        h:[
                            {input:{type:'text',field:'name',label:'Name'}},
                            {input:{type:'text',field:'email',label:'Email'}},
                        ]
                    },
                    {
                        h:[
                            {input:{type:'password',field:'password',label:'Password'}},
                        ]
                    },
                    {
                        className:'p-v-12-',
                        h:[
                            {html:renderSubmitButton('Submit')}
                        ]
                    }
                ]
            }
        }
    })
    return (
        <>
            {form.renderLayout}
        </>
    )
}    
            `)}
        </div>
    )
}
const Required: FC = () => {
    const form = useForm<I_form>({
        initData: {
            name: '',
            email: '',
            password: '',
        },
        onSubmit: (data) => {
            console.log(data)
        },
        getLayout: ({ renderSubmitButton }) => {
            return {
                v: [
                    { input: { type: 'text', field: 'name', label: 'Name' } },
                    { input: { type: 'text', field: 'email', label: 'Email', required: false } },
                    { input: { type: 'password', field: 'password', label: 'Password' } },
                    {
                        className: 'p-v-12-',
                        h: [
                            { html: renderSubmitButton('Submit') }
                        ]
                    }
                ]
            }
        }
    })
    return (
        <div className="example">
            {form.renderLayout}
            {Code(`
type I_form = {
    name:string,
    email:string,
    password:string,
}
const Basic:FC = ()=>{
    const form = useForm<I_form>({
        initData:{
            name:'',
            email:'',
            password:'',
        },
        onSubmit:(data)=>{
            console.log(data)
        },
        getLayout:({renderSubmitButton})=>{
            return {
                v:[
                    {input:{type:'text',field:'name',label:'Name'}},
                    {input:{type:'text',field:'email',label:'Email',required:false}},
                    {input:{type:'password',field:'password',label:'Password'}},
                    {
                        className:'p-v-12-',
                        h:[
                            {html:renderSubmitButton('Submit')}
                        ]
                    }
                ]
            }
        }
    })
    return (
        <>
            {form.renderLayout}
        </>
    )
}
            `)}
        </div>
    )
}
const Validate: FC = () => {
    const form = useForm<I_form_2>({
        initData: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        onSubmit: (data) => {
            console.log(data)
        },
        getLayout: ({ renderSubmitButton }) => {
            return {
                v: [
                    { input: { type: 'text', field: 'name', label: 'Name' } },
                    { input: { type: 'text', field: 'email', label: 'Email' } },
                    { input: { type: 'password', field: 'password', label: 'Password' } },
                    {
                        input: {
                            type: 'password', field: 'confirmPassword', label: 'Confirm Password',
                            validate: ({ data, value }) => {
                                if (data.password !== value) { return 'password and confirm password should be same' }
                            }
                        }
                    },
                    {
                        className: 'p-v-12-',
                        h: [
                            { html: renderSubmitButton('Submit') }
                        ]
                    }
                ]
            }
        }
    })
    return (
        <div className="example">
            {form.renderLayout}
            {Code(`
type I_form = {
    name:string,
    email:string,
    password:string,
    confirmPassword:string
}
const Validate:FC = ()=>{
    const form = useForm<I_form>({
        initData:{
            name:'',
            email:'',
            password:'',
            confirmPassword:'',
        },
        onSubmit:(data)=>{
            console.log(data)
        },
        getLayout:({renderSubmitButton})=>{
            return {
                v:[
                    {input:{type:'text',field:'name',label:'Name'}},
                    {input:{type:'text',field:'email',label:'Email'}},
                    {input:{type:'password',field:'password',label:'Password'}},
                    {
                        input:{
                            type:'password',field:'confirmPassword',label:'Confirm Password',
                            validate:({data,value})=>{
                                if(data.password !== value){return 'password and confirm password should be same'}
                            }
                        }
                    },
                    {
                        className:'p-v-12-',
                        h:[
                            {html:renderSubmitButton('Submit')}
                        ]
                    }
                ]
            }
        }
    })
    return (
        <>
            {form.renderLayout}
        </>
    )
}    
            `)}
        </div>
    )
}
const Dynamic: FC = () => {
    const form = useForm<I_form>({
        initData: {
            name: '',
            email: '',
            password: '',
        },
        onSubmit: (data) => {
            console.log(data)
        },
        getLayout: ({ getData, renderSubmitButton }) => {
            return {
                v: [
                    {
                        h: [
                            { input: { type: 'text', field: 'name', label: 'Name' } },
                            { input: { type: 'text', field: 'email', label: 'Email', disabled: getData().name === 'mohammad' } },
                        ]
                    },
                    {
                        style: { display: 'flex', justifyContent: 'center', marginTop: 24 },
                        h: [
                            {
                                html: 'Please inter your password'
                            }
                        ],
                    },
                    {
                        h: [
                            { input: { type: 'password', field: 'password', label: 'Password' } }
                        ]
                    },
                    {
                        className: 'p-v-12-',
                        h: [
                            { html: renderSubmitButton('Submit') }
                        ]
                    }
                ]
            }
        }
    })
    return (
        <div className="example">
            {form.renderLayout}
            {Code(`
const Dynamic:FC = ()=>{
    const form = useForm<I_form>({
        initData:()=>({
            name:'',
            email:'',
            password:'',
        }),
        onSubmit:(data)=>{
            console.log(data)
        },
        getLayout:({getData,renderSubmitButton})=>{
            return {
                v:[
                    {
                        h:[
                            {input:{type:'text',field:'name',label:'Name'}},
                            {input:{type:'text',field:'email',label:'Email',disabled:getData().name === 'mohammad'}},
                        ]
                    },
                    {
                        style:{display:'flex',justifyContent:'center',marginTop:24},
                        h:[
                            {
                                html:'Please inter your password'
                            }
                        ],
                    },
                    {
                        h:[
                            {input:{type:'password',field:'password',label:'Password'}}
                        ]
                    },
                    {
                        className:'p-v-12-',
                        h:[
                            {html:renderSubmitButton('Submit')}
                        ]
                    }
                ]
            }
        }
    })
    return (
        <>
            {form.renderLayout}
        </>
    )
}    
            `)}
        </div>
    )
}
const Reset: FC = () => {
    const form = useForm<I_form>({
        initData: {
            name: '',
            email: '',
            password: ''
        },
        onSubmit: (data) => {
            console.log(data)
        },
        getLayout: ({ renderSubmitButton, reset }) => {
            return {
                v: [
                    { input: { type: 'text', field: 'name', label: 'Name' } },
                    { input: { type: 'text', field: 'email', label: 'Email' } },
                    { input: { type: 'password', field: 'password', label: 'Password' } },
                    {
                        className: 'p-v-12-',
                        h: [
                            { html: renderSubmitButton('Submit'), id: 'msf' },
                            { html: <button type='button' onClick={() => reset()}>Reset</button> },
                        ]
                    }
                ]
            }
        }
    })
    return (
        <div className="example">
            {form.renderLayout}
            {Code(`
type I_form = {
    name:string,
    email:string,
    password:string,
}
const Basic:FC = ()=>{
    const form = useForm<I_form>({
        initData:{
            name:'',
            email:'',
            password:'',
        },
        onSubmit:(data)=>{
            console.log(data)
        },
        getLayout:({renderSubmitButton,reset})=>{
            return {
                v:[
                    {input:{type:'text',field:'name',label:'Name'}},
                    {input:{type:'text',field:'email',label:'Email'}},
                    {input:{type:'password',field:'password',label:'Password'}},
                    {
                        className:'p-v-12-',
                        h:[
                            {html:renderSubmitButton('Submit')},
                            {html:<button onClick={()=>reset()}>Reset</button>},
                        ]
                    }
                ]
            }
        }
    })
    return (
        <>
            {form.renderLayout}
        </>
    )
}
            `)}
        </div>
    )
}
const ComplexLayput: FC = () => {
    const form = useForm<I_form>({
        initData: {
            name: '',
            email: '',
            password: '',
        },
        onSubmit: (data) => {
            console.log(data)
        },
        getLayout: () => {
            return {
                style: { background: '#eee' },
                v: [
                    { style: { background: '#fff' }, size: 100, html: 'a' },
                    {
                        h: [
                            { style: { background: '#fff' }, size: 100, html: 'b' },
                            {
                                v: [
                                    { style: { background: '#fff' }, size: 100, align: 'vh', html: 'c' },
                                    {
                                        size: 100,
                                        h: [
                                            { style: { background: '#fff' }, size: 100, html: 'd' },
                                            { style: { background: '#fff' }, flex: 1, align: 'h', html: 'e' }
                                        ]
                                    },
                                    {
                                        style: { height: 100 },
                                        h: [
                                            { style: { background: '#fff' }, flex: 1, html: 'e' },
                                            { style: { background: '#fff' }, size: 100, align: 'v', html: 'd' }
                                        ]
                                    },
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    })
    return (
        <div className="example">
            {form.renderLayout}
            {Code(`
type I_form = {
    name:string,
    email:string,
    password:string,
}
const GetLayout:FC = ()=>{
    const form = useForm<I_form>({
        initData:{
            name:'',
            email:'',
            password:'',
        },
        onSubmit:(data)=>{
            console.log(data)
        },
        getLayout: () => {
            return {
                style: { background: '#eee' },
                v: [
                    { style: { background: '#fff' }, size: 100, html: 'a' },
                    {
                        h: [
                            { style: { background: '#fff' }, size: 100, html: 'b' },
                            {
                                v: [
                                    { style: { background: '#fff' }, size: 100, align:'vh',html: 'c' },
                                    {
                                        size: 100,
                                        h: [
                                            { style: { background: '#fff' }, size: 100, html: 'd' },
                                            { style: { background: '#fff' }, flex: 1,align:'h', html: 'e' }
                                        ]
                                    },
                                    {
                                        style: { height: 100 },
                                        h: [
                                            { style: { background: '#fff' }, flex: 1, html: 'e' },
                                            { style: { background: '#fff' }, size: 100,align:'v', html: 'd' }
                                        ]
                                    },
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    })
    return (
        <>
            {form.renderLayout}
        </>
    )
}    
            `)}
        </div>
    )
}
const Nested: FC = () => {
    const form = useForm<I_form_3>({
        initData: {
            name: '',
            acounts: {
                emali: '',
                github: ''
            }
        },
        onSubmit: (data) => {
            console.log(data)
        },
        getLayout: ({ renderSubmitButton }) => {
            return {
                v: [
                    { input: { type: 'text', field: 'name', label: 'Name' } },
                    { input: { type: 'text', field: "acounts.emali", label: 'Email' } },
                    { input: { type: 'text', field: "acounts.github", label: 'Github' } },
                    {
                        className: 'p-v-12-',
                        h: [
                            { html: renderSubmitButton('Submit') }
                        ]
                    }
                ]
            }
        }
    })
    return (
        <div className="example">
            {form.renderLayout}
            {Code(`
type I_form = {
    name:string,
    acounts:{
        emali:string,
        github:string
    }
}
const Basic:FC = ()=>{
    const form = useForm<I_form>({
        initData:{
            name:'',
            acounts:{
                emali:'',
                github:''
            }
        },
        onSubmit:(data)=>{
            console.log(data)
        },
        getLayout:({renderSubmitButton})=>{
            return {
                v:[
                    {input:{type:'text',field:'name',label:'Name'}},
                    {input:{type:'text',field:"acounts.emali",label:'Email'}},
                    {input:{type:'text',field:"acounts.github",label:'Github'}},
                    {
                        className:'p-v-12-',
                        h:[
                            {html:renderSubmitButton('Submit')}
                        ]
                    }
                ]
            }
        }
    })
    return (
        <>
            {form.renderLayout}
        </>
    )
}
            `)}
        </div>
    )
}
const ValidateEmail: FC = () => {
    const form = useForm<I_form>({
        initData: {
            name: '',
            email: '',
            password: ''
        },
        onSubmit: (data) => {
            console.log(data)
        },
        getLayout: ({ renderSubmitButton }) => {
            return {
                v: [
                    { input: { type: 'text', field: 'name', label: 'Name' } },
                    { input: { type: 'text', field: 'email', label: 'Email', validateType: 'email' } },
                    { input: { type: 'password', field: 'password', label: 'Password' } },
                    {
                        className: 'p-v-12-',
                        h: [
                            { html: renderSubmitButton('Submit') }
                        ]
                    }
                ]
            }
        }
    })
    return (
        <div className="example">
            {form.renderLayout}
            {Code(`
type I_form = {
    name:string,
    email:string,
    password:string,
}
const Basic:FC = ()=>{
    const form = useForm<I_form>({
        initData:{
            name:'',
            email:'',
            password:'',
        },
        onSubmit:(data)=>{
            console.log(data)
        },
        getLayout:({renderSubmitButton})=>{
            return {
                v:[
                    {input:{type:'text',field:'name',label:'Name'}},
                    {input:{type:'text',field:'email',label:'Email',validateType:'email'}},
                    {input:{type:'password',field:'password',label:'Password'}},
                    {
                        className:'p-v-12-',
                        h:[
                            {html:renderSubmitButton('Submit')}
                        ]
                    }
                ]
            }
        }
    })
    return (
        <>
            {form.renderLayout}
        </>
    )
}
            `)}
        </div>
    )
}
const ValidateIrMobile: FC = () => {
    const form = useForm<I_form_4>({
        initData: {
            name: '',
            mobile: ''
        },
        onSubmit: (data) => {
            console.log(data)
        },
        getLayout: ({ renderSubmitButton }) => {
            return {
                v: [
                    { input: { type: 'text', field: 'name', label: 'Name' } },
                    { input: { type: 'text', field: 'mobile', label: 'Mobile', validateType: 'irMobile' } }
                ]
            }
        }
    })
    return (
        <div className="example">
            {form.renderLayout}
            {Code(`
type I_form = {
    name:string,
    mobile:string
}
const Basic:FC = ()=>{
    const form = useForm<I_form>({
        initData:{
            name:'',
            mobile:''
        },
        onSubmit:(data)=>{
            console.log(data)
        },
        getLayout:({renderSubmitButton})=>{
            return {
                v:[
                    {input:{type:'text',field:'name',label:'Name'}},
                    {input:{type:'text',field:'mobile',label:'Mobile',validateType:'irMobile'}}
                ]
            }
        }
    })
    return (
        <>
            {form.renderLayout}
        </>
    )
}
            `)}
        </div>
    )
}
const ValidateIrNationalCode: FC = () => {
    const form = useForm<I_form_5>({
        initData: {
            name: '',
            nationalCode: ''
        },
        onSubmit: (data) => {
            console.log(data)
        },
        getLayout: ({ renderSubmitButton }) => {
            return {
                v: [
                    { input: { type: 'text', field: 'name', label: 'Name' } },
                    { input: { type: 'text', field: 'nationalCode', label: 'National Code', validateType: 'irNationalCode' } }
                ]
            }
        }
    })
    return (
        <div className="example">
            {form.renderLayout}
            {Code(`
type I_form = {
    name:string,
    nationalCode:string
}
const Basic:FC = ()=>{
    const form = useForm<I_form>({
        initData:{
            name:'',
            nationalCode:''
        },
        onSubmit:(data)=>{
            console.log(data)
        },
        getLayout:({renderSubmitButton})=>{
            return {
                v:[
                    {input:{type:'text',field:'name',label:'Name'}},
                    {input:{type:'text',field:'nationalCode',label:'National Code',validateType:'irNationalCode'}}
                ]
            }
        }
    })
    return (
        <>
            {form.renderLayout}
        </>
    )
}
            `)}
        </div>
    )
}
type I_form_6 = {
    name: string,
    family: string,
    age: number,
    birthday: string
}
const Visibility: FC = () => {
    const nameInput: I_formNode<I_form_6> = { input: { type: 'text', field: 'name', label: 'Name' } }
    const familyInput: I_formNode<I_form_6> = { input: { type: 'text', field: 'family', label: 'Family' } }
    const ageInput: I_formNode<I_form_6> = { input: { type: 'number', field: 'age', label: 'Age' } }
    const birthdayInput: I_formNode<I_form_6> = { input: { type: 'date', field: 'birthday', label: 'Birth Day' } }
    const form = useForm<I_form_6>({
        initData: {
            name: '',
            family: '',
            age: 0,
            birthday: ''
        },
        onSubmit: (data) => {
            console.log(data)
        },
        getLayout: ({ renderSubmitButton }) => {
            return {
                v: [
                    {
                        show_lg: true,
                        h: [nameInput, familyInput, ageInput, birthdayInput]
                    },
                    {
                        show_md: true,
                        v: [
                            { h: [nameInput, familyInput, ageInput] },
                            birthdayInput
                        ]
                    },
                    {
                        show_sm: true,
                        v: [
                            { h: [nameInput, familyInput] },
                            { h: [ageInput, birthdayInput] }
                        ]
                    },
                    {
                        show_xs: true,
                        v: [nameInput, familyInput, ageInput, birthdayInput]
                    },
                    {
                        className: 'p-v-12-',
                        h: [
                            { html: renderSubmitButton('Submit') }
                        ]
                    }
                ]
            }
        }
    })
    return (
        <div className="example">
            {form.renderLayout}
            {Code(`
type I_form = {
    name: string,
    family: string,
    age: number,
    birthday: string
}
const Basic:FC = ()=>{
    const nameInput: I_formNode<I_form> = { 
        input: { type: 'text', field: 'name', label: 'Name' } 
    }
    const familyInput: I_formNode<I_form> = { 
        input: { type: 'text', field: 'family', label: 'Family' } 
    }
    const ageInput: I_formNode<I_form> = { 
        input: { type: 'number', field: 'age', label: 'Age' } 
    }
    const birthdayInput: I_formNode<I_form> = { 
        input: { type: 'date', field: 'birthday', label: 'Birth Day' } 
    }
    const form = useForm<I_form>({
        initData:{
            name: '',
            family: '',
            age: 0,
            birthday: ''
        },
        onSubmit:(data)=>{
            console.log(data)
        },
        getLayout: ({ renderSubmitButton }) => {
            return {
                v: [
                    {
                        show_lg: true,
                        h: [nameInput,familyInput,ageInput,birthdayInput]
                    },
                    {
                        show_md: true,
                        v: [
                            {h: [nameInput,familyInput,ageInput]},
                            birthdayInput
                        ]
                    },
                    {
                        show_sm: true,
                        v: [
                            {h: [nameInput,familyInput]},
                            {h: [ageInput,birthdayInput]}
                        ]
                    },
                    {
                        show_xs: true,
                        v: [nameInput,familyInput,ageInput,birthdayInput]
                    },
                    {
                        className: 'p-v-12-',
                        h: [
                            { html: renderSubmitButton('Submit') }
                        ]
                    }
                ]
            }
        }
    })
    return (
        <>
            {form.renderLayout}
        </>
    )
}
            `)}
        </div>
    )
}