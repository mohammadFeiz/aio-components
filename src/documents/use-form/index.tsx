import { FC } from "react";
import DOC from "../../resuse-components/doc";
import { useForm } from "../../npm/aio-input";
import { Code } from "../../npm/aio-components";

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
                    { text: 'complex layout', id: 'barati', render: () => <ComplexLayput /> },
                    
                ]
            }}
        />
    )
}
type I_form = {
    name:string,
    email:string,
    password:string,
}
type I_form_2 = {
    name:string,
    email:string,
    password:string,
    confirmPassword:string
}
const Basic:FC = ()=>{
    const form = useForm<I_form>({
        initData:{
            name:'',
            email:'',
            password:''
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
const Required:FC = ()=>{
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
const Validate:FC = ()=>{
    const form = useForm<I_form_2>({
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


const Dynamic:FC = ()=>{
    const form = useForm<I_form>({
        initData:{
            name:'',
            email:'',
            password:'',
        },
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

const Reset:FC = ()=>{
    const form = useForm<I_form>({
        initData:{
            name:'',
            email:'',
            password:''
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
                            {html:renderSubmitButton('Submit'),id:'msf'},
                            {html:<button type='button' onClick={()=>reset()}>Reset</button>},
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


const ComplexLayput:FC = ()=>{
    const form = useForm<I_form>({
        initData:{
            name:'',
            email:'',
            password:'',
        },
        onSubmit:(data)=>{
            console.log(data)
        },
        getLayout:(data)=>{
            return {
                style:{background:'#eee'},
                v:[
                    {style:{background:'#fff'},size:100,html:'a'},
                    {
                        h:[
                            {style:{background:'#fff'},size:100,html:'b'},
                            {
                                v:[
                                    {style:{background:'#fff'},size:100,html:'c'},
                                    {
                                        size:100,
                                        h:[
                                            {style:{background:'#fff'},size:100,html:'d'},
                                            {style:{background:'#fff'},flex:1,html:'e'}
                                        ]
                                    },
                                    {
                                        style:{height:100},
                                        h:[
                                            {style:{background:'#fff'},flex:1,html:'e'},
                                            {style:{background:'#fff'},size:100,html:'d'}
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
        getLayout:(data)=>{
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
                            {submit:{text:'Submit'}}
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