var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useForm } from "aio-input";
import { AddToAttrs, FixUrl, Storage } from "aio-utils";
import { Loading, Alert } from "aio-popup";
import axios from "axios";
import './index.css';
import { Navigate, Route, Routes } from "react-router-dom";
export function AIOLogin_updateCatchedUser(loginId, newUser) {
    const storage = new Storage('ai-login' + loginId);
    const storedData = storage.load('data');
    if (!storedData) {
        return newUser;
    }
    const newStoredData = Object.assign(Object.assign({}, storedData), { user: newUser });
    return storage.save('data', newStoredData);
}
const useLoading = (rootProps) => {
    const { register, translate = () => { }, fa, userpass, splash, otpnumber, otpcode } = rootProps;
    const [storage] = useState(new Storage('ai-login' + rootProps.id));
    const [loading] = useState(new Loading());
    const [splashing, setSplashing] = useState(!!rootProps.splash);
    const [data, setData] = useState();
    const [checkingToken, setCheckingToken] = useState();
    const [mode, setMode] = useState(getMode);
    const modeRef = useRef(mode);
    modeRef.current = mode;
    function getMode(mode) {
        let key = 'userpass';
        if (mode) {
            key = mode;
        }
        else if (rootProps.mode) {
            key = rootProps.mode;
        }
        else if (userpass) {
            key = 'userpass';
        }
        else if (otpnumber) {
            key = 'otpnumber';
        }
        else {
            key = 'userpass';
        }
        return {
            key,
            submitText: trans(key + 'Button'),
            shouldReturnsUserAndToken: key === 'userpass' || key === 'otpcode',
            title: _jsx("div", { className: "ai-login-title", children: trans(key + 'Title') })
        };
    }
    const userpassHook = useForm({
        initData: getModel().userpass,
        getLayout: (context) => {
            const { validate = () => { return undefined; } } = userpass || {};
            return getLayout({
                scroll: true,
                v: [
                    {
                        input: {
                            field: 'username', type: 'text', label: trans('username'),
                            validate: ({ field, value, data }) => validate({ data, field: field, value })
                        }
                    },
                    {
                        input: {
                            field: 'password', type: 'password', preview: true, label: trans('password'), validate: ({ field, value, data }) => validate({ data, field: field, value })
                        }
                    }
                ]
            }, context);
        },
        onSubmit: (data) => onSubmit(data)
    });
    // const otpnumberHook = useForm<{otpnumber:string}>({
    //     initData: {otpnumber:''},
    //     getLayout: (context) => {
    //         const { validate = () => { return undefined } } = otpnumber || {}
    //         const {title,submitText} = modeRef.current
    //         return getLayout({
    //             attrs: { className: "ai-login-form" },
    //             v: [
    //                 { html:title },
    //                 {
    //                     scroll: true,
    //                     v: [
    //                         {
    //                             input: { field:'otpnumber',type: 'text', maxLength: 11, filter: ['number'], label: trans('otpnumber'),validate:({value})=>validate(value) }
    //                         }
    //                     ]
    //                 },
    //                 { html: <div style={{ height: 24 }}></div>, size: 24, },
    //                 { html: context.renderSubmitButton(submitText,{ className: 'ai-login-submit' })},
    //                 { html: renderModes() }
    //             ]
    //         },context)
    //     },
    //     onSubmit: (data)=>onSubmit<string>(data.otpnumber)
    // })
    // const otpcodeHook = useForm<{otpcode:string}>({
    //     initData: {otpcode:''},
    //     getLayout: (context) => {
    //         const { validate = () => { return undefined } } = otpcode || {}
    //         return getLayout({
    //             scroll: true,
    //             v: [
    //                 {
    //                     input: { field:'otpcode',type: 'text', maxLength: otpcode?.length || 4, filter: ['number'], label: trans('otpcode'),validate:({value})=>validate(value) }
    //                 }
    //             ]
    //         },context)
    //     },
    //     onSubmit: (data)=>onSubmit<string>(data.otpcode)
    // })
    // const registerHook = useForm<I_login_model<T>["register"]>({
    //     initData: getModel().register,
    //     getLayout: (context) => {
    //         const { inputs = () => [],validate = ()=>{return undefined} } = register || {}
    //         return getLayout<I_login_model<T>["register"]>({
    //             scroll: true,
    //             v: [
    //                 { input: { field: 'username', type: 'text', label: trans('username') } },
    //                 { input: { field: 'password', type: 'password', preview: true, label: trans('password') } },
    //                 { input: { field: 'repassword', type: 'password', preview: true, label: trans('repassword') } },
    //                 {
    //                     v: inputs(context.getData()).map((input) => {
    //                         return { input:{...input,field:`properties.${input.field}`,validate:({field,value,data})=>validate({data,field,value})} }
    //                     })
    //                 }
    //             ]
    //         },context)
    //     },
    //     onSubmit: (data)=>onSubmit<I_login_model<T>["register"]>(data)
    // })
    function onSubmit(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { path, method, body = () => { } } = rootProps[mode.key];
            const { base_url } = rootProps;
            const url = FixUrl(base_url, path);
            loading.show('login0');
            axios[method](url, body(data)).then(success).catch(response => {
                const text = getMessage(response, mode.key);
                loading.hide('login0');
                Alert({ type: 'error', title: trans(`${mode.key}Error`), text });
            });
        });
    }
    function getLayout(node, context) {
        const { title, submitText } = modeRef.current;
        return {
            attrs: { className: "ai-login-form" },
            v: [
                { html: title },
                node,
                { html: _jsx("div", { style: { height: 24 } }), size: 24, },
                { html: context.renderSubmitButton(submitText, { className: 'ai-login-submit' }) },
                { html: renderModes() }
            ]
        };
    }
    function changeMode(mode) {
        if (mode === 'userpass') {
            userpassHook.changeData(getModel().userpass);
        }
        //else if(mode === 'register'){registerHook.changeData(getModel().register)}
    }
    function success_1(response, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!rootProps[mode]) {
                return;
            }
            const { onSuccess } = rootProps[mode];
            loading.show('login0');
            const res = yield onSuccess(response);
            loading.hide('login0');
            if (typeof res !== 'object' || !res.user || typeof res.token !== 'string') {
                const message = `onSuccess of props.${mode}.${mode === 'userpass' ? 'api' : 'codeApi'} should returns {user:any,token:string}`;
                Alert({ type: 'error', title: trans(`${mode}Error`), text: message });
            }
            else {
                if (res.message) {
                    Alert({ type: 'success', text: res.message });
                }
                const { user, token } = res;
                storage.save('data', { user, token });
                setData({ user, token });
            }
        });
    }
    function success_2(response, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!rootProps[mode]) {
                return;
            }
            const { onSuccess } = rootProps[mode];
            loading.show('login0');
            const res = yield onSuccess(response);
            loading.hide('login0');
            if (res.message) {
                Alert({ type: 'success', text: res.message });
            }
            if (mode === 'otpnumber') {
                setMode(getMode('otpcode'));
            }
            else {
                setTimeout(() => window.location.reload(), 1000);
            }
        });
    }
    function success(response) {
        return __awaiter(this, void 0, void 0, function* () {
            loading.hide('login0');
            if (mode.key === 'userpass' || mode.key === 'otpcode') {
                success_1(response, mode.key);
            }
            else {
                success_2(response, mode.key);
            }
        });
    }
    const getStatus = (error, name) => {
        let title = `${name} unknown status.`, text = 'please set getStatus props in useLogin for extracting status';
        if (error.response) {
            let status = error.response.status;
            if (typeof status !== 'number') {
                const { getStatus = () => { } } = rootProps;
                status = getStatus(error);
                if (typeof status === 'number') {
                    return status;
                }
            }
        }
        Alert({ type: 'error', title, text });
    };
    const getMessage = (error, name) => {
        let title = `${name} unknown message.`, text = 'please set getMessage props in useLogin for extracting message';
        if (error.response) {
            const data = error.response.data;
            if (typeof data === 'string') {
                return data;
            }
            else if (data === null || data === void 0 ? void 0 : data.message) {
                return data.message;
            }
            else if (data === null || data === void 0 ? void 0 : data.error) {
                return data.error;
            }
            else {
                const { getMessage = () => '' } = rootProps;
                const message = getMessage(error);
                if (message) {
                    return message;
                }
            }
        }
        else if (typeof error.request === 'string') {
            return error.request;
        }
        else if (typeof error.message === 'string') {
            return error.message;
        }
        Alert({ title, text, type: 'error' });
        return 'unkown message';
    };
    const checkTokenCatch = (error) => {
        const status = getStatus(error, 'checking token');
        if (status === 401) {
            logout();
        }
        const message = getMessage(error, 'checking token');
        let title = 'error in checking token';
        if (rootProps.fa) {
            title = 'خطا در بررسی توکن';
        }
        Alert({ type: 'error', title, text: message });
    };
    const checkTokenThen = (response, user, token) => {
        const { checkToken } = rootProps;
        const { getResult = () => true } = checkToken;
        const res = getResult(response);
        if (res === true) {
            setData({ user, token });
            setCheckingToken(true);
        }
        else if (res === false) {
            logout();
        }
        else {
            Alert({ type: 'error', title: 'check token error', text: 'checkToken.getResult should returns boolean' });
        }
    };
    function CheckToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (rootProps.splash) {
                setTimeout(() => { setSplashing(false); }, rootProps.splash.time);
            }
            if (rootProps.mock) {
                setData({ user: rootProps.mock.user, token: rootProps.mock.token });
                return;
            }
            const storedData = storage.load('data', {});
            const { user, token } = storedData;
            loading.show('login0');
            const { checkToken } = rootProps;
            const { url, method = 'get', body } = checkToken;
            loading.hide('login0');
            if (user && token) {
                const headers = { authorization: `Bearer ${token}` };
                if (method === 'get') {
                    axios.get(url, { headers }).then(response => checkTokenThen(response, user, token)).catch(error => checkTokenCatch(error));
                }
                else {
                    axios.post(url, body, { headers }).then(response => checkTokenThen(response, user, token)).catch(error => checkTokenCatch(error));
                }
            }
            else {
                logout();
            }
        });
    }
    function logout() {
        storage.remove('data');
        setCheckingToken(false);
        setData(undefined);
    }
    function trans(key) {
        const dic = {
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
            otpcodeLength: { en: `otp code should be ${(otpcode === null || otpcode === void 0 ? void 0 : otpcode.length) || 4} digit`, fa: `کد یکبار مصرف باید ${(otpcode === null || otpcode === void 0 ? void 0 : otpcode.length) || 4} رقم باشد` },
            registerError: { en: 'Registeration failed', fa: 'ثبت نام با خطا روبرو شد' },
            userpassError: { en: 'login by username failed', fa: 'ورود با نام کاربری با خطا روبرو شد' },
            otpcodeError: { en: 'login by otp failed', fa: 'ورود با کد یکبار مصرف با خطا روبرو شد' },
            otpnumberError: { en: 'send otp number for receive otp code failed', fa: 'ارسال شماره همراه برای دریافت کد یکبار مصرف با خطا روبرو شد' },
        };
        return fa ? dic[key].fa : translate(key) || dic[key].en;
    }
    useEffect(() => { CheckToken(); }, []);
    function getModel() {
        let model = {
            userpass: { username: '', password: '' },
            otpnumber: '', otpcode: '',
            register: { username: '', password: '', repassword: '', properties: {} }
        };
        if (!register) {
            return model;
        }
        if (register && register.inputs && register.defaultData) {
            model.register.properties = Object.assign({}, register.defaultData);
        }
        return model;
    }
    function renderMode(modeKey) {
        const mode = modeRef.current;
        if (mode.key === modeKey) {
            return null;
        }
        return _jsx("button", { className: 'ai-login-mode', onClick: () => changeMode(modeKey), children: trans(`switch${modeKey}`) });
    }
    function renderModes() {
        return (_jsxs("div", { className: "ai-login-modes", children: [userpass && renderMode('userpass'), register && renderMode('register'), otpnumber && renderMode('otpnumber')] }));
    }
    function renderLoginBox() {
        const { key } = mode;
        if (key === 'userpass') {
            return _jsx(_Fragment, { children: userpassHook.renderLayout });
        }
        //if(key === 'register'){return <>{registerHook.renderLayout}</>}
        //if(key === 'otpnumber'){return <>{otpnumberHook.renderLayout}</>}
        //if(key === 'otpcode'){return <>{otpcodeHook.renderLayout}</>}
        return null;
    }
    const bf_layout = (type) => {
        const fn = rootProps[type];
        let content = null;
        if (fn) {
            content = fn(mode.key);
        }
        return (_jsx("div", { className: `ai-login-${type}`, children: content }));
    };
    function renderLoginPage() {
        if (checkingToken || splashing) {
            return splash ? splash.html : null;
        }
        if (!data) {
            const attrs = AddToAttrs(rootProps.attrs, { className: 'ai-login', style: { direction: !!rootProps.fa ? 'rtl' : undefined } });
            return (_jsxs("div", Object.assign({}, attrs, { children: [bf_layout('before'), " ", renderLoginBox(), " ", bf_layout('after')] })));
        }
        return _jsx(Navigate, { to: "/" });
    }
    function renderApp() {
        const { user, token } = data || {};
        const { app, base_url } = rootProps;
        if (user && token) {
            const COMP = app;
            return _jsx(COMP, { user: user, token: token, logout: logout, base_url: base_url });
        }
        if (checkingToken === false) {
            return _jsx(Navigate, { to: "/login" });
        }
        return null;
    }
    return {
        logout, storage,
        splashing, loading, checkingToken,
        data, setData,
        getMessage, trans,
        getModel,
        mode, getMode, setMode, changeMode,
        renderApp, renderLoginBox, renderLoginPage
    };
};
const useLogin = (props) => {
    const render = () => {
        const hook = useLoading(props);
        return (_jsxs(Routes, { children: [_jsx(Route, { path: '/login', element: hook.renderLoginPage() }), _jsx(Route, { path: "/*", element: hook.renderApp() })] }));
    };
    return { render };
};
export default useLogin;
