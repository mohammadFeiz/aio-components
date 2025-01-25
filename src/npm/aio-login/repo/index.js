var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createElement as _createElement } from "react";
import { Fragment as _Fragment, jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import AIOInput from "aio-input";
import { AddToAttrs, Storage } from "aio-utils";
import { Loading, Alert } from "aio-popup";
import axios from "axios";
import './index.css';
export function AIOLogin_updateCatchedUser(loginId, newUser) {
    const storage = new Storage('ai-login' + loginId);
    const storedData = storage.load('data');
    if (!storedData) {
        return newUser;
    }
    const newStoredData = Object.assign(Object.assign({}, storedData), { user: newUser });
    return storage.save('data', newStoredData);
}
const AILogin = (props) => {
    const { translate = () => { }, otpLength = 4 } = props;
    const { validation = () => { return undefined; } } = props;
    const [data, setData] = useState();
    const [storage] = useState(new Storage('ai-login' + props.id));
    const [model, setModel] = useState(getModel);
    const [loading] = useState(new Loading());
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const modelRef = useRef(model);
    modelRef.current = model;
    console.log(modelRef.current);
    const [mode, setMode] = useState(getMode());
    function getModeKey() {
        if (props.mode) {
            return props.mode;
        }
        if (props.userpass) {
            return 'userpass';
        }
        if (props.otp) {
            return 'otpnumber';
        }
        return 'userpass';
    }
    function getMode(mode) {
        let res = { inputs: () => null, key: mode || getModeKey(), title: null, submitText: '', shouldReturnsUserAndToken: false };
        if (res.key === 'userpass') {
            res.inputs = () => {
                return (_jsxs(_Fragment, { children: [getInput({ mode: res.key, field: 'username', type: 'text' }), getInput({ mode: res.key, field: 'password', type: 'text' })] }));
            };
            res.shouldReturnsUserAndToken = true;
        }
        else if (res.key === 'register') {
            if (props.register) {
                const inputs = (props.register.inputs || (() => []))(modelRef.current) || [];
                res.inputs = () => {
                    return (_jsxs(_Fragment, { children: [getInput({ mode: res.key, field: 'username', type: 'text' }), getInput({ mode: res.key, field: 'password', type: 'password' }), getInput({ mode: res.key, field: 'repassword', type: 'password' }), inputs.map((input) => getInput({ mode: res.key, field: input.field, type: input.type, inputProps: input }))] }));
                };
            }
        }
        else if (res.key === 'otpnumber') {
            res.inputs = () => getInput({ mode: res.key, field: 'otpnumber', type: 'text' });
        }
        else if (res.key === 'otpcode') {
            res.inputs = () => getInput({ mode: res.key, field: 'otpcode', type: 'text' });
            res.shouldReturnsUserAndToken = true;
        }
        res.submitText = trans(res.key + 'Button');
        res.title = _jsx("div", { className: "ai-login-title", children: trans(res.key + 'Title') });
        return res;
    }
    function getInput(p) {
        const inputProps = p.inputProps || {};
        let model = modelRef.current;
        if (p.mode === 'register') {
            model = model.register;
        }
        const { maxLength = { otpnumber: 11, otpcode: otpLength }[p.mode], filter = p.mode === 'otpnumber' || p.mode === 'otpcode' ? ['number'] : undefined, preview = p.field === 'password', rtl = !!props.fa, label = props.label(p.field) } = inputProps;
        const inputAttrs = Object.assign(Object.assign({}, inputProps), { 'aria-label': `aio-login-${p.field}` });
        const onChange = (v) => {
            let model = modelRef.current;
            if (p.mode === 'register') {
                setModel(Object.assign(Object.assign({}, model), { register: Object.assign(Object.assign({}, model.register), { [p.field]: v }) }));
            }
            else {
                setModel(Object.assign(Object.assign({}, model), { [p.field]: v }));
            }
        };
        return (_createElement(AIOInput, Object.assign({}, inputProps, { maxLength, filter, preview, rtl, label, onChange, inputAttrs, key: `${p.mode}-${p.field}`, value: model[p.field], type: p.type })));
    }
    function getModel() {
        var _a;
        let model = { username: '', password: '', otpnumber: '', otpcode: '', register: { username: '', password: '', repassword: '' } };
        if (!props.register) {
            return model;
        }
        if ((_a = props.register) === null || _a === void 0 ? void 0 : _a.defaultValue) {
            let register = {};
            for (let prop in props.register.defaultValue) {
                register[prop] = props.register.defaultValue[prop];
            }
            model.register = register;
        }
        return model;
    }
    const [waitingCheckToken, setWeightingCheckToken] = useState(true);
    const [splashing, setSplashing] = useState(!!props.splash);
    function trans(key) {
        const dic = {
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
        };
        return props.fa ? dic[key].fa : translate(key) || dic[key].en;
    }
    function success_1(response, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!props.userpass) {
                return;
            }
            const { onSuccess } = yield props.userpass.api(modelRef.current, 'userpass');
            loading.show('login0');
            const res = yield onSuccess(response);
            loading.hide('login0');
            if (typeof res !== 'object' || !res.user || typeof res.token !== 'string') {
                const message = `onSuccess of props.${mode}.${mode === 'userpass' ? 'api' : 'codeApi'} should returns {user:any,token:string}`;
                setAlert({ type: 'error', text: trans(`${mode}Error`), subtext: message });
            }
            else {
                if (res.message) {
                    setAlert({ type: 'success', text: res.message });
                }
                const { user, token } = res;
                storage.save('data', { user, token });
                setData({ user, token });
            }
        });
    }
    function success_2(response, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!props.userpass) {
                return;
            }
            const { onSuccess } = yield props.userpass.api(modelRef.current, 'userpass');
            loading.show('login0');
            const res = yield onSuccess(response);
            loading.hide('login0');
            if (res.message) {
                setAlert({ type: 'success', text: res.message });
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
    function submit() {
        return __awaiter(this, void 0, void 0, function* () {
            loading.show('login0');
            const { url, method, body, onCatch } = yield props[mode.key].api(modelRef.current, mode.key);
            loading.hide('login0');
            axios[method](url, body).then(success).catch(response => {
                if (onCatch) {
                    setAlert({ type: 'error', text: 'Error', subtext: onCatch(response) });
                }
                else if (response.message) {
                    setAlert({ type: 'error', text: 'Error', subtext: response.message });
                }
            });
        });
    }
    function changeMode(mode) { setModel(getModel()); setMode(getMode(mode)); }
    function mode_props(key) { return { className: 'ai-login-mode', onClick: () => changeMode(key) }; }
    function mode_layout() {
        return (_jsxs("div", { className: "ai-login-modes", children: [props.userpass && mode.key !== 'userpass' && _jsx("button", Object.assign({}, mode_props('userpass'), { children: trans('switchuserpass') })), props.register && mode.key !== 'register' && _jsx("button", Object.assign({}, mode_props('register'), { children: trans('switchregister') })), props.otp && mode.key !== 'otpnumber' && _jsx("button", Object.assign({}, mode_props('otpnumber'), { children: trans('switchotp') }))] }));
    }
    function validate() {
        const model = modelRef.current;
        if (mode.key === 'otpcode') {
            if ((model.otpcode || '').length !== otpLength) {
                return trans('otpcodeLength');
            }
        }
        if (mode.key === 'otpnumber') {
            if (!model.otpnumber) {
                return trans('otpnumberRequired');
            }
        }
        if (mode.key === 'userpass') {
            if (!model.username) {
                return trans('usernameRequired');
            }
        }
        if (mode.key === 'register') {
            if (!model.register.username) {
                return trans('usernameRequired');
            }
            if (!model.register.password) {
                return trans('passwordRequired');
            }
            if (!model.register.repassword) {
                return trans('repasswordRequired');
            }
            if (model.register.password !== model.register.repassword) {
                return trans('repasswordMatch');
            }
        }
        return validation(model, mode.key);
    }
    function submit_layout() {
        const message = validate();
        return (_jsxs(_Fragment, { children: [_jsx("div", { className: "ai-login-errors", children: !!message && _jsx("div", { className: "ai-login-error", children: message }) }), _jsx("button", { className: 'ai-login-submit', disabled: !!message || !!submitDisabled, onClick: () => {
                        setSubmitDisabled(true);
                        setTimeout(() => setSubmitDisabled(false), 3000);
                        submit();
                    }, children: mode.submitText })] }));
    }
    function form_layout() {
        const { title, inputs } = mode;
        return (_jsxs("div", { className: "ai-login-form", children: [title, inputs(), submit_layout(), mode_layout()] }));
    }
    const bf_layout = (type) => {
        const fn = props[type];
        let content = null;
        if (fn) {
            content = fn(mode.key);
        }
        return (_jsx("div", { className: `ai-login-${type}`, children: content }));
    };
    function logout() { storage.remove('data'); window.location.reload(); }
    function CheckToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (props.splash) {
                setTimeout(() => { setSplashing(false); }, props.splash.time);
            }
            if (props.mock) {
                setData({ user: props.mock.user, token: props.mock.token });
                return;
            }
            const storedData = storage.load('data', {}), { user, token } = storedData;
            loading.show('login0');
            const { url, method, onSuccess, onCatch } = yield props.checkToken(token || '');
            loading.hide('login0');
            if (user && token) {
                axios[method](url, { headers: { authorization: `Bearer ${token}` } })
                    .then(response => {
                    let res;
                    try {
                        res = onSuccess(response);
                    }
                    catch (err) {
                        setAlert({ type: 'error', text: 'checkToken failed', subtext: err.message });
                        return;
                    }
                    if (res === true) {
                        setData({ user, token });
                    }
                    else if (res === false) {
                        logout();
                    }
                    else {
                        setAlert({ type: 'error', text: 'checkToken failed', subtext: 'checkToken props should return string as error or true as token is valid and false as token is invalid' });
                    }
                })
                    .catch(response => {
                    let res, message = '';
                    try {
                        res = onCatch(response);
                    }
                    catch (err) {
                        message = err.message;
                    }
                    if (typeof res === 'string') {
                        message = res;
                    }
                    else if (res === false) {
                        logout();
                    }
                    else {
                        message = 'AILogin checkToken onCatch props should returns string as error or false as invalid token';
                    }
                    if (message) {
                        setAlert({ type: 'error', text: 'checkToken failed', subtext: message });
                    }
                    else if (response.message) {
                        setAlert({ type: 'error', text: 'Error', subtext: response.message });
                    }
                });
            }
            setWeightingCheckToken(false);
        });
    }
    useEffect(() => { CheckToken(); }, []);
    function setAlert(p) { Alert(p); }
    function getContent() {
        if (waitingCheckToken || splashing) {
            return props.splash ? props.splash.html : null;
        }
        if (!data) {
            const attrs = AddToAttrs(props.attrs, { className: 'ai-login', style: { direction: !!props.fa ? 'rtl' : undefined } });
            return (_jsxs("div", Object.assign({}, attrs, { children: [bf_layout('before'), " ", form_layout(), " ", bf_layout('after')] })));
        }
        return props.renderApp({ token: data.token, user: data.user, logout });
    }
    return (_jsx(_Fragment, { children: getContent() }));
};
export default AILogin;
