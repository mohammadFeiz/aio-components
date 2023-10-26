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
                        { text: 'basic', id: 'basic', render: () => <Basic /> },
                        { text: 'checkToken', id: 'checkToken', render: () => <CheckToken /> },
                        { text: 'removeToken', id: 'removeToken', render: () => <RemoveToken /> },
                        { text: 'getUserId', id: 'getUserId', render: () => <GetUserIdFromInstance /> },
                        { text: 'userId from onAuth', id: 'userId from onAuth', render: () => <GetUserIdFromOnAuth /> },
                        { text: 'logout', id: 'logout', render: () => <Logout /> },
                        { text: 'modes', id: 'modes', render: () => <Modes /> },
                        { text: 'register type:"mode"', id: 'registerTypeMode', render: () => <RegisterTypeMode /> },
                        { text: 'register type:"button"', id: 'registertypeButton', render: () => <RegisterTypeButton /> },
                        { text: 'register type:"tab"', id: 'registertypeTab', render: () => <RegisterTypeTab /> },
                        { text: 'setUserInfo getUserInfo', id: 'setuserinfogetuserinfo', render: () => <SetUserInfoGetUserInfo /> },
                    ]
                }}
            />
        )
    }
}
// type I_props = {
//     id:string,
//     onSubmit:(model:I_model,mode:I_mode)=>{nextMode:I_mode,error?:String,token?:string},
//     modes:('OTPNumber' |'userName' |'email' |'phoneNumber')[],
//     timer?:Number,
//     checkToken:(token:string)=>Boolean,
//     register?:{type:'mode'|'button'|'tab',fields:I_registerField[],text:string},
//     forget?:{type:'phoneNumber' | 'email',codeLength:Number},
//     otpLength?:number,
//     attrs?:object
// }
// type I_mode = 'OTPNumber' |'OTPCode' |'userName' |'email' | 'phoneNumber' | 'forgetId' | 'forgetCode' | 'register' | 'error' | 'auth'
// type I_model = {
//     login:{userId:string,password:string},
//     register?:{[field:string]:any},
//     forget?:{id?:string,code?:string,password?:string,rePassword?:string},
// }
function Types(){
    return (
        AIODoc().Code(`
let inst:TSInst = new AIOLogin(params:TSParams)
type TSParams = {
    // uniq id for aio-login instance
    id : string,
    // check cached token is valid or not
    checkToken : ( token : string ) => boolean,
    onSubmit : ( model : TSModel , mode : TSMode ) => { 
        nextMode : Mode , 
        token ? string , 
        error ? : string 
    },
    onAutch:( params : { userId : string , token : string , userInfo : any } ) => void,
    register ? : { 
        type : 'mode' | 'button' | 'tab',
        fields : TSRegisterFields,
        text : string
    }[],
    forget ? : { 
        type : 'phoneNumber' | 'email',
        codeLength : Number
    },
    timer ? : number
    otpLength ? : number,
    attrs ? : object,
    modes : TSMode[],
}
type TSMode = 
    "OTPNumber" | "OTPCode" | "userName" | "email" | 
    "phoneNumber" | "register" | "forgetId" | "forgetCode" | 
    "error" | "auth";

type TSModel = {
    login : {
        userId : string,
        password : string
    },
    register : {
        [field:string] : any
    },
    forget:{
        id ? string,
        password ? string,
        code ? string
    }
}
type TSRegisterFields = {
    input : TSInputText | TSInputNumber | TSInputSelect | TSInputCheckbox | TSInputRadio | TSInputImage
}[]

`)
    )
}
function Basic() {
    //use useState To create instance only once
    let [loginInstance] = useState(
        new AIOLogin({id:'mylogintestbasic',checkToken:(token)=>false,onAuth,onSubmit,timer:10,modes:['userName']})
    )
    let [auth,setAuth] = useState(false);
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(model.login.userId !== 'asd'){
            return {nextMode:'error',error:'cannot find this userId'}
        }
        else if(model.login.password !== '123'){
            return {nextMode:'error',error:'password is incorrect'}
        }
        else {
            let token = 'my test token';
            setToken(token);
            return {nextMode:'auth',token}
        }
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    function preview() {
        return (
            <div className='example'>
                {
                    !auth && 
                    <ul>
                        <li>1 - create instance from aio-login by below properties</li>
                        <ul>
                            <li>id : string - uniq id for isolate caching</li>
                            <li>{'checkToken : (token)=>boolean - this function define user token is valid or not , if returns true user will be authenticated'}</li>
                            <li>{'onSubmit : (model,mode)=>{return {nextMode,...}} - this function will called when user inter some data in forms'}</li>
                            <ul>
                                <li>{'model is an object contain login,register,forget'}</li>
                                <li>{"mode is 'OTPNumber' | 'OTPCode' | 'userName' | 'email' | 'phoneNumber' | 'forgetId' | 'forgetCode' | 'register' | 'error' | 'auth'"}</li>
                                <li>{"this function should returns an object contain nextMode to preview next form of aio-login"}</li>
                            </ul>
                            <li>{'onAuth : ({token,userId,logout})=>change state to inter app - this function will called when onSubmit props returns an object contain nextMode:"auth"'}</li>
                        </ul>
                        <li>imagine a valid username is "asd" and its password is "123"</li>
                    </ul>
                }
                {!auth && loginInstance.render()}
                {
                    auth && 
                    <ul>
                        <li style={{color:'green'}}>{`you are now autenticated and you entered to app`}</li>
                        <li>{`your token is "${token}"`}</li>
                        <li >{`if you refresh the page you will visit login page again because of result of checkToken props (false)`}</li>
                    </ul>
                }
                {
                    !auth &&
                    <ul>
                        <li style={{color:'red'}}>{`you are not autenticated and you cannot inter to app`}</li>
                        
                    </ul>
                }
                {
                    AIODoc().Code(`
function LoginPage() {
    //use useState To create instance only once
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintest',
            checkToken:(token)=>false,
            onAuth,
            onSubmit,
            timer:10,
            modes:['userName']
        })
    )
    let [auth,setAuth] = useState(false);
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(model.login.userId !== 'asd'){
            return {nextMode:'error',error:'cannot find this userId'}
        }
        else if(model.login.password !== '123'){
            return {nextMode:'error',error:'password is incorrect'}
        }
        else {
            let token = 'my test token';
            setToken(token);
            return {nextMode:'auth',token}
        }
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    if(auth){return <MyComponent/>}
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
function CheckToken() {
    let [loginInstance] = useState(
        new AIOLogin({id:'mylogintestchecktoken',checkToken:(token)=>true,onAuth,onSubmit,timer:10,modes:['userName']})
    )
    let [auth,setAuth] = useState(false);
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(model.login.userId !== 'asd'){
            return {nextMode:'error',error:'cannot find this userId'}
        }
        else if(model.login.password !== '123'){
            return {nextMode:'error',error:'password is incorrect'}
        }
        else {
            let token = 'my test token';
            setToken(token);
            return {nextMode:'auth',token}
        }
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    function preview() {
        return (
            <div className='example'>
                {
                    <ul>
                        {!auth && <li>imagine a valid username is "asd" and its password is "123"</li>}
                        <li>this example is same basic part just we set <strong style={{background:'yellow'}}>{'checkToken:(token)=>true'}</strong></li>
                        <li >
                            if you refresh the page you will <strong style={{background:'yellow'}}>not</strong> visit login page again because of result of checkToken props (true),
                            if checkToken returns true,it means your token is valid 
                        </li>
                    </ul>
                }
                {!auth && loginInstance.render()}
                {
                    auth && 
                    <ul>
                        <li style={{color:'green'}}>{`you are now autenticated and you entered to app`}</li>
                        <li>{`your token is "${token}"`}</li>
                        
                    </ul>
                }
                {
                    !auth &&
                    <ul>
                        <li style={{color:'red'}}>{`you are not autenticated and you cannot inter to app`}</li>
                        
                    </ul>
                }
                {
                    AIODoc().Code(`
function LoginPage() {
    //use useState To create instance only once
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintest',
            checkToken:(token)=>true,
            onAuth,
            onSubmit,
            timer:10,
            modes:['userName']
        })
    )
    let [auth,setAuth] = useState(false);
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(model.login.userId !== 'asd'){
            return {nextMode:'error',error:'cannot find this userId'}
        }
        else if(model.login.password !== '123'){
            return {nextMode:'error',error:'password is incorrect'}
        }
        else {
            let token = 'my test token';
            setToken(token);
            return {nextMode:'auth',token}
        }
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    if(auth){return <MyComponent/>}
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
function RemoveToken() {
    let [loginInstance] = useState(
        new AIOLogin({id:'mylogintestremovetoken',checkToken:(token)=>true,onAuth,onSubmit,timer:10,modes:['userName']})
    )
    let [auth,setAuth] = useState(false);
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(model.login.userId !== 'asd'){
            return {nextMode:'error',error:'cannot find this userId'}
        }
        else if(model.login.password !== '123'){
            return {nextMode:'error',error:'password is incorrect'}
        }
        else {
            let token = 'my test token';
            setToken(token);
            return {nextMode:'auth',token}
        }
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    function preview() {
        return (
            <div className='example'>
                {
                    <ul>
                        {!auth && <li>imagine a valid username is "asd" and its password is "123"</li>}
                        <li>this example is same before part. you can use loginInstance.removeToken() to remove cached token</li>
                        <li >
                            if you call loginInstance.removeToken() and reload the page, you will visit login page again because after call it, token will be removed from cache
                        </li>
                        <li>
                            for call loginInstance.removeToken() click on Remove Token button 
                        </li>
                    </ul>
                }
                {!auth && loginInstance.render()}
                {
                    auth && 
                    <ul>
                        <li style={{color:'green'}}>{`you are now autenticated and you entered to app`}</li>
                        <li>{`your token is "${token}"`}</li>
                        <li><button onClick={()=>{loginInstance.removeToken(); setToken(false)}}>{token?'Remove Token':'your token is removed'}</button></li>
                        <li><button onClick={()=>window.location.reload()}>Reload Page</button></li>
                    </ul>
                }
                {
                    !auth &&
                    <ul>
                        <li style={{color:'red'}}>{`you are not autenticated and you cannot inter to app`}</li>
                        
                    </ul>
                }
                {
                    AIODoc().Code(`
function LoginPage() {
    //use useState To create instance only once
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintest',
            checkToken:(token)=>true,
            onAuth,
            onSubmit,
            timer:10,
            modes:['userName']
        })
    )
    let [auth,setAuth] = useState(false);
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(model.login.userId !== 'asd'){
            return {nextMode:'error',error:'cannot find this userId'}
        }
        else if(model.login.password !== '123'){
            return {nextMode:'error',error:'password is incorrect'}
        }
        else {
            let token = 'my test token';
            setToken(token);
            return {nextMode:'auth',token}
        }
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    if(auth){
        return (
            <>
                <ul>
                    <li style={{color:'green'}}>
                        you are now autenticated and you entered to app
                    </li>
                    <li>
                        {\`your token is ${'${token}'}\`}
                    </li>
                    <li>
                        <button 
                            onClick={()=>{
                                loginInstance.removeToken(); 
                                setToken(false);
                            }}
                        >{token?'Remove Token':'your token is removed'}</button>
                    </li>
                    <li>
                        <button 
                            onClick={()=>window.location.reload()}
                        >Reload Page</button>
                    </li>
                </ul>
            </>
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
function GetUserIdFromInstance() {
    let [loginInstance] = useState(
        new AIOLogin({id:'mylogintestgetuseridfrominstance',checkToken:(token)=>true,onAuth,onSubmit,timer:10,modes:['userName']})
    )
    let [auth,setAuth] = useState(false);
    let [userId] = useState(loginInstance.getUserId());
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(model.login.userId !== 'asd'){
            return {nextMode:'error',error:'cannot find this userId'}
        }
        else if(model.login.password !== '123'){
            return {nextMode:'error',error:'password is incorrect'}
        }
        else {
            let token = 'my test token';
            setToken(token);
            return {nextMode:'auth',token}
        }
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    function preview() {
        return (
            <div className='example'>
                {
                    <ul>
                        {!auth && <li>imagine a valid username is "asd" and its password is "123"</li>}
                        <li>in this example we use <strong style={{background:'yellow'}}>loginInstance.getUserId()</strong></li>
                    </ul>
                }
                {!auth && loginInstance.render()}
                {
                    auth && 
                    <ul>
                        <li style={{color:'green'}}>{`you are now autenticated and you entered to app`}</li>
                        <li>{`your token is "${token}"`}</li>
                        <li>{`your userId is "${userId}"`}</li>
                    </ul>
                }
                {
                    !auth &&
                    <ul>
                        <li style={{color:'red'}}>{`you are not autenticated and you cannot inter to app`}</li>
                        
                    </ul>
                }
                {
                    AIODoc().Code(`
function LoginPage() {
    //use useState To create instance only once
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintest',
            checkToken:(token)=>true,
            onAuth,
            onSubmit,
            timer:10,
            modes:['userName']
        })
    )
    let [auth,setAuth] = useState(false);
    let [userId] = useState(loginInstance.getUserId());
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(model.login.userId !== 'asd'){
            return {nextMode:'error',error:'cannot find this userId'}
        }
        else if(model.login.password !== '123'){
            return {nextMode:'error',error:'password is incorrect'}
        }
        else {
            let token = 'my test token';
            setToken(token);
            return {nextMode:'auth',token}
        }
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    if(auth){
        return (
            <>
                <ul>
                    <li style={{color:'green'}}>
                        you are now autenticated and you entered to app
                    </li>
                    <li>
                        {\`your token is ${'${token}'}\`}
                    </li>
                    <li>
                        {\`your userId is ${"${userId}"}\`}
                    </li>

                    <li>
                        <button 
                            onClick={()=>{
                                loginInstance.removeToken(); 
                                setToken(false);
                            }}
                        >{token?'Remove Token':'your token is removed'}</button>
                    </li>
                    <li>
                        <button 
                            onClick={()=>window.location.reload()}
                        >Reload Page</button>
                    </li>
                </ul>
            </>
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
function GetUserIdFromOnAuth() {
    let [loginInstance] = useState(
        new AIOLogin({id:'mylogintestgetuseridfromonauth',checkToken:(token)=>true,onAuth,onSubmit,timer:10,modes:['userName']})
    )
    let [auth,setAuth] = useState(false);
    let [userId,setUserId] = useState('');
    let [token,setToken] = useState('');
    function onSubmit(model,mode){
        if(model.login.userId !== 'asd'){
            return {nextMode:'error',error:'cannot find this userId'}
        }
        else if(model.login.password !== '123'){
            return {nextMode:'error',error:'password is incorrect'}
        }
        else {
            let token = 'my test token';
            return {nextMode:'auth',token}
        }
    }
    function onAuth({userId,token,logout}){
        setToken(token)
        setUserId(userId);
        setAuth(true)
    }
    function preview() {
        return (
            <div className='example'>
                {
                    <ul>
                        {!auth && <li>imagine a valid username is "asd" and its password is "123"</li>}
                        <li>in this example we use <strong style={{background:'yellow'}}>loginInstance.getUserId()</strong></li>
                    </ul>
                }
                {!auth && loginInstance.render()}
                {
                    auth && 
                    <ul>
                        <li style={{color:'green'}}>{`you are now autenticated and you entered to app`}</li>
                        <li>{`your token is "${token}"`}</li>
                        <li>{`your userId is "${userId}"`}</li>
                        <li><button onClick={()=>{loginInstance.removeToken(); setToken(false)}}>{token?'Remove Token':'your token is removed'}</button></li>
                        <li><button onClick={()=>window.location.reload()}>Reload Page</button></li>
                    </ul>
                }
                {
                    !auth &&
                    <ul>
                        <li style={{color:'red'}}>{`you are not autenticated and you cannot inter to app`}</li>
                        
                    </ul>
                }
                {
                    AIODoc().Code(`
function LoginPage() {
    //use useState To create instance only once
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintest',
            checkToken:(token)=>true,
            onAuth,
            onSubmit,
            timer:10,
            modes:['userName']
        })
    )
    let [auth,setAuth] = useState(false);
    let [userId,setUserId] = useState('');
    let [token,setToken] = useState('');
    function onSubmit(model,mode){
        if(model.login.userId !== 'asd'){
            return {nextMode:'error',error:'cannot find this userId'}
        }
        else if(model.login.password !== '123'){
            return {nextMode:'error',error:'password is incorrect'}
        }
        else {
            let token = 'my test token';
            return {nextMode:'auth',token}
        }
    }
    function onAuth({userId,token,logout}){
        setToken(token)
        setUserId(userId);
        setAuth(true)
    }
    if(auth){
        return (
            <>
                <ul>
                    <li style={{color:'green'}}>
                        you are now autenticated and you entered to app
                    </li>
                    <li>
                        {\`your token is ${'${token}'}\`}
                    </li>
                    <li>
                        {\`your userId is ${"${userId}"}\`}
                    </li>

                    <li>
                        <button 
                            onClick={()=>{
                                loginInstance.removeToken(); 
                                setToken(false);
                            }}
                        >{token?'Remove Token':'your token is removed'}</button>
                    </li>
                    <li>
                        <button 
                            onClick={()=>window.location.reload()}
                        >Reload Page</button>
                    </li>
                </ul>
            </>
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
function Logout() {
    let [loginInstance] = useState(
        new AIOLogin({id:'mylogintestlogout',checkToken:(token)=>true,onAuth,onSubmit,timer:10,modes:['userName']})
    )
    let [auth,setAuth] = useState(false);
    let [userId] = useState(loginInstance.getUserId());
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(model.login.userId !== 'asd'){
            return {nextMode:'error',error:'cannot find this userId'}
        }
        else if(model.login.password !== '123'){
            return {nextMode:'error',error:'password is incorrect'}
        }
        else {
            let token = 'my test token';
            setToken(token);
            return {nextMode:'auth',token}
        }
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    function preview() {
        return (
            <div className='example'>
                {
                    <ul>
                        {!auth && <li>imagine a valid username is "asd" and its password is "123"</li>}
                        <li>in this example we use <strong style={{background:'yellow'}}>loginInstance.logout()</strong></li>
                    </ul>
                }
                {!auth && loginInstance.render()}
                {
                    auth && 
                    <ul>
                        <li style={{color:'green'}}>{`you are now autenticated and you entered to app`}</li>
                        <li>{`your token is "${token}"`}</li>
                        <li>{`your userId is "${userId}"`}</li>
                        <li><button onClick={()=>{loginInstance.logout();}}>Logout</button></li>
                    </ul>
                }
                {
                    !auth &&
                    <ul>
                        <li style={{color:'red'}}>{`you are not autenticated and you cannot inter to app`}</li>
                        
                    </ul>
                }
                {
                    AIODoc().Code(`
function LoginPage() {
    //use useState To create instance only once
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintest',
            checkToken:(token)=>true,
            onAuth,
            onSubmit,
            timer:10,
            modes:['userName']
        })
    )
    let [auth,setAuth] = useState(false);
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(model.login.userId !== 'asd'){
            return {nextMode:'error',error:'cannot find this userId'}
        }
        else if(model.login.password !== '123'){
            return {nextMode:'error',error:'password is incorrect'}
        }
        else {
            let token = 'my test token';
            setToken(token);
            return {nextMode:'auth',token}
        }
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    if(auth){
        return (
            <>
                <ul>
                    <li style={{color:'green'}}>
                        you are now autenticated and you entered to app
                    </li>
                    <li>
                        {\`your token is ${'${token}'}\`}
                    </li>
                    <li>
                        {\`your userId is ${"${userId}"}\`}
                    </li>
                    <li>
                        <button 
                            onClick={()=>{
                                loginInstance.removeToken(); 
                                setToken(false);
                            }}
                        >{token?'Remove Token':'your token is removed'}</button>
                    </li>
                    <li>
                        <button onClick={()=>loginInstance.logout()}>Logout</button>
                    </li>
                </ul>
            </>
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
function Modes() {
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintestmodes',checkToken:(token)=>true,onAuth,onSubmit,timer:10,
            modes:['OTPNumber','userName','email','phoneNumber'],otpLength:5
        })
    )
    let [auth,setAuth] = useState(false);
    let [userId,setUserId] = useState(loginInstance.getUserId());
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(mode === 'userName'){
            if(model.login.userId !== 'asd'){
                return {nextMode:'error',error:'cannot find this userId'}
            }
            else if(model.login.password !== '123'){
                return {nextMode:'error',error:'password is incorrect'}
            }
        }
        else if(mode === 'email'){
            if(model.login.userId !== 'a@b.com'){
                return {nextMode:'error',error:'cannot find this userId'}
            }
            else if(model.login.password !== '123'){
                return {nextMode:'error',error:'password is incorrect'}
            }
        }
        else if(mode === 'phoneNumber'){
            if(model.login.userId !== '09111111111'){
                return {nextMode:'error',error:'cannot find this userId'}
            }
            else if(model.login.password !== '123'){
                return {nextMode:'error',error:'password is incorrect'}
            }
        }
        else if(mode === 'OTPNumber'){
            if(model.login.userId !== '09111111111'){
                return {nextMode:'error',error:'cannot find this userId'}
            }
            else {
                return {nextMode:'OTPCode'}
            }
        }
        else if(mode === 'OTPCode'){
            if(model.login.password !== '12345'){
                return {nextMode:'error',error:'code is incorrect'}
            }
        }
        let token = 'my test token';
        setToken(token);
        setUserId(model.login.userId);
        return {nextMode:'auth',token}
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    function preview() {
        return (
            <div className='example'>
                {
                    <ul>
                        {!auth && <li>imagine a valid userName is "asd" and its password is "123"</li>}
                        {!auth && <li>imagine a valid email is "a@b.com" and its password is "123"</li>}
                        {!auth && <li>imagine a valid phoneNumber is "09111111111" and its password is "123"</li>}
                        {!auth && <li>imagine a valid OTPNumber is "09111111111" and its password is "12345"</li>}
                        <li>in this example we set 4 <strong style={{background:'yellow'}}>modes</strong> of login ('OTPNumber','phoneNumber','userName','email')</li>
                        <li>in this example we set <strong style={{background:'yellow'}}>otpLength</strong> 5</li>
                    </ul>
                }
                {!auth && loginInstance.render()}
                {
                    auth && 
                    <ul>
                        <li style={{color:'green'}}>{`you are now autenticated and you entered to app`}</li>
                        <li>{`your token is "${token}"`}</li>
                        <li>{`your userId is "${userId}"`}</li>
                        <li>
                            <button onClick={()=>loginInstance.logout()}>Logout</button>
                        </li>
                        
                    </ul>
                }
                {
                    !auth &&
                    <ul>
                        <li style={{color:'red'}}>{`you are not autenticated and you cannot inter to app`}</li>
                        
                    </ul>
                }
                {
                    AIODoc().Code(`
function LoginPage() {
    //use useState To create instance only once
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintest',
            checkToken:(token)=>true,
            onAuth,
            onSubmit,
            timer:10,
            modes:['OTPNumber','userName','email','phoneNumber'],
            otpLength:5
        })
    )
    let [auth,setAuth] = useState(false);
    let [userId,setUserId] = useState();
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(mode === 'userName'){
            if(model.login.userId !== 'asd'){
                return {nextMode:'error',error:'cannot find this userId'}
            }
            else if(model.login.password !== '123'){
                return {nextMode:'error',error:'password is incorrect'}
            }
        }
        else if(mode === 'email'){
            if(model.login.userId !== 'a@b.com'){
                return {nextMode:'error',error:'cannot find this userId'}
            }
            else if(model.login.password !== '123'){
                return {nextMode:'error',error:'password is incorrect'}
            }
        }
        else if(mode === 'phoneNumber'){
            if(model.login.userId !== '09111111111'){
                return {nextMode:'error',error:'cannot find this userId'}
            }
            else if(model.login.password !== '123'){
                return {nextMode:'error',error:'password is incorrect'}
            }
        }
        else if(mode === 'OTPNumber'){
            if(model.login.userId !== '09111111111'){
                return {nextMode:'error',error:'cannot find this userId'}
            }
            else {
                return {nextMode:'OTPCode'}
            }
        }
        else if(mode === 'OTPCode'){
            if(model.login.password !== '12345'){
                return {nextMode:'error',error:'code is incorrect'}
            }
        }
        let token = 'my test token';
        setToken(token);
        setUserId(model.login.userId);
        return {nextMode:'auth',token}
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    if(auth){
        return (
            <>
                <ul>
                    <li style={{color:'green'}}>
                        you are now autenticated and you entered to app
                    </li>
                    <li>
                        {\`your token is ${'${token}'}\`}
                    </li>
                    <li>
                        {\`your userId is ${'${userId}'}\`}
                    </li>
                    <li>
                        <button onClick={()=>loginInstance.logout()}>Logout</button>
                    </li>
                </ul>
            </>
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
function RegisterTypeMode() {
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintestregistertypemode',checkToken:(token)=>true,onAuth,onSubmit,timer:10,
            modes:['OTPNumber'],otpLength:5,
            register:{
                type:'mode',
                fields:[
                    {type:'text',before:<Icon path={mdiAccount} size={0.7}/>,label:'نام',field:'name'},
                    {type:'text',before:<Icon path={mdiAccount} size={0.7}/>,label:'نام خانوادگی',field:'family'},
                    {type:'password',before:<Icon path={mdiLock} size={0.7}/>,label:'رمز ثابت',field:'password'},
                ],
                text:'ایجاد حساب کاربری'
            }
        })
    )
    let [auth,setAuth] = useState(false);
    let [userId,setUserId] = useState(loginInstance.getUserId());
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(mode === 'OTPNumber'){
            if(model.login.userId !== '09111111111'){
                return {nextMode:'error',error:'cannot find this userId'}
            }
            else {
                return {nextMode:'OTPCode'}
            }
        }
        else if(mode === 'OTPCode'){
            if(model.login.password !== '12345'){
                return {nextMode:'error',error:'code is incorrect'}
            }
            else {
                return {nextMode:'register'}
            }
        }
        else if(mode === 'register'){
            console.log('register object : ',model.register)
            let token = 'my test token';
            setToken(token);
            setUserId(model.login.userId);
            return {nextMode:'auth',token}
        }
        
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    function preview() {
        return (
            <div className='example'>
                {
                    <ul>
                        {!auth && <li>imagine a valid OTPNumber is "09111111111" and its password is "12345"</li>}
                        <li>in this example we set <strong style={{background:'yellow'}}>register</strong> props </li>
                    </ul>
                }
                {!auth && loginInstance.render()}
                {
                    auth && 
                    <ul>
                        <li style={{color:'green'}}>{`you are now autenticated and you entered to app`}</li>
                        <li>{`your token is "${token}"`}</li>
                        <li>{`your userId is "${userId}"`}</li>
                        <li>
                            <button onClick={()=>loginInstance.logout()}>Logout</button>
                        </li>
                        
                    </ul>
                }
                {
                    !auth &&
                    <ul>
                        <li style={{color:'red'}}>{`you are not autenticated and you cannot inter to app`}</li>
                        
                    </ul>
                }
                {
                    AIODoc().Code(`
function LoginPage() {
    //use useState To create instance only once
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintest',
            checkToken:(token)=>true,
            onAuth,
            onSubmit,
            timer:10,
            modes:['OTPNumber'],otpLength:5,
            register:{
                type:'mode',
                fields:[
                    {type:'text',before:<Icon path={mdiAccount} size={0.7}/>,label:'نام',field:'name'},
                    {type:'text',before:<Icon path={mdiAccount} size={0.7}/>,label:'نام خانوادگی',field:'family'},
                    {type:'password',before:<Icon path={mdiLock} size={0.7}/>,label:'رمز ثابت',field:'password'},
                ],
                text:'ایجاد حساب کاربری'
            },
            otpLength:5
        })
    )
    let [auth,setAuth] = useState(false);
    let [userId,setUserId] = useState();
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(mode === 'OTPNumber'){
            if(model.login.userId !== '09111111111'){
                return {nextMode:'error',error:'cannot find this userId'}
            }
            else {
                return {nextMode:'OTPCode'}
            }
        }
        else if(mode === 'OTPCode'){
            if(model.login.password !== '12345'){
                return {nextMode:'error',error:'code is incorrect'}
            }
            else {
                return {nextMode:'register'}
            }
        }
        else if(mode === 'register'){
            console.log('register object : ',model.register)
            let token = 'my test token';
            setToken(token);
            setUserId(model.login.userId);
            return {nextMode:'auth',token}
        }
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    if(auth){
        return (
            <>
                <ul>
                    <li style={{color:'green'}}>
                        you are now autenticated and you entered to app
                    </li>
                    <li>
                        {\`your token is ${'${token}'}\`}
                    </li>
                    <li>
                        {\`your userId is ${'${userId}'}\`}
                    </li>
                    <li>
                        <button onClick={()=>loginInstance.logout()}>Logout</button>
                    </li>
                </ul>
            </>
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
function RegisterTypeButton() {
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintestregistertypebutton',checkToken:(token)=>true,onAuth,onSubmit,timer:10,
            modes:['OTPNumber'],otpLength:5,
            register:{
                type:'button',
                fields:[
                    {type:'text',before:<Icon path={mdiAccount} size={0.7}/>,label:'نام',field:'name'},
                    {type:'text',before:<Icon path={mdiAccount} size={0.7}/>,label:'نام خانوادگی',field:'family'},
                    {type:'password',before:<Icon path={mdiLock} size={0.7}/>,label:'رمز ثابت',field:'password'},
                ],
                text:'ایجاد حساب کاربری'
            }
        })
    )
    let [auth,setAuth] = useState(false);
    let [userId,setUserId] = useState(loginInstance.getUserId());
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(mode === 'OTPNumber'){
            if(model.login.userId !== '09111111111'){
                return {nextMode:'error',error:'cannot find this userId'}
            }
            else {
                return {nextMode:'OTPCode'}
            }
        }
        else if(mode === 'OTPCode'){
            if(model.login.password !== '12345'){
                return {nextMode:'error',error:'code is incorrect'}
            }
            else {
                return {nextMode:'register'}
            }
        }
        else if(mode === 'register'){
            console.log('register object : ',model.register)
            let token = 'my test token';
            setToken(token);
            setUserId(model.login.userId);
            return {nextMode:'auth',token}
        }
        
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    function preview() {
        return (
            <div className='example'>
                {
                    <ul>
                        {!auth && <li>imagine a valid OTPNumber is "09111111111" and its password is "12345"</li>}
                        <li>in this example we set <strong style={{background:'yellow'}}>register</strong> props </li>
                    </ul>
                }
                {!auth && loginInstance.render()}
                {
                    auth && 
                    <ul>
                        <li style={{color:'green'}}>{`you are now autenticated and you entered to app`}</li>
                        <li>{`your token is "${token}"`}</li>
                        <li>{`your userId is "${userId}"`}</li>
                        <li>
                            <button onClick={()=>loginInstance.logout()}>Logout</button>
                        </li>
                        
                    </ul>
                }
                {
                    !auth &&
                    <ul>
                        <li style={{color:'red'}}>{`you are not autenticated and you cannot inter to app`}</li>
                        
                    </ul>
                }
                {
                    AIODoc().Code(`
function LoginPage() {
    //use useState To create instance only once
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintest',
            checkToken:(token)=>true,
            onAuth,
            onSubmit,
            timer:10,
            modes:['OTPNumber'],otpLength:5,
            register:{
                type:'button',
                fields:[
                    {type:'text',before:<Icon path={mdiAccount} size={0.7}/>,label:'نام',field:'name'},
                    {type:'text',before:<Icon path={mdiAccount} size={0.7}/>,label:'نام خانوادگی',field:'family'},
                    {type:'password',before:<Icon path={mdiLock} size={0.7}/>,label:'رمز ثابت',field:'password'},
                ],
                text:'ایجاد حساب کاربری'
            },
            otpLength:5
        })
    )
    let [auth,setAuth] = useState(false);
    let [userId,setUserId] = useState();
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(mode === 'OTPNumber'){
            if(model.login.userId !== '09111111111'){
                return {nextMode:'error',error:'cannot find this userId'}
            }
            else {
                return {nextMode:'OTPCode'}
            }
        }
        else if(mode === 'OTPCode'){
            if(model.login.password !== '12345'){
                return {nextMode:'error',error:'code is incorrect'}
            }
            else {
                return {nextMode:'register'}
            }
        }
        else if(mode === 'register'){
            console.log('register object : ',model.register)
            let token = 'my test token';
            setToken(token);
            setUserId(model.login.userId);
            return {nextMode:'auth',token}
        }
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    if(auth){
        return (
            <>
                <ul>
                    <li style={{color:'green'}}>
                        you are now autenticated and you entered to app
                    </li>
                    <li>
                        {\`your token is ${'${token}'}\`}
                    </li>
                    <li>
                        {\`your userId is ${'${userId}'}\`}
                    </li>
                    <li>
                        <button onClick={()=>loginInstance.logout()}>Logout</button>
                    </li>
                </ul>
            </>
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
function RegisterTypeTab() {
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintestregistertypetab',checkToken:(token)=>true,onAuth,onSubmit,timer:10,
            modes:['OTPNumber'],otpLength:5,
            register:{
                type:'tab',
                fields:[
                    {type:'text',before:<Icon path={mdiAccount} size={0.7}/>,label:'نام',field:'name'},
                    {type:'text',before:<Icon path={mdiAccount} size={0.7}/>,label:'نام خانوادگی',field:'family'},
                    {type:'password',before:<Icon path={mdiLock} size={0.7}/>,label:'رمز ثابت',field:'password'},
                ],
                text:'ایجاد حساب کاربری'
            }
        })
    )
    let [auth,setAuth] = useState(false);
    let [userId,setUserId] = useState(loginInstance.getUserId());
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(mode === 'OTPNumber'){
            if(model.login.userId !== '09111111111'){
                return {nextMode:'error',error:'cannot find this userId'}
            }
            else {
                return {nextMode:'OTPCode'}
            }
        }
        else if(mode === 'OTPCode'){
            if(model.login.password !== '12345'){
                return {nextMode:'error',error:'code is incorrect'}
            }
            else {
                return {nextMode:'register'}
            }
        }
        else if(mode === 'register'){
            console.log('register object : ',model.register)
            let token = 'my test token';
            setToken(token);
            setUserId(model.login.userId);
            return {nextMode:'auth',token}
        }
        
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    function preview() {
        return (
            <div className='example'>
                {
                    <ul>
                        {!auth && <li>imagine a valid OTPNumber is "09111111111" and its password is "12345"</li>}
                        <li>in this example we set <strong style={{background:'yellow'}}>register</strong> props </li>
                    </ul>
                }
                {!auth && loginInstance.render()}
                {
                    auth && 
                    <ul>
                        <li style={{color:'green'}}>{`you are now autenticated and you entered to app`}</li>
                        <li>{`your token is "${token}"`}</li>
                        <li>{`your userId is "${userId}"`}</li>
                        <li>
                            <button onClick={()=>loginInstance.logout()}>Logout</button>
                        </li>
                        
                    </ul>
                }
                {
                    !auth &&
                    <ul>
                        <li style={{color:'red'}}>{`you are not autenticated and you cannot inter to app`}</li>
                        
                    </ul>
                }
                {
                    AIODoc().Code(`
function LoginPage() {
    //use useState To create instance only once
    let [loginInstance] = useState(
        new AIOLogin({
            id:'mylogintest',
            checkToken:(token)=>true,
            onAuth,
            onSubmit,
            timer:10,
            modes:['OTPNumber'],otpLength:5,
            register:{
                type:'tab',
                fields:[
                    {type:'text',before:<Icon path={mdiAccount} size={0.7}/>,label:'نام',field:'name'},
                    {type:'text',before:<Icon path={mdiAccount} size={0.7}/>,label:'نام خانوادگی',field:'family'},
                    {type:'password',before:<Icon path={mdiLock} size={0.7}/>,label:'رمز ثابت',field:'password'},
                ],
                text:'ایجاد حساب کاربری'
            },
            otpLength:5
        })
    )
    let [auth,setAuth] = useState(false);
    let [userId,setUserId] = useState();
    let [token,setToken] = useState(loginInstance.getToken());
    function onSubmit(model,mode){
        if(mode === 'OTPNumber'){
            if(model.login.userId !== '09111111111'){
                return {nextMode:'error',error:'cannot find this userId'}
            }
            else {
                return {nextMode:'OTPCode'}
            }
        }
        else if(mode === 'OTPCode'){
            if(model.login.password !== '12345'){
                return {nextMode:'error',error:'code is incorrect'}
            }
            else {
                return {nextMode:'register'}
            }
        }
        else if(mode === 'register'){
            console.log('register object : ',model.register)
            let token = 'my test token';
            setToken(token);
            setUserId(model.login.userId);
            return {nextMode:'auth',token}
        }
    }
    function onAuth({userId,token,logout}){
        setAuth(true)
    }
    if(auth){
        return (
            <>
                <ul>
                    <li style={{color:'green'}}>
                        you are now autenticated and you entered to app
                    </li>
                    <li>
                        {\`your token is ${'${token}'}\`}
                    </li>
                    <li>
                        {\`your userId is ${'${userId}'}\`}
                    </li>
                    <li>
                        <button onClick={()=>loginInstance.logout()}>Logout</button>
                    </li>
                </ul>
            </>
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
function SetUserInfoGetUserInfo(){
    return 'should implement'
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




