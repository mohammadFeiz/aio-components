import { FC, useEffect, useState } from "react";
import { AILogin, I_login_key } from "../../npm/aio-input";
import axios from "axios";
import Icon from "@mdi/react";
import { mdiApplication } from "@mdi/js";
import Code from "../../code";

import DOC from '../../resuse-components/doc.tsx';
const DOC_Login: FC = (props: any) => {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items: () => [
                    { text: 'Login and Register', id: 'landr', render: () => <LoginRegister /> }
                ]
            }}
        />
    )
}
export default DOC_Login
const LoginRegister: FC = () => {
    const base_url = 'http://localhost:5000'
    const [errorPage, setErrorPage] = useState<boolean>(false)
    return (
        <AILogin
            id='logindocumentation'
            rtl={true}
            attrs={{ style: { position: 'absolute' } }}
            translate={(key: I_login_key) => {
                if (key === "userpassTitle") { return 'ورود' }
                if (key === "registerTitle") { return 'ثبت نام' }
                if (key === "switchregister") { return 'ثبت نام' }
                if (key === "switchuserpass") { return 'ورود' }
                if (key === "userpassButton") { return 'ورود به برنامه' }
                if (key === "registerButton") { return 'ثبت نام در برنامه' }
                if (key === "rePasswordMatch") { return 'رمز عبور با تکرار آن مطابقت ندارد' }
                if (key === "userNameRequired") { return 'نام کاربری ضروری است' }
                if (key === "passwordRequired") { return 'رمز عبور ضروری است' }
                if (key === "rePasswordRequired") { return 'تکرار رمز عبور ضروری است' }
                if (key === "switchotp") { return 'ورود با رمز یکبار مصرف' }
                if (key === "otpnumberTitle") { return 'شماره همراه' }
                if (key === "otpcodeTitle") { return 'کد یکبار مصرف' }
            }}
            checkToken={async (token, callback) => {
                axios.get(`${base_url}/auth/checkToken`, { headers: { authorization: `Bearer ${token}` } })
                    .then(response => callback(true))
                    .catch(response => {
                        if (response.status === 401) { callback(false) }
                        else {
                            let subtext;
                            try { subtext = response.response.data.message }
                            catch { subtext = 'network error or service is down' }
                            setErrorPage(true)
                        }
                    })
            }}
            modes={{
                mode:'userpass',
                userpass:{
                    onSubmit: async (model, setAlert) => {
                        return {
                            method:'post',
                            url:`${base_url}/auth/login`,
                            body:{ userName: model.userName, password: model.password },
                            onSuccess:(response)=>{
                                const token = response.data.token;
                                let user: any = response.data.user
                                user = { ...user, id: user._id }
                                return { user, token }
                            },
                            onCatch:(response)=>{
                                setAlert({ type: 'error', closeText: 'Close', text: `login Failed`, subtext: response.response.data.message })
                            }
                        }
                    }
                },
                register:{
                    onSubmit: async (model, setAlert) => {
                        return {
                            method:'post',url:`${base_url}/auth/register`,onSuccess:(response)=>true,
                            body:{userName:model.userName,password:model.password,role:model.register.role},
                            onCatch:(response)=>setAlert({ type: 'error', closeText: 'Close', text: `register Failed`, subtext: response.response.data.message })
                        }
                    },
                    inputs:(model)=>[
                        {
                            type: 'radio', field: 'role',defaultValue:'user', value: 'user', options: [{ text: 'User', value: 'user' }, { text: 'Admin', value: 'admin' }]
                        }
                    ]
                }
            }}
            before={(
                <div className="jflex-row jalign-v">
                    <Logo />
                    <div className='jflex-col jp-b-6'>
                        <div className="app-name">BOXIT PULS</div>
                        <div className="app-title">Tracking vehicles</div>
                    </div>
                </div>
            )}
            splash={{ html: <Splash />, time: 3000 }}
            rememberTime={7 * 24 * 60 * 60 * 1000}
            renderApp={({ user, token, logout }) => <Application user={user} token={token} logout={logout} />}
            label={(field) => {
                if (field === 'userName') { return 'نام کاربری' }
                if (field === 'password') { return 'رمز عبور' }
                if (field === 'rePassword') { return 'تکرار رمز عبور' }
                if (field === 'role') { return 'نقش کاربری' }
                return field
            }}
            validation={(field, v) => {
                if (field === 'userName') {
                    if (v.length < 6) { return 'نام کاربری باید حداقل 6 کاراکتر باشد' }
                }
                if (field === 'password') {
                    if (v.length < 6) { return 'رمز عبور باید حداقل 6 کاراکتر باشد' }
                }
                if (field === 'rePassword') {
                    if (v.length < 6) { return 'تکرار رمز عبور باید حداقل 6 کاراکتر باشد' }
                }
            }}
        />
    )
}
const Splash: FC<{ errorPage?: boolean }> = ({ errorPage }) => {
    return (
        <div className="fullscreen absolute flex-col align-vh splash">
            <div className="flex-4"></div>
            <div className="flex-row align-vh m-b-24">
                <Logo />
            </div>
            {!errorPage && <div>My Application</div>}
            {errorPage && <div className='c-14 fs-24 flex-row align-vh t-a-center p-36'>network error or service is down</div>}
            <div className="h-24"></div>
            {!errorPage && <div className="">Application Splash</div>}
            <div className="flex-4"></div>
            <div className="h-48 flex-row align-vh">version 1.0.0</div>
        </div>
    )
}


const Logo: FC = () => {
    return <Icon path={mdiApplication} size={3} />
}

const Application: FC<{ user: any, token: string, logout: () => void }> = ({ user, token, logout }) => {
    return (
        <div className="">
            <div className="msf">User Is :</div>
            {Code(JSON.stringify(user, null, 3))}
            <div className="msf">Token Is :</div>
            <div className="msf">{token}</div>
            <button onClick={logout}>Logout</button>
        </div>
    )
}