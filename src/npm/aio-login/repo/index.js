var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
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
    const { register, translate = () => { }, fa, validate = () => { return undefined; }, userpass, splash, otpnumber, otpcode } = rootProps;
    const [storage] = useState(new Storage('ai-login' + rootProps.id));
    const [loading] = useState(new Loading());
    const [splashing, setSplashing] = useState(!!rootProps.splash);
    const [data, setData] = useState();
    const [checkingToken, setCheckingToken] = useState();
    const [mode, setMode] = useState(getMode);
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
    const formHook = useForm({
        initData: () => getModel(), fa,
        isFieldActive: (field) => mode.key === field.split('.')[0],
        inputs: () => {
            let inputs = {
                'userpass.username': { type: 'text', label: trans('username') },
                'userpass.password': { type: 'password', preview: true, label: trans('password') },
                'register.username': { type: 'text', label: trans('username') },
                'register.password': { type: 'password', preview: true, label: trans('password') },
                'register.repassword': { type: 'password', preview: true, label: trans('repassword') },
                'otpnumber': { type: 'text', maxLength: 11, filter: ['number'], label: trans('otpnumber') },
                'otpcode': { type: 'text', maxLength: (otpcode === null || otpcode === void 0 ? void 0 : otpcode.length) || 4, filter: ['number'], label: trans('otpcode') }
            };
            if (register && register.inputs) {
                const registerInputs = register.inputs({});
                for (let field in registerInputs) {
                    const input = registerInputs[field];
                    inputs[`register.properties.${field}`] = Object.assign(Object.assign({}, input), { inputProps: Object.assign(Object.assign({}, input.inputAttrs), { 'aria-label': `aio-login-${field}` }) });
                }
            }
            return inputs;
        },
        validate: ({ field, data, value, input }) => {
            if (field === 'otpcode') {
                if ((value || '').length !== ((otpcode === null || otpcode === void 0 ? void 0 : otpcode.length) || 4)) {
                    return trans('otpcodeLength');
                }
            }
            if (!value) {
                if (field === 'otpnumber') {
                    return trans('otpnumberRequired');
                }
                if (field === 'userpass.username') {
                    return trans('usernameRequired');
                }
                if (field === 'userpass.password') {
                    return trans('passwordRequired');
                }
                if (field === 'register.username') {
                    return trans('usernameRequired');
                }
                if (field === 'register.password') {
                    return trans('passwordRequired');
                }
                if (field === 'register.repassword') {
                    return trans('repasswordRequired');
                }
            }
            if (field === 'register.repassword' && data.register.password !== value) {
                return trans('repasswordMatch');
            }
            return validate({ field, data, value, input });
        },
        onSubmit: (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { path, method, body = () => { }, onSuccess } = rootProps[mode.key];
            const { base_url } = rootProps;
            const url = FixUrl(base_url, path);
            loading.show('login0');
            loading.hide('login0');
            axios[method](url, body(data)).then(success).catch(response => {
                const subtext = getMessage(response, mode.key);
                Alert({ type: 'error', text: trans(`${mode.key}Error`), subtext });
            });
        })
    });
    function changeMode(mode) { formHook.setData(getModel()); setMode(getMode(mode)); }
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
                Alert({ type: 'error', text: trans(`${mode}Error`), subtext: message });
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
            if (mode.key === 'userpass' || mode.key === 'otpcode') {
                success_1(response, mode.key);
            }
            else {
                success_2(response, mode.key);
            }
        });
    }
    const getStatus = (error, name) => {
        let text = `${name} unknown status.`, subtext = 'please set getStatus props in useLogin for extracting status';
        if (error.response) {
            const data = error.response.data;
            let status = error.response.status;
            if (typeof status !== 'number') {
                const { getStatus = () => { } } = rootProps;
                status = getStatus(error);
                if (typeof status === 'number') {
                    return status;
                }
            }
        }
        Alert({ type: 'error', text, subtext });
    };
    const getMessage = (error, name) => {
        let text = `${name} unknown message.`, subtext = 'please set getMessage props in useLogin for extracting message';
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
        Alert({ text, subtext, type: 'error' });
        return 'unkown message';
    };
    const checkTokenCatch = (error) => {
        const status = getStatus(error, 'checking token');
        if (status === 401) {
            logout();
        }
        const message = getMessage(error, 'checking token');
        let text = 'error in checking token';
        if (rootProps.fa) {
            text = 'خطا در بررسی توکن';
        }
        Alert({ type: 'error', text, subtext: message });
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
            Alert({ type: 'error', text: 'check token error', subtext: 'checkToken.getResult should returns boolean' });
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
    const getFormNode = () => {
        let registerInputs = {};
        if (register && register.inputs) {
            registerInputs = register.inputs(formHook.data);
        }
        const registerFields = Object.keys(registerInputs);
        return {
            scroll: true,
            v: [
                { input: 'userpass.username', show: mode.key === 'userpass' },
                { input: 'userpass.password', show: mode.key === 'userpass' },
                { input: 'register.username', show: mode.key === 'register' },
                { input: 'register.password', show: mode.key === 'register' },
                { input: 'register.repassword', show: mode.key === 'register' },
                { input: 'otpnumber', show: mode.key === 'otpnumber' },
                { input: 'otpcode', show: mode.key === 'otpcode' },
                { v: registerFields.map((field) => ({ input: `register.properties.${field}`, show: mode.key === 'register' })) }
            ]
        };
    };
    function renderMode(modeKey) {
        if (mode.key === modeKey) {
            return null;
        }
        return _jsx("button", { className: 'ai-login-mode', onClick: () => changeMode(modeKey), children: trans(`switch${modeKey}`) });
    }
    function renderModes() {
        return (_jsxs("div", { className: "ai-login-modes", children: [userpass && renderMode('userpass'), register && renderMode('register'), otpnumber && renderMode('otpnumber')] }));
    }
    function renderLoginBox() {
        const { title } = mode;
        return formHook.render({
            attrs: { className: "ai-login-form" },
            v: [
                { html: title },
                getFormNode(),
                { html: _jsx("div", { style: { height: 24 } }), size: 24, },
                { submitButton: { text: mode.submitText, attrs: { className: 'ai-login-submit' } } },
                { html: renderModes() }
            ]
        });
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
        getModel, formHook,
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
