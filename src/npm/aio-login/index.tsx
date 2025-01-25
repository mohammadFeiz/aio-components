import { FC, ReactNode, useEffect, useRef, useState } from "react"
import AIOInput, { AITYPE } from "../aio-input"
import { AddToAttrs, Storage } from "../aio-utils"
import { AP_alert,Loading,Alert } from "../aio-popup"
import axios from "axios"
import './repo/index.css';

type I_loginMode = 'userpass' | 'register' | 'otpcode' | 'otpnumber'
type I_login_field = string
export type I_login_key = 'registerButton' | 'userpassButton' | 'otpnumberButton' | 'otpcodeButton' |
    'registerTitle' | 'userpassTitle' | 'otpcodeTitle' | 'otpnumberTitle' |
    'switchuserpass' | 'switchregister' | 'switchotp' |
    'repasswordMatch' | 'usernameRequired' | 'passwordRequired' | 'repasswordRequired' |
    'otpnumberRequired' | 'otpcodeLength' |
    'registerError' | 'userpassError' | 'otpcodeError' | 'otpnumberError'
type I_login_model = { username: string, password: string, otpnumber: string, otpcode: string, register: any }
type I_AILogin = {
    checkToken: (token: string) => Promise<{
        method: 'post' | 'get', url: string, body?: any
        onSuccess: (response: any) => string | boolean, onCatch: (response: any) => string | false
    }>,
    before?: (mode: I_loginMode) => ReactNode,
    after?: (mode: I_loginMode) => ReactNode,
    renderApp: (p: { user: any, token: string, logout: () => void }) => ReactNode,
    translate?: (key: I_login_key) => string | undefined,
    fa?: boolean,
    id: string,
    splash?: {
        html: ReactNode,
        time: number
    },
    label: (field: I_login_field) => string,
    validation?: (model: I_login_model, mode: I_loginMode) => string | undefined,
    otpLength?: number,
    otp?: {
        numberApi: (model: I_login_model, mode: I_loginMode) => Promise<{
            method: 'post' | 'get', url: string, body?: any,
            onSuccess: (response: any) => Promise<{ message?: string }>,
            onCatch: (response: any) => string
        }>,
        codeApi: (model: I_login_model, mode: I_loginMode) => Promise<{
            method: 'post' | 'get', url: string, body?: any,
            onSuccess: (response: any) => Promise<{ user: any, token: string, message?: string }>,
            onCatch: (response: any) => string
        }>
    },
    userpass?: {
        api: (model: I_login_model, mode: I_loginMode) => Promise<{
            method: 'post' | 'get', url: string, body?: any,
            onSuccess: (response: any) => Promise<{ user: any, token: string, message?: string }>,
            onCatch: (response: any) => string
        }>
    }
    register?: {
        defaultValue?: { [field: string]: any }
        inputs?: (model: I_login_model) => (AITYPE & { field: string })[]
        api: (model: I_login_model, mode: I_loginMode) => Promise<{
            method: 'post' | 'get', url: string, body?: any,
            onSuccess: (response: any) => Promise<{ message?: string }>,
            onCatch: (response: any) => string
        }>
    },
    mode?: I_loginMode,
    attrs?: any,
    setAttrs?: (key: I_login_key) => any,
    mock?: { user: any, token: string }
}
type I_login_modeState = {
    key: I_loginMode, inputs: () => ReactNode, title: ReactNode,
    submitText: string, shouldReturnsUserAndToken: boolean
}
export function AIOLogin_updateCatchedUser(loginId: string, newUser: any) {
    const storage = new Storage('ai-login' + loginId);
    const storedData = storage.load('data');
    if (!storedData) { return newUser }
    const newStoredData = { ...storedData, user: newUser }
    return storage.save('data', newStoredData)
}
const AILogin: FC<I_AILogin> = (props) => {
    const { translate = () => { }, otpLength = 4 } = props;
    const { validation = () => { return undefined } } = props;
    const [data, setData] = useState<{ token: string, user: any }>()
    const [storage] = useState<Storage>(new Storage('ai-login' + props.id))
    const [model, setModel] = useState<I_login_model>(getModel)
    const [loading] = useState<Loading>(new Loading())
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false)
    const modelRef = useRef(model)
    modelRef.current = model;
    console.log(modelRef.current)
    const [mode, setMode] = useState<I_login_modeState>(getMode())
    function getModeKey(): I_loginMode {
        if (props.mode) { return props.mode }
        if (props.userpass) { return 'userpass' }
        if (props.otp) { return 'otpnumber' }
        return 'userpass'
    }
    function getMode(mode?: I_loginMode): I_login_modeState {
        let res: I_login_modeState = { inputs: () => null, key: mode || getModeKey(), title: null, submitText: '', shouldReturnsUserAndToken: false }
        if (res.key === 'userpass') {
            res.inputs = () => {
                return (
                    <>
                        {getInput({ mode: res.key, field: 'username', type: 'text' })}
                        {getInput({ mode: res.key, field: 'password', type: 'text' })}
                    </>
                )
            }
            res.shouldReturnsUserAndToken = true
        }
        else if (res.key === 'register') {
            if (props.register) {
                const inputs = (props.register.inputs || (() => []))(modelRef.current) || []
                res.inputs = () => {
                    return (<>
                        {getInput({ mode: res.key, field: 'username', type: 'text' })}
                        {getInput({ mode: res.key, field: 'password', type: 'password' })}
                        {getInput({ mode: res.key, field: 'repassword', type: 'password' })}
                        {inputs.map((input) => getInput({ mode: res.key, field: input.field, type: input.type, inputProps: input }))}
                    </>)
                }
            }
        }
        else if (res.key === 'otpnumber') { res.inputs = () => getInput({ mode: res.key, field: 'otpnumber', type: 'text' }) }
        else if (res.key === 'otpcode') { res.inputs = () => getInput({ mode: res.key, field: 'otpcode', type: 'text' }); res.shouldReturnsUserAndToken = true }
        res.submitText = trans(res.key + 'Button' as I_login_key)
        res.title = <div className="ai-login-title">{trans(res.key + 'Title' as I_login_key)}</div>
        return res
    }
    function getInput(p: { mode: I_loginMode, field: string, type: AITYPE["type"], inputProps?: any }): ReactNode {
        const inputProps: any = p.inputProps || {}
        let model = modelRef.current
        if (p.mode === 'register') { model = model.register }
        const {
            maxLength = ({ otpnumber: 11, otpcode: otpLength } as any)[p.mode],
            filter = p.mode === 'otpnumber' || p.mode === 'otpcode' ? ['number'] : undefined,
            preview = p.field === 'password',
            rtl = !!props.fa,
            label = props.label(p.field)
        } = inputProps
        const inputAttrs = { ...inputProps, 'aria-label': `aio-login-${p.field}` }
        const onChange = (v: any) => {
            let model = modelRef.current
            if (p.mode === 'register') { setModel({ ...model, register: { ...model.register, [p.field]: v } }) }
            else { setModel({ ...model, [p.field]: v }) }
        }
        return (
            <AIOInput
                {...{ ...inputProps, maxLength, filter, preview, rtl, label, onChange, inputAttrs }}
                key={`${p.mode}-${p.field}`}
                value={(model as any)[p.field]}
                type={p.type}
            />
        )
    }

    function getModel() {
        let model: I_login_model = { username: '', password: '', otpnumber: '', otpcode: '', register: { username: '', password: '', repassword: '' } }
        if (!props.register) { return model }
        if (props.register?.defaultValue) {
            let register: any = {}
            for (let prop in props.register.defaultValue) {
                register[prop] = props.register.defaultValue[prop]
            }
            model.register = register
        }
        return model
    }
    const [waitingCheckToken, setWeightingCheckToken] = useState<boolean>(true)
    const [splashing, setSplashing] = useState<boolean>(!!props.splash)
    function trans(key: I_login_key) {
        const dic: { [key in I_login_key]: { fa: string, en: string } } = {
            registerButton: { en: 'Register', fa: 'ثبت نام' },
            userpassButton: { en: 'Login', fa: 'ورود' },
            otpnumberButton: { en: 'Send Number', fa: 'ارسال شماره همراه' },
            otpcodeButton: { en: 'Login', fa: 'ورود' },
            registerTitle: { en: 'Register', fa: 'ثبت نام' },
            userpassTitle: { en: 'Login', fa: 'ورود' },
            otpcodeTitle: { en: 'OTP Code', fa: 'کد یکبار مصرف' },
            otpnumberTitle: { en: 'Phone Number', fa: 'شماره همراه' },
            switchuserpass: { en: 'login by user name', fa: 'ورود با نام کاربری' },
            switchregister: { en: 'Go To Register', fa: 'ثبت نام' },
            switchotp: { en: 'login by otp', fa: 'ورود با رمز یکبار مصرف' },
            repasswordMatch: { en: 'Password is not match with Re password', fa: 'رمز عبور با تکرار آن مطابقت ندارد' },
            usernameRequired: { en: 'User Name is required', fa: 'نام کاربری ضروری است' },
            passwordRequired: { en: 'password is required', fa: 'رمز عبور ضروری است' },
            repasswordRequired: { en: 'Re Password is required', fa: 'تکرار رمز عبور ضروری است' },
            otpnumberRequired: { en: 'Phone Number is required', fa: 'شماره همراه ضروری است' },
            otpcodeLength: { en: `otp code should be ${otpLength} digit`, fa: `کد یکبار مصرف باید ${otpLength} رقم باشد` },
            registerError: { en: 'Registeration failed', fa: 'ثبت نام با خطا روبرو شد' },
            userpassError: { en: 'login by username failed', fa: 'ورود با نام کاربری با خطا روبرو شد' },
            otpcodeError: { en: 'login by otp failed', fa: 'ورود با کد یکبار مصرف با خطا روبرو شد' },
            otpnumberError: { en: 'send otp number for receive otp code failed', fa: 'ارسال شماره همراه برای دریافت کد یکبار مصرف با خطا روبرو شد' },
        }
        return props.fa ? dic[key].fa : translate(key) || dic[key].en
    }
    async function success_1(response: any, mode: 'userpass' | 'otpcode') {
        if (!props.userpass) { return }
        const { onSuccess } = await props.userpass.api(modelRef.current, 'userpass')
        loading.show('login0'); const res = await onSuccess(response); loading.hide('login0');
        if (typeof res !== 'object' || !res.user || typeof res.token !== 'string') {
            const message = `onSuccess of props.${mode}.${mode === 'userpass' ? 'api' : 'codeApi'} should returns {user:any,token:string}`
            setAlert({ type: 'error', text: trans(`${mode}Error`), subtext: message })
        }
        else {
            if (res.message) { setAlert({ type: 'success', text: res.message }) }
            const { user, token } = res;
            storage.save('data', { user, token }); setData({ user, token })
        }
    }
    async function success_2(response: any, mode: 'register' | 'otpnumber') {
        if (!props.userpass) { return }
        const { onSuccess } = await props.userpass.api(modelRef.current, 'userpass')
        loading.show('login0'); const res = await onSuccess(response); loading.hide('login0')
        if (res.message) { setAlert({ type: 'success', text: res.message }) }
        if (mode === 'otpnumber') { setMode(getMode('otpcode')) }
        else { setTimeout(() => window.location.reload(), 1000) }
    }
    async function success(response: any) {
        if (mode.key === 'userpass' || mode.key === 'otpcode') { success_1(response, mode.key) }
        else { success_2(response, mode.key) }
    }
    async function submit() {
        loading.show('login0')
        const { url, method, body, onCatch } = await (props as any)[mode.key].api(modelRef.current, mode.key)
        loading.hide('login0')
        axios[method as 'post' | 'get'](url, body).then(success).catch(response => {
            if (onCatch) { setAlert({ type: 'error', text: 'Error', subtext: onCatch(response) }) }
            else if (response.message) { setAlert({ type: 'error', text: 'Error', subtext: response.message }) }
        });
    }
    function changeMode(mode: I_loginMode) { setModel(getModel()); setMode(getMode(mode)) }
    function mode_props(key: I_loginMode) { return { className: 'ai-login-mode', onClick: () => changeMode(key) } }
    function mode_layout() {
        return (
            <div className="ai-login-modes">
                {props.userpass && mode.key !== 'userpass' && <button {...mode_props('userpass')}>{trans('switchuserpass')}</button>}
                {props.register && mode.key !== 'register' && <button {...mode_props('register')}>{trans('switchregister')}</button>}
                {props.otp && mode.key !== 'otpnumber' && <button {...mode_props('otpnumber')}>{trans('switchotp')}</button>}
            </div>
        )
    }
    function validate() {
        const model = modelRef.current
        if (mode.key === 'otpcode') {
            if ((model.otpcode || '').length !== otpLength) { return trans('otpcodeLength') }
        }
        if (mode.key === 'otpnumber') {
            if (!model.otpnumber) { return trans('otpnumberRequired') }
        }
        if (mode.key === 'userpass') {
            if (!model.username) { return trans('usernameRequired') }
        }
        if (mode.key === 'register') {
            if (!model.register.username) { return trans('usernameRequired') }
            if (!model.register.password) { return trans('passwordRequired') }
            if (!model.register.repassword) { return trans('repasswordRequired') }
            if (model.register.password !== model.register.repassword) { return trans('repasswordMatch'); }
        }
        return validation(model, mode.key)
    }
    function submit_layout() {
        const message = validate()
        return (<>
            <div className="ai-login-errors">
                {!!message && <div className="ai-login-error">{message}</div>}
            </div>
            <button className='ai-login-submit' disabled={!!message || !!submitDisabled} onClick={() => {
                setSubmitDisabled(true)
                setTimeout(() => setSubmitDisabled(false), 3000)
                submit()
            }}>{mode.submitText}</button>
        </>)
    }
    function form_layout() {
        const { title, inputs } = mode;
        return (<div className="ai-login-form">{title}{inputs()}{submit_layout()}{mode_layout()}</div>)
    }
    const bf_layout = (type: 'before' | 'after') => {
        const fn = props[type];
        let content = null;
        if (fn) { content = fn(mode.key) }
        return (<div className={`ai-login-${type}`}>{content}</div>)
    }
    function logout() { storage.remove('data'); window.location.reload(); }
    async function CheckToken() {
        if (props.splash) { setTimeout(() => { setSplashing(false) }, props.splash.time); }
        if (props.mock) {
            setData({ user: props.mock.user, token: props.mock.token })
            return
        }
        const storedData = storage.load('data', {}), { user, token } = storedData;
        loading.show('login0')
        const { url, method, onSuccess, onCatch } = await props.checkToken(token || '');
        loading.hide('login0')
        if (user && token) {
            axios[method](url, { headers: { authorization: `Bearer ${token}` } })
                .then(response => {
                    let res;
                    try { res = onSuccess(response); }
                    catch (err: any) { setAlert({ type: 'error', text: 'checkToken failed', subtext: err.message }); return }
                    if (res === true) { setData({ user, token }) }
                    else if (res === false) { logout() }
                    else { setAlert({ type: 'error', text: 'checkToken failed', subtext: 'checkToken props should return string as error or true as token is valid and false as token is invalid' }) }
                })
                .catch(response => {
                    let res, message: string = '';
                    try { res = onCatch(response) }
                    catch (err: any) { message = err.message }
                    if (typeof res === 'string') { message = res }
                    else if (res === false) { logout() }
                    else { message = 'AILogin checkToken onCatch props should returns string as error or false as invalid token' }
                    if (message) { setAlert({ type: 'error', text: 'checkToken failed', subtext: message }) }
                    else if (response.message) { setAlert({ type: 'error', text: 'Error', subtext: response.message }) }

                })

        }
        setWeightingCheckToken(false)
    }
    useEffect(() => { CheckToken() }, [])
    function setAlert(p: AP_alert) { Alert(p) }
    function getContent() {
        if (waitingCheckToken || splashing) { return props.splash ? props.splash.html : null }
        if (!data) {
            const attrs = AddToAttrs(props.attrs, { className: 'ai-login', style: { direction: !!props.fa ? 'rtl' : undefined } })
            return (<div {...attrs}>{bf_layout('before')} {form_layout()} {bf_layout('after')}</div>)
        }
        return props.renderApp({ token: data.token, user: data.user, logout })
    }
    return (<>{getContent()}</>)
}
export default AILogin