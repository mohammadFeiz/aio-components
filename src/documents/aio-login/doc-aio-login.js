import React, { Component,useState } from 'react';
import DOC from '../../resuse-components/doc';
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import AIOLogin from './../../npm/aio-login/aio-login';
import {Icon} from '@mdi/react';
import { mdiAccount, mdiLock } from '@mdi/js';
export default class DOC_AIOLogin extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                nav={{
                    items:[
                        { text: 'Types', id: 'types', render: () => <Types /> },
                        { text: 'basic', id: 'basic', render: () => <Basic key='basic' type='basic'/> },
                        { text: 'register type:"mode"', id: 'registerTypeMode', render: () => <Register key='mode' type='mode'/> },
                        { text: 'register type:"button"', id: 'registertypeButton', render: () => <Register key='button' type='button'/> },
                        { text: 'register type:"tab"', id: 'registertypeTab', render: () => <Register key='tab' type='tab'/> },
                        { text: 'forget mode:"phoneNumber"', id: 'forgetmodephonenumber', render: () => <Forget key='phoneNumber' type='phoneNumber'/> },
                        { text: 'forget mode:"email"', id: 'forgetmodeemail', render: () => <Forget key='email' type='email'/> },
                    ]
                }}
            />
        )
    }
}
function Types(){
    return (
        AIODoc().Code(`
let inst:TSInst = new AIOLogin(params:TSParams)
type TSParams = {
    // uniq id for aio-login instance
    id : string,
    // check cached token is valid or not
    checkToken : ( token : string ) => boolean,
    onSubmit : ( model : TSModel , mode : TSMode ) => string | undefined,
    onAutch:( params : { userId : string , token : string , userInfo : any } ) => void,
    register ? : { 
        type : 'mode' | 'button' | 'tab',
        fields : TSRegisterFields,
        text : string
    }[],
    forget ? : { 
        type : 'phoneNumber' | 'email'
    },
    timer ? : number
    otpLength ? : number,
    attrs ? : object,
    modes : TSMode[],
}
type TSMode = 
    "OTPNumber" | "OTPCode" | "userName" | "email" | 
    "phoneNumber" | "register" | "forgetUserId" | "forgetPassword" | 
    "auth";

type TSModel = {
    login : {
        userId : string,
        password : string
    },
    register : {
        [field:string] : any
    },
    forget:{
        userId ? string,
        newPassword ? string,
        reNewPassword ? string
    }
}
type TSRegisterFields = {
    input : 
}[]

`)
    )
}
function Basic({type}) {
    //use useState To create instance only once
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintest' + type,
            modes:['OTPNumber','userName','email','phoneNumber'],
            otpLength:5,
            checkToken:(token)=>token === 'my test token',
            onSubmit:(model,mode) => {
                if(mode === 'OTPNumber'){
                    if(model.login.userId !== '09111111111'){return 'cannot find this userId'}
                    loginInstance.setMode('OTPCode');
                    return;
                }
                else if(mode === 'userName'){
                    if(model.login.userId !== 'asd'){return 'cannot find this userId'}
                    else if(model.login.password !== '123'){return 'password is incorrect'}
                }
                else if(mode === 'email'){
                    if(model.login.userId !== 'a@b.com'){return 'cannot find this userId'}
                    else if(model.login.password !== '123'){return 'password is incorrect'}
                }
                else if(mode === 'phoneNumber'){
                    if(model.login.userId !== '09111111111'){return 'cannot find this userId'}
                    else if(model.login.password !== '123'){return 'password is incorrect'}
                }
                else if(mode === 'OTPCode'){
                    if(model.login.password !== '12345'){return 'code is incorrect'}
                }
                let token = 'my test token';
                loginInstance.setToken(token);
                loginInstance.setUserInfo({role:'admin'});
                loginInstance.setMode('auth');
            },
            onAuth:({userId,token,logout}) => {
                setAuth(true);
            },
            timer:10,
        })
    )
    let [auth,setAuth] = useState(false);
    function preview() {
        return (
            <div className='example'>
                {
                    !auth && 
                    <ul>
                        {!auth && <li>imagine a valid userName is "asd" and its password is "123"</li>}
                        {!auth && <li>imagine a valid email is "a@b.com" and its password is "123"</li>}
                        {!auth && <li>imagine a valid phoneNumber is "09111111111" and its password is "123"</li>}
                        {!auth && <li>imagine a valid OTPNumber is "09111111111" and its password is "12345"</li>}        
                    </ul>
                }
                {!auth && loginInstance.render()}
                {
                    auth && 
                    <ul>
                        <li style={{color:'green'}}>{`you are now autenticated and you entered to app`}</li>
                        <li>{`your token is "${loginInstance.getToken()}"`}</li>
                        <li>{`your userId is "${loginInstance.getUserId()}"`}</li>
                        <li>{`your role is "${loginInstance.getUserInfo().role}"`}</li>
                        <li><button onClick={()=>loginInstance.removeToken()}>Remove Token</button></li>
                        <li><button onClick={()=>window.location.reload()}>Reload Page</button></li>
                        <li><button onClick={()=>{loginInstance.logout();}}>Logout</button></li>
                    </ul>
                }
                {
                    AIODoc().Code(`
function LoginPage() {
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintest',
            modes:['OTPNumber','userName','email','phoneNumber'],
            otpLength:5,
            checkToken:(token)=>token === 'my test token',
            onSubmit:(model,mode) => {
                if(mode === 'OTPNumber'){
                    if(model.login.userId !== '09111111111'){return 'cannot find this userId'}
                    loginInstance.setMode('OTPCode');
                    return;
                }
                else if(mode === 'userName'){
                    if(model.login.userId !== 'asd'){return 'cannot find this userId'}
                    else if(model.login.password !== '123'){return 'password is incorrect'}
                }
                else if(mode === 'email'){
                    if(model.login.userId !== 'a@b.com'){return 'cannot find this userId'}
                    else if(model.login.password !== '123'){return 'password is incorrect'}
                }
                else if(mode === 'phoneNumber'){
                    if(model.login.userId !== '09111111111'){return 'cannot find this userId'}
                    else if(model.login.password !== '123'){return 'password is incorrect'}
                }
                else if(mode === 'OTPCode'){
                    if(model.login.password !== '12345'){return 'code is incorrect'}
                }
                let token = 'my test token';
                loginInstance.setToken(token);
                loginInstance.setUserInfo({role:'admin'})
                loginInstance.setMode('auth')
            },
            onAuth:({userId,token,logout}) => {
                setAuth(true);
            },
            timer:10,
            modes:['userName']
        })
    )
    let [auth,setAuth] = useState(false);
    let [token,setToken] = useState();
    let [userId,setUserId] = useState();
    if(!auth){return loginInstance.render()}
    else {
        return (
            <ul>
                <li style={{color:'green'}}>{\`you are now autenticated and you entered to app\`}</li>
                <li>{\`your token is ${'${loginInstance.getToken()}'}\`}</li>
                <li>{\`your userId is ${'${loginInstance.getUserId()}'}\`}</li>
                <li>{\`your role is ${'${loginInstance.getUserInfo().role}'}\`}</li>
                <li><button onClick={()=>loginInstance.removeToken()}>Remove Token</button></li>
                <li><button onClick={()=>window.location.reload()}>Reload Page</button></li>
                <li><button onClick={()=>{loginInstance.logout();}}>Logout</button></li>
            </ul>
        )
    }
}
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    return (<Example preview={() => preview()}/>)
}
function Register({type}) {
    let [loginInstance] = useState(
        new AIOLogin({
            id:`mylogintestregistertype${type}`,
            otpLength:5,
            checkToken:(token)=>token === 'my test token',
            onAuth:({userId,token,logout})=>{
                setAuth(true)
            },
            onSubmit:(model,mode)=>{
                if(mode === 'OTPNumber'){
                    if(model.login.userId !== '09111111111'){return 'cannot find this userId'}
                    loginInstance.setMode('OTPCode');
                }
                else if(mode === 'OTPCode'){
                    if(model.login.password !== '12345'){return 'code is incorrect'}
                    if(type === 'mode'){
                        loginInstance.setMode('register')
                    }
                    else{
                        let token = 'my test token';
                        loginInstance.setToken(token);
                        loginInstance.setUserInfo({role:'admin'});
                        loginInstance.setMode('auth')    
                    }
                }
                else if(mode === 'register'){
                    if(type === 'mode'){
                        console.log('register object : ',model.register)
                        let token = 'my test token';
                        loginInstance.setToken(token);
                        loginInstance.setUserInfo({role:'admin'});
                        loginInstance.setMode('auth');
                    }
                    else {
                        console.log('register object : ',model.register)
                        loginInstance.setMode('OTPNumber');
                    }   
                }
            },
            timer:10,
            modes:['OTPNumber'],otpLength:5,
            register:{
                type,
                fields:['firstname','lastname','email','gender','militaryservice','nationalcode','state','city'],
                text:'ایجاد حساب کاربری'
            }
        })
    )
    let [auth,setAuth] = useState(false);
    function preview() {
        return (
            <div className='example'>
                {
                    <ul>
                        {!auth && <li>imagine a valid OTPNumber is "09111111111" and its password is "12345"</li>}
                    </ul>
                }
                {!auth && loginInstance.render()}
                {
                    auth && 
                    <ul>
                        <li style={{color:'green'}}>{`you are now autenticated and you entered to app`}</li>
                        <li>{`your token is "${loginInstance.getToken()}"`}</li>
                        <li>{`your userId is "${loginInstance.getUserId()}"`}</li>
                        <li>{`your role is "${loginInstance.getUserInfo().role}"`}</li>
                        <li><button onClick={()=>loginInstance.removeToken()}>Remove Token</button></li>
                        <li><button onClick={()=>window.location.reload()}>Reload Page</button></li>
                        <li><button onClick={()=>{loginInstance.logout();}}>Logout</button></li>
                    </ul>
                }
                {
                    AIODoc().Code(`
function LoginPage() {
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintestregistertype${type}',
            otpLength:5,
            checkToken:(token)=>token === 'my test token',
            onAuth:({userId,token,logout})=>{
                setAuth(true)
            },
            onSubmit:(model,mode)=>{
                if(mode === 'OTPNumber'){
                    if(model.login.userId !== '09111111111'){return 'cannot find this userId'}
                    loginInstance.setMode('OTPCode');
                }
                else if(mode === 'OTPCode'){
                    if(model.login.password !== '12345'){return 'code is incorrect'}
                    ${type === 'mode'?
                    `loginInstance.setMode('register')`:
                    `let token = 'my test token';
                    loginInstance.setToken(token);
                    loginInstance.setUserInfo({role:'admin'});
                    loginInstance.setMode('auth')`
                    }
                }
                else if(mode === 'register'){
                    ${type === 'mode'?
                    `console.log('register object : ',model.register)
                    let token = 'my test token';
                    loginInstance.setToken(token);
                    loginInstance.setUserInfo({role:'admin'});
                    loginInstance.setMode('auth');`:
                    `console.log('register object : ',model.register)
                    loginInstance.setMode('OTPNumber');`
                    }   
                }
            },
            timer:10,
            modes:['OTPNumber'],otpLength:5,
            register:{
                type:'${type}',
                fields:['firstname','lastname','email','gender','militaryservice','nationalcode','state','city'],
                text:'ایجاد حساب کاربری'
            }
        })
    )
    if(auth){
        return (
            <ul>
                <li style={{color:'green'}}>{\`you are now autenticated and you entered to app\`}</li>
                <li>{\`your token is ${'${loginInstance.getToken()}'}\`}</li>
                <li>{\`your userId is ${'${loginInstance.getUserId()}'}\`}</li>
                <li>{\`your role is ${'${loginInstance.getUserInfo().role}'}\`}</li>
                <li><button onClick={()=>loginInstance.removeToken()}>Remove Token</button></li>
                <li><button onClick={()=>window.location.reload()}>Reload Page</button></li>
                <li><button onClick={()=>{loginInstance.logout();}}>Logout</button></li>
            </ul>
        )
    }
    else {return loginInstance.render()}
}
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    return (<Example preview={() => preview()}/>)
}
function Forget({type}) {
    let [loginInstance] = useState(
        new AIOLogin({
            id:`mylogintestforgetmode${type}`,
            otpLength:5,
            checkToken:(token)=>token === 'my test token',
            onAuth:({userId,token,logout})=>{
                setAuth(true)
            },
            onSubmit:(model,mode)=>{
                if(mode === 'userName'){
                    if(model.login.userId !== 'asd'){return 'cannot find this userId'}
                    else if(model.login.password !== '123'){return 'password is incorrect'}
                    let token = 'my test token';
                    loginInstance.setToken(token);
                    loginInstance.setUserInfo({role:'admin'});
                    loginInstance.setMode('auth')    
                }
                else if(mode === 'forgetUserId'){
                    if(type === 'phoneNumber' && model.forget.userId !== '09111111111'){return 'شماره همراه اشتباه است'}
                    if(type === 'email' && model.forget.userId !== 'a@b.com'){return 'آدرس ایمیل اشتباه است'}
                    loginInstance.setMode('forgetPassword')   
                }
                else if(mode === 'forgetPassword'){
                    if(model.forget.password !== '12345'){return 'رمز یکبار مصرف اشتباه است'}
                    console.log(`رمز عبور جدید شما ${model.forget.newPassword} است`)
                    loginInstance.setMode('userName')   
                }
            },
            timer:10,
            modes:['userName'],otpLength:5,
            forget:{
                mode:type
            }
        })
    )
    let [auth,setAuth] = useState(false);
    function preview() {
        return (
            <div className='example'>
                {
                    !auth &&
                    <ul>
                        <li>imagine a valid userName is "asd" and its password is "123"</li>
                        <li>imagine a valid email is "a@b.com" and its password is "123"</li>
                        <li>imagine a valid OTPNumber is "09111111111" and its password is "12345"</li>        
                    </ul>
                }   
                {!auth && loginInstance.render()}
                {
                    auth && 
                    <ul>
                        <li style={{color:'green'}}>{`you are now autenticated and you entered to app`}</li>
                        <li>{`your token is "${loginInstance.getToken()}"`}</li>
                        <li>{`your userId is "${loginInstance.getUserId()}"`}</li>
                        <li>{`your role is "${loginInstance.getUserInfo().role}"`}</li>
                        <li><button onClick={()=>loginInstance.removeToken()}>Remove Token</button></li>
                        <li><button onClick={()=>window.location.reload()}>Reload Page</button></li>
                        <li><button onClick={()=>{loginInstance.logout();}}>Logout</button></li>
                    </ul>
                }
                {
                    AIODoc().Code(`
function LoginPage() {
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintestforgettype${type}',
            otpLength:5,
            checkToken:(token)=>token === 'my test token',
            onAuth:({userId,token,logout})=>{
                setAuth(true)
            },
            onSubmit:(model,mode)=>{
                if(mode === 'userName'){
                    if(model.login.userId !== 'asd'){return 'cannot find this userId'}
                    else if(model.login.password !== '123'){return 'password is incorrect'}
                    let token = 'my test token';
                    loginInstance.setToken(token);
                    loginInstance.setUserInfo({role:'admin'});
                    loginInstance.setMode('auth')    
                }
                else if(mode === 'forgetUserId'){
                    ${type === 'phoneNumber'?
                    `if(model.forget.userId !== '09111111111'){return 'شماره همراه اشتباه است'}`:
                    `model.forget.userId !== 'a@b.com'){return 'آدرس ایمیل اشتباه است'}`}
                    loginInstance.setMode('forgetPassword')   
                }
                else if(mode === 'forgetPassword'){
                    if(model.forget.password !== '12345'){return 'رمز یکبار مصرف اشتباه است'}
                    console.log(\`رمز عبور جدید شما ${'${model.forget.newPassword}'} است\`)
                    loginInstance.setMode('userName')   
                }
            },
            timer:10,
            modes:['OTPNumber'],otpLength:5,
            forget:{
                mode:${type}
            }
        })
    )
    if(auth){
        return (
            <ul>
                <li style={{color:'green'}}>{\`you are now autenticated and you entered to app\`}</li>
                <li>{\`your token is ${'${loginInstance.getToken()}'}\`}</li>
                <li>{\`your userId is ${'${loginInstance.getUserId()}'}\`}</li>
                <li>{\`your role is ${'${loginInstance.getUserInfo().role}'}\`}</li>
                <li><button onClick={()=>loginInstance.removeToken()}>Remove Token</button></li>
                <li><button onClick={()=>window.location.reload()}>Reload Page</button></li>
                <li><button onClick={()=>{loginInstance.logout();}}>Logout</button></li>
            </ul>
        )
    }
    else {return loginInstance.render()}
}
                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    return (<Example preview={() => preview()}/>)
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
                layout={{
                    column: [
                        this.toolbar_layout(),
                        this.body_layout()
                    ]
                }}
            />
        )
    }
}




