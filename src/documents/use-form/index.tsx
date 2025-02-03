import { FC } from "react";
import DOC from "../../resuse-components/doc";
import { useForm } from "../../npm/aio-form";
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
                    { text: 'barati', id: 'barati', render: () => <Barati /> },
                    
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
        getLayout:(data)=>{
            return {
                v:[
                    {input:{type:'text',field:'name',label:'Name'}},
                    {input:{type:'text',field:'email',label:'Email'}},
                    {input:{type:'password',field:'password',label:'Password'}},
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
        <div className="example">
            {form.render}
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
        getLayout:(data)=>{
            return {
                v:[
                    {input:{type:'text',field:'name',label:'Name'}},
                    {input:{type:'text',field:'email',label:'Email'}},
                    {input:{type:'password',field:'password',label:'Password'}},
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
            {form.render}
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
        <div className="example">
            {form.render}
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
            {form.render}
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
        getLayout:(data)=>{
            return {
                v:[
                    {input:{type:'text',field:'name',label:'Name'}},
                    {input:{type:'text',field:'email',label:'Email',required:false}},
                    {input:{type:'password',field:'password',label:'Password'}},
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
        <div className="example">
            {form.render}
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
        getLayout:(data)=>{
            return {
                v:[
                    {input:{type:'text',field:'name',label:'Name'}},
                    {input:{type:'text',field:'email',label:'Email',required:false}},
                    {input:{type:'password',field:'password',label:'Password'}},
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
            {form.render}
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
        getLayout:(data)=>{
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
                            {submit:{text:'Submit'}}
                        ]
                    }
                ]
            }
        }
    })
    return (
        <div className="example">
            {form.render}
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
        getLayout:(data)=>{
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
                            {submit:{text:'Submit'}}
                        ]
                    }
                ]
            }
        }
    })
    return (
        <>
            {form.render}
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
        getLayout:(data)=>{
            return {
                v:[
                    {
                        h:[
                            {input:{type:'text',field:'name',label:'Name'}},
                            {input:{type:'text',field:'email',label:'Email',disabled:data.name === 'mohammad'}},
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
                            {submit:{text:'Submit'}}
                        ]
                    }
                ]
            }
        }
    })
    return (
        <div className="example">
            {form.render}
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
        getLayout:(data)=>{
            return {
                v:[
                    {
                        h:[
                            {input:{type:'text',field:'name',label:'Name'}},
                            {input:{type:'text',field:'email',label:'Email',disabled:data.name === 'mohammad'}},
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
                            {submit:{text:'Submit'}}
                        ]
                    }
                ]
            }
        }
    })
    return (
        <>
            {form.render}
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
        getLayout:(data)=>{
            return {
                v:[
                    {input:{type:'text',field:'name',label:'Name'}},
                    {input:{type:'text',field:'email',label:'Email'}},
                    {input:{type:'password',field:'password',label:'Password'}},
                    {
                        className:'p-v-12-',
                        h:[
                            {submit:{text:'Submit'}},
                            {reset:{text:'Reset'}},
                        ]
                    }
                ]
            }
        }
    })
    return (
        <div className="example">
            {form.render}
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
        getLayout:(data)=>{
            return {
                v:[
                    {input:{type:'text',field:'name',label:'Name'}},
                    {input:{type:'text',field:'email',label:'Email'}},
                    {input:{type:'password',field:'password',label:'Password'}},
                    {
                        className:'p-v-12-',
                        h:[
                            {submit:{text:'Submit'}},
                            {reset:{text:'Reset'}},
                        ]
                    }
                ]
            }
        }
    })
    return (
        <>
            {form.render}
        </>
    )
}
            `)}
        </div>
    )
}


const Barati:FC = ()=>{
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
                    {style:{background:'#fff',height:100},h:[{flex:1,html:'a'}]},
                    {
                        h:[
                            {style:{background:'#fff',width:100},h:[{html:'b'}]},
                            {
                                v:[
                                    {style:{background:'#fff',height:100},h:[{html:'c'}]},
                                    {
                                        style:{height:100},
                                        h:[
                                            {style:{background:'#fff',width:100},h:[{html:'d'}]},
                                            {style:{background:'#fff',flex:1},h:[{html:'e'}]}
                                        ]
                                    },
                                    {
                                        style:{height:100},
                                        h:[
                                            {style:{background:'#fff',flex:1,},h:[{html:'e'}]},
                                            {style:{background:'#fff',width:100},h:[{html:'d'}]}
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
            {form.render}
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
            {form.render}
        </>
    )
}    
            `)}
        </div>
    )
}