import { FC, ReactNode, useEffect, useState } from "react"
import { useForm,I_formInput, I_formHook, I_formInputs, I_formNode } from "./../../npm/aio-input"
import { AddToAttrs, FixUrl, Storage } from "./../../npm/aio-utils"
import { Loading, Alert } from "./../../npm/aio-popup"
import axios from "axios"
import './repo/index.css';
import { Navigate, Route, Routes } from "react-router-dom"

type I_loginMode = 'userpass' | 'register' | 'otpcode' | 'otpnumber'
export type I_login_key = 'registerButton' | 'userpassButton' | 'otpnumberButton' | 'otpcodeButton' |
    'registerTitle' | 'userpassTitle' | 'otpcodeTitle' | 'otpnumberTitle' |
    'switchuserpass' | 'switchregister' | 'switchotpnumber' |
    'repasswordMatch' | 'usernameRequired' | 'passwordRequired' | 'repasswordRequired' |
    'otpnumberRequired' | 'otpcodeLength' |
    'registerError' | 'userpassError' | 'otpcodeError' | 'otpnumberError' |
    'username' | 'password' | 'repassword' | 'otpnumber' | 'otpcode'
type I_login_model<T> = { userpass: { username: string, password: string }, otpnumber: string, otpcode: string, register: { username: string, password: string, repassword: string, properties: { [key in keyof T]?: T[key] | undefined } } }
type I_registerInputs = { [field:string]: I_formInput }
type I_AILogin<T> = {
    app: FC<{user:T,token:string,base_url:string,logout:()=>void}>,
    base_url: string,
    checkToken: { url: string, method?: 'post' | 'get', body?: any, getResult?: (response: any) => boolean },
    before?: (mode: I_loginMode) => ReactNode,
    after?: (mode: I_loginMode) => ReactNode,
    translate?: (key: I_login_key) => string | undefined,
    fa?: boolean,
    id: string,
    splash?: {
        html: ReactNode,
        time: number
    },
    validate?: (p:{ field:string, data:I_login_model<T>, value:any,input:I_formInput }) => string | undefined,
    otpnumber?:{
        path:string,method: 'post' | 'get',body?:(data:I_login_model<T>)=>any,
        onSuccess: (response: any) => Promise<{ message?: string }>,
    },
    otpcode?:{
        length:number,method: 'post' | 'get',body?:(data:I_login_model<T>)=>any,
        path:string,
        onSuccess: (response: any) => Promise<{ user: T, token: string, message?: string }>,
    }
    userpass?: {
        path:string,method: 'post' | 'get', body?:(data:I_login_model<T>)=>any,
        onSuccess: (response: any) => Promise<{ user: T, token: string, message?: string }>,
    }
    register?: {
        inputs?: (model: I_login_model<T>) => I_registerInputs
        path:string,method: 'post' | 'get', body?:(data:I_login_model<T>)=>any,
        onSuccess: (response: any) => Promise<{ message?: string }>,
        defaultData?:any
    },
    getStatus?: (response: any) => number,
    getMessage?: (response: any) => string
    mode?: I_loginMode,
    attrs?: { [key: string]: any },
    setAttrs?: (key: I_login_key) => any,
    mock?: { user: T, token: string }
}
type I_login_modeState = {
    key: I_loginMode, title: ReactNode,
    submitText: string, shouldReturnsUserAndToken: boolean
}
export function AIOLogin_updateCatchedUser<T>(loginId: string, newUser: T) {
    const storage = new Storage('ai-login' + loginId);
    const storedData = storage.load('data');
    if (!storedData) { return newUser }
    const newStoredData = { ...storedData, user: newUser }
    return storage.save('data', newStoredData)
}
type I_loginData<T> = { user: T, token: string }
type I_loginHook<T> = {
    logout: () => void, storage: Storage, splashing: boolean, loading: Loading, data?: I_loginData<T>,
    setData: (v: I_loginData<T>) => void, checkingToken?: boolean, getMessage: (error: any, name: string) => string,
    trans: (key: I_login_key) => string, formHook: I_formHook<I_login_model<T>>,
    mode: I_login_modeState,
    getMode: (mode?: I_loginMode) => I_login_modeState,
    setMode: (mode: I_login_modeState) => void,
    changeMode: (mode: I_loginMode) => void,
    getModel: (isInit: boolean) => I_login_model<T>,
    renderLoginBox: () => ReactNode,
    renderLoginPage: () => ReactNode,
    renderApp: () => ReactNode
}
const useLoading = <T extends Record<string, any>>(rootProps: I_AILogin<T>): I_loginHook<T> => {
    const { register, translate = () => { }, fa, validate = () => { return undefined }, userpass, splash ,otpnumber,otpcode} = rootProps;
    const [storage] = useState<Storage>(new Storage('ai-login' + rootProps.id))
    const [loading] = useState<Loading>(new Loading())
    const [splashing, setSplashing] = useState<boolean>(!!rootProps.splash)
    const [data, setData] = useState<I_loginData<T>>()
    const [checkingToken, setCheckingToken] = useState<boolean>()
    const [mode, setMode] = useState<I_login_modeState>(getMode)
    function getMode(mode?: I_loginMode): I_login_modeState {
        let key:I_loginMode = 'userpass'
        if(mode){key = mode}
        else if (rootProps.mode) { key = rootProps.mode }
        else if (userpass) { key = 'userpass' }
        else if (otpnumber) { key = 'otpnumber' }
        else {key = 'userpass'}
        return { 
            key, 
            submitText: trans(key + 'Button' as I_login_key), 
            shouldReturnsUserAndToken: key === 'userpass' || key === 'otpcode',
            title:<div className="ai-login-title">{trans(key + 'Title' as I_login_key)}</div>
        }
    }
    const formHook: I_formHook<I_login_model<T>> = useForm<I_login_model<T>>({
        initData: () => getModel(),fa,
        isFieldActive:(field)=>mode.key === field.split('.')[0],
        inputs: () => {
            let inputs: I_formInputs<I_login_model<T>> = {
                'userpass.username': { type: 'text', label: trans('username') },
                'userpass.password': { type: 'password', preview: true, label: trans('password') },
                'register.username': { type: 'text', label: trans('username')},
                'register.password': { type: 'password', preview: true, label: trans('password') },
                'register.repassword': { type: 'password', preview: true, label: trans('repassword') },
                'otpnumber': { type: 'text', maxLength: 11, filter: ['number'], label: trans('otpnumber') },
                'otpcode': { type: 'text', maxLength: otpcode?.length || 4, filter: ['number'], label: trans('otpcode') }
            }
            if (register && register.inputs) {
                const registerInputs = register.inputs({} as any)
                for (let field in registerInputs) {
                    const input = registerInputs[field];
                    (inputs as any)[`register.properties.${field}`] = { ...input, inputProps: { ...input.inputAttrs, 'aria-label': `aio-login-${field}` } }
                }
            }
            return inputs
        },
        validate: ({ field, data, value,input }) => {
            if (field === 'otpcode') {
                if ((value || '').length !== (otpcode?.length || 4)) { return trans('otpcodeLength') }
            }
            if (!value) {
                if (field === 'otpnumber') { return trans('otpnumberRequired') }
                if (field === 'userpass.username') { return trans('usernameRequired') }
                if (field === 'userpass.password') { return trans('passwordRequired') }
                if (field === 'register.username') { return trans('usernameRequired') }
                if (field === 'register.password') { return trans('passwordRequired') }
                if (field === 'register.repassword') { return trans('repasswordRequired') }
            }
            if (field === 'register.repassword' && data.register.password !== value) { return trans('repasswordMatch'); }
            return validate({ field, data, value,input })
        },
        onSubmit: async (data) => {
            const {path,method,body = ()=>{},onSuccess} = (rootProps as any)[mode.key]
            const {base_url} = rootProps;
            const url = FixUrl(base_url,path)
            loading.show('login0')
            loading.hide('login0')
            axios[method as 'post' | 'get'](url, body(data)).then(success).catch(response => {
                const subtext = getMessage(response, mode.key)
                Alert({ type: 'error', text: trans(`${mode.key}Error`), subtext })
            });
        }

    })
    function changeMode(mode: I_loginMode) { formHook.setData(getModel()); setMode(getMode(mode)) }
    async function success_1(response: any, mode: 'userpass' | 'otpcode') {
        if (!rootProps[mode]) { return }
        const {onSuccess} = rootProps[mode]
        loading.show('login0'); const res = await onSuccess(response); loading.hide('login0');
        if (typeof res !== 'object' || !res.user || typeof res.token !== 'string') {
            const message = `onSuccess of props.${mode}.${mode === 'userpass' ? 'api' : 'codeApi'} should returns {user:any,token:string}`
            Alert({ type: 'error', text: trans(`${mode}Error`), subtext: message })
        }
        else {
            if (res.message) { Alert({ type: 'success', text: res.message }) }
            const { user, token } = res;
            storage.save('data', { user, token }); setData({ user, token })
        }
    }
    async function success_2(response: any, mode: 'register' | 'otpnumber') {
        if (!rootProps[mode]) { return }
        const {onSuccess} = rootProps[mode]
        loading.show('login0'); const res = await onSuccess(response); loading.hide('login0')
        if (res.message) { Alert({ type: 'success', text: res.message }) }
        if (mode === 'otpnumber') { setMode(getMode('otpcode')) }
        else { setTimeout(() => window.location.reload(), 1000) }
    }
    async function success(response: any) {
        if (mode.key === 'userpass' || mode.key === 'otpcode') { success_1(response, mode.key) }
        else { success_2(response, mode.key) }
    }

    const getStatus = (error: any, name: string) => {
        let text = `${name} unknown status.`, subtext = 'please set getStatus props in useLogin for extracting status';
        if (error.response) {
            const data = error.response.data;
            let status = error.response.status
            if (typeof status !== 'number') {
                const { getStatus = () => { } } = rootProps;
                status = getStatus(error);
                if (typeof status === 'number') { return status }
            }
        }
        Alert({ type: 'error', text, subtext })
    }
    const getMessage = (error: any, name: string) => {
        let text = `${name} unknown message.`, subtext = 'please set getMessage props in useLogin for extracting message';
        if (error.response) {
            const data = error.response.data;
            if (typeof data === 'string') { return data }
            else if (data?.message) { return data.message }
            else if (data?.error) { return data.error }
            else {
                const { getMessage = () => '' } = rootProps;
                const message = getMessage(error);
                if (message) { return message }
            }
        }
        else if (typeof error.request === 'string') { return error.request }
        else if (typeof error.message === 'string') { return error.message }
        Alert({ text, subtext, type: 'error' });
        return 'unkown message'
    }
    const checkTokenCatch = (error: any) => {
        const status = getStatus(error, 'checking token');
        if (status === 401) { logout() }
        const message = getMessage(error, 'checking token');
        let text = 'error in checking token';
        if (rootProps.fa) { text = 'خطا در بررسی توکن' }
        Alert({ type: 'error', text, subtext: message })
    }
    const checkTokenThen = (response: any, user: T, token: string) => {
        const { checkToken } = rootProps;
        const { getResult = () => true } = checkToken;
        const res = getResult(response);
        if (res === true) { setData({ user, token }); setCheckingToken(true) }
        else if (res === false) { logout() }
        else { Alert({ type: 'error', text: 'check token error', subtext: 'checkToken.getResult should returns boolean' }) }
    }
    async function CheckToken() {
        if (rootProps.splash) { setTimeout(() => { setSplashing(false) }, rootProps.splash.time); }
        if (rootProps.mock) { setData({ user: rootProps.mock.user, token: rootProps.mock.token }); return }
        const storedData = storage.load('data', {});
        const { user, token } = storedData;
        loading.show('login0')
        const { checkToken } = rootProps;
        const { url, method = 'get', body } = checkToken;
        loading.hide('login0')
        if (user && token) {
            const headers = { authorization: `Bearer ${token}` }
            if (method === 'get') {
                axios.get(url, { headers }).then(response => checkTokenThen(response, user, token)).catch(error => checkTokenCatch(error))
            }
            else {
                axios.post(url, body, { headers }).then(response => checkTokenThen(response, user, token)).catch(error => checkTokenCatch(error))
            }
        }
        else { logout() }
    }
    function logout() {
        storage.remove('data');
        setCheckingToken(false);
        setData(undefined)
    }
    function trans(key: I_login_key): string {
        const dic: { [key in I_login_key]: { fa: string, en: string } } = {
            username: { en: 'User Name', fa: 'نام کاربری' },
            password: { en: 'Password', fa: 'رمز عبور' },
            repassword: { en: 'User Name', fa: 'تکرار رمز عبور' },
            otpnumber: { en: 'Phone Number', fa: 'شماره همراه' },
            otpcode: { en: 'One Time Code', fa: 'کد یکبار مصرف' },
            registerButton: { en: 'Register', fa: 'ثبت نام' },
            userpassButton: { en: 'Login', fa: 'ورود' },
            otpnumberButton: { en: 'Send Number', fa: 'ارسال شماره همراه' },
            otpcodeButton: { en: 'Login', fa: 'ورود' },
            registerTitle: { en: 'Register', fa: 'ثبت نام' },
            userpassTitle: { en: 'Login', fa: 'ورود' },
            otpcodeTitle: { en: 'One Time Code', fa: 'کد یکبار مصرف' },
            otpnumberTitle: { en: 'Phone Number', fa: 'شماره همراه' },
            switchuserpass: { en: 'login by user name', fa: 'ورود با نام کاربری' },
            switchregister: { en: 'Go To Register', fa: 'ثبت نام' },
            switchotpnumber: { en: 'login by otp', fa: 'ورود با رمز یکبار مصرف' },
            repasswordMatch: { en: 'Password is not match with Re password', fa: 'رمز عبور با تکرار آن مطابقت ندارد' },
            usernameRequired: { en: 'User Name is required', fa: 'نام کاربری ضروری است' },
            passwordRequired: { en: 'password is required', fa: 'رمز عبور ضروری است' },
            repasswordRequired: { en: 'Re Password is required', fa: 'تکرار رمز عبور ضروری است' },
            otpnumberRequired: { en: 'Phone Number is required', fa: 'شماره همراه ضروری است' },
            otpcodeLength: { en: `otp code should be ${otpcode?.length || 4} digit`, fa: `کد یکبار مصرف باید ${otpcode?.length || 4} رقم باشد` },
            registerError: { en: 'Registeration failed', fa: 'ثبت نام با خطا روبرو شد' },
            userpassError: { en: 'login by username failed', fa: 'ورود با نام کاربری با خطا روبرو شد' },
            otpcodeError: { en: 'login by otp failed', fa: 'ورود با کد یکبار مصرف با خطا روبرو شد' },
            otpnumberError: { en: 'send otp number for receive otp code failed', fa: 'ارسال شماره همراه برای دریافت کد یکبار مصرف با خطا روبرو شد' },
        }
        return fa ? dic[key].fa : translate(key) || dic[key].en
    }
    useEffect(() => { CheckToken() }, [])
    function getModel(): I_login_model<T> {
        let model: I_login_model<T> = {
            userpass: { username: '', password: '' },
            otpnumber: '', otpcode: '',
            register: { username: '', password: '', repassword: '', properties: {} }
        }
        if (!register) { return model }
        if (register && register.inputs && register.defaultData) {
            model.register.properties = {...register.defaultData}
        }
        return model
    }
    const getFormNode = ():I_formNode<I_login_model<T>> => {
        let registerInputs: any = {};
        if (register && register.inputs) {
            registerInputs = register.inputs(formHook.data)
        }
        const registerFields = Object.keys(registerInputs) as string[];
        return {
            scroll:true,
            v: [
                { input: 'userpass.username', show: mode.key === 'userpass' },
                { input: 'userpass.password', show: mode.key === 'userpass' },
                { input: 'register.username', show: mode.key === 'register' },
                { input: 'register.password', show: mode.key === 'register' },
                { input: 'register.repassword', show: mode.key === 'register' },
                { input: 'otpnumber', show: mode.key === 'otpnumber' },
                { input: 'otpcode', show: mode.key === 'otpcode' },
                { v: registerFields.map((field: string) => ({ input: `register.properties.${field}` as any, show: mode.key === 'register' })) }
            ]
        }
    }
    function renderMode(modeKey: I_loginMode) {
        if (mode.key === modeKey) { return null }
        return <button className='ai-login-mode' onClick={() => changeMode(modeKey)}>{trans(`switch${modeKey}` as any)}</button>
    }
    function renderModes() {
        return (
            <div className="ai-login-modes">
                {userpass && renderMode('userpass')}
                {register && renderMode('register')}
                {otpnumber && renderMode('otpnumber')}
            </div>
        )
    }
    function renderLoginBox() {
        const { title } = mode;
        return formHook.render({
            attrs:{className:"ai-login-form"},
            v:[
                {html:title},
                getFormNode(),
                {html:<div style={{height:24}}></div>,size:24,},
                {submitButton:{text:mode.submitText,attrs:{ className: 'ai-login-submit' }}},
                {html:renderModes()}
            ]
        })
    }
    const bf_layout = (type: 'before' | 'after') => {
        const fn = rootProps[type];
        let content = null;
        if (fn) { content = fn(mode.key) }
        return (<div className={`ai-login-${type}`}>{content}</div>)
    }

    function renderLoginPage() {
        if (checkingToken || splashing) { return splash ? splash.html : null }
        if (!data) {
            const attrs = AddToAttrs(rootProps.attrs, { className: 'ai-login', style: { direction: !!rootProps.fa ? 'rtl' : undefined } })
            return (<div {...attrs}>{bf_layout('before')} {renderLoginBox()} {bf_layout('after')}</div>)
        }
        return <Navigate to="/" />
    }
    function renderApp() {
        const { user, token } = data || {};
        const { app, base_url } = rootProps;
        if (user && token) {
            const COMP: FC<{ user: T, token: string, logout: () => void, base_url: string }> = app;
            return <COMP user={user} token={token} logout={logout} base_url={base_url} />
        }
        if (checkingToken === false) { return <Navigate to="/login" />; }
        return null;
    }
    return {
        logout, storage,
        splashing, loading, checkingToken,
        data, setData,
        getMessage, trans,
        getModel, formHook,
        mode, getMode, setMode, changeMode,
        renderApp, renderLoginBox, renderLoginPage
    }
}
export type I_AuthContext<T> = { user?: T, token?: string, logout: () => void, base_url: string }

const useLogin = <T extends Record<string, any>>(props: I_AILogin<T>) => {
    const render = () => {
        const hook = useLoading(props)
        return (
            <Routes>
                <Route path='/login' element={hook.renderLoginPage()} />
                <Route path="/*" element={hook.renderApp()} />
            </Routes>
        )
    }
    return { render }
}
export default useLogin