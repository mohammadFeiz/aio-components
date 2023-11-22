import React, { Component, createRef } from 'react';
import RVD from 'react-virtual-dom';
import AIOStorage from 'aio-storage';
import AIOInput from './../../npm/aio-input/aio-input';
import { Icon } from '@mdi/react';
import { mdiCellphone, mdiLock, mdiLoading, mdiAccount, mdiAccountBoxOutline, mdiEmail, mdiChevronRight } from '@mdi/js';

import './aio-login.css';
import AIOPopup from 'aio-popup';
export default class AIOlogin {
    constructor(props) {
        let { id, onAuth, onSubmit, modes, timer, checkToken, register, userId, attrs, forget, otpLength } = props;
        AIOLoginValidator(props);
        let storage = AIOStorage(`-AIOLogin-${id}`);
        this.setStorage = (key, value) => { storage.save({ name: key, value }); }
        this.getStorage = () => {
            let token = storage.load({ name: 'token', def: false });
            let userId = storage.load({ name: 'userId', def: '' });
            let userInfo = storage.load({ name: 'userInfo' });
            return { token, userId, userInfo }
        }
        this.setUserInfo = (userInfo) => { this.setStorage('userInfo', userInfo) }
        this.getUserInfo = () => { return this.getStorage().userInfo }
        this.setToken = (token) => { this.setStorage('token', token) }
        this.getToken = () => { return this.getStorage().token; }
        this.removeToken = () => { storage.remove({ name: 'token' }); }
        this.getUserId = () => { return this.getStorage().userId }
        this.logout = () => { this.removeToken(); window.location.reload() }
        this.props = {
            id, checkToken, onAuth, onSubmit, modes, register, userId, attrs, timer, forget, otpLength,
            getStorage: this.getStorage,
            setStorage: this.setStorage,
            removeToken: this.removeToken,
            setToken: this.setToken,
            getToken: this.getToken,
            getUserId: this.getUserId,
            logout: this.logout
        }
    }
    render = () => <AIOLOGIN {...this.props} getActions={({setMode})=>this.setMode = setMode}/>
}
class AIOLOGIN extends Component {
    constructor(props){
        super(props);
        this.state = { isTokenChecked:false,showReload: false, reportedAuthToParent: false,mode:props.modes[0],loading:false }
        props.getActions({setMode:this.setMode.bind(this)})
    }
    async checkToken() {
        let { getStorage, checkToken, removeToken } = this.props;
        let { token, userId, userInfo } = getStorage();
        let result;
        if (typeof token !== 'string') { result = false }
        else {
            try { result = await checkToken(token, { userId, userInfo }); }
            catch (err) { new AIOPopup().addAlert({ type: 'error', text: 'بررسی توکن با خطا روبرو شد', subtext: this.getError(err) }) }
        }
        if(result === true){this.setMode('auth')}
        else if (result === false) { removeToken() }
        else { 
            if (typeof result === 'string') { new AIOPopup().addAlert({ type: 'error', text: 'بررسی توکن با خطا روبرو شد', subtext: result }) }
            this.setState({ showReload: true })
        }
        this.setState({isTokenChecked:true})
    }
    getError(err) {
        if (typeof err === 'string') { return err }
        if (typeof err === 'object') {
            if (typeof err.response === 'object') {
                if (typeof err.response.data === 'object') {
                    let { message, Message } = err.response.data;
                    return Message || message;
                }
                else if (typeof err.response.data === 'string') { return err.response.data }
                else { return 'error' }
            }
            else { return err.message || err.Message }
        }
    }
    async componentDidMount() { this.checkToken(); }
    async onSubmit(model) {
        let { setStorage, removeToken, onSubmit } = this.props;
        let {mode:currentMode} = this.state;
        let res;
        this.setState({loading:false})
        try{res = await onSubmit(model, currentMode)}
        catch{this.setState({loading:false}); return;}
        this.setState({loading:false})
        if (typeof res === 'string') { 
            let text = {
                "OTPNumber": 'ارسال شماره همراه',
                "OTPCode": 'ارسال کد یکبار مصرف',
                "userName": 'ارسال نام کاربری و رمز عبور',
                "phoneNumber": 'ارسال شماره همراه و رمز عبور',
                "email": 'ارسال آدرس ایمیل و رمز عبور',
                "register": 'عملیات ثبت نام'
            }[currentMode]
            let subtext = res;
            new AIOPopup().addAlert({ type: 'error', text, subtext })
        }
        else {
            if (['OTPNumber', 'phoneNumber', 'userName', 'email'].indexOf(currentMode) !== -1) {
                setStorage('userId', model.login.userId);
            }
        }
    }
    setMode(mode){
        this.setState({mode})
    }
    render() {
        let { otpLength, onAuth, id, timer, modes, userId, register = {}, attrs = {}, forget, getStorage, logout, splash = () => null } = this.props;
        let { reportedAuthToParent, isTokenChecked, showReload,mode,loading } = this.state;
        if (showReload) { return (<div className='aio-login-reload'><button onClick={() => window.location.reload()}>بارگذاری مجدد</button></div>) }
        //اگر هنوز توکن چک نشده ادامه نده
        if (!isTokenChecked) { return splash() }
        //اگر توکن چک شده و توکن ولید بوده onAuth رو کال کن و ادامه نده
        if (mode === 'auth') {
            //برای جلوگیری از لوپ بی نهایت فقط یکبار onAuth  رو کال کن
            if (!reportedAuthToParent) {
                let { token, userId, userInfo } = getStorage();
                onAuth({ token, userId, userInfo, logout })
                setTimeout(()=>{this.setState({ reportedAuthToParent: true })},0)
            }
            return splash()
        }
        // وقتی به اینجا رسیدی یعنی توکن قطعا چک شده و ولید نبوده پس لاگین رو رندر کن
        let fields = register.fields;
        this.fields = fields;
        let registerText = register.text || 'ثبت نام'
        let props = { forget, timer, otpLength, id, modes, attrs, userId, fields, registerText }
        let html = (
            <LoginForm {...props} loading={loading}
                registerButton={register.type === 'button' ? registerText : undefined}
                registerTab={register.type === 'tab' ? registerText : undefined}
                onSubmit={this.onSubmit.bind(this)}
                onChangeMode={(mode)=>this.setMode(mode)} mode={mode}
            />
        )
        return html
    }
}
class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.storage = AIOStorage(`-AIOLogin-${props.id}`);
        let { timer = 30, fields = [] } = props;
        this.state = { fields, timer, recode: false, tab: 'login', model: this.getInitialModel(props.mode) }
    }
    getLabels(mode) {
        let { model, tab } = this.state;
        let { registerText, forget } = this.props;
        if (mode === 'OTPNumber') {
            let subtitle = 'شماره همراه خود را وارد کنید . پیامکی حاوی کد برای شما ارسال خواهد شد';
            return { inputLabel: 'شماره همراه', title: 'ورود با کد یکبار مصرف', submitText: 'ورود', subtitle }
        }
        if (mode === 'OTPCode') { return { inputLabel: 'کد پیامک شده', title: false, submitText: 'ورود', subtitle: `کد پیامک شده به شماره ی ${model.login.userId} را وارد کنید` } }
        if (mode === 'register') { return { inputLabel: false, title: registerText, submitText: registerText, subtitle: false, backButton: tab !== 'register' } }
        if (mode === 'forgetUserId') {
            let subtitle = `${forget.mode === 'phoneNumber' ? 'شماره همراه' : 'ایمیل'} خود را وارد کنید . کد باز یابی رمز عبور برای شما ارسال خواهد شد`
            return { inputLabel: forget.mode === 'email' ? 'ایمیل' : 'شماره همراه', backButton: true, title: 'بازیابی رمز عبور', submitText: 'دریافت کد بازیابی رمز', subtitle }
        }
        if (mode === 'forgetPassword') {
            let { mode } = forget;
            let subtitle = `کد ${mode === 'phoneNumber' ? 'پیامک' : 'ایمیل'} شده به ${mode === 'phoneNumber' ? 'شماره ی' : 'آدرس'} ${model.forget.userId} را وارد کنید`
            return { inputLabel: `کد ${mode === 'email' ? 'ایمیل' : 'پیامک'} شده`, backButton: true, title: 'بازیابی رمز عبور', submitText: 'تایید', subtitle }
        }
        if (mode === 'userName') { return { inputLabel: 'نام کاربری', title: 'ورود با نام کاربری', submitText: 'ورود', subtitle: false } }
        if (mode === 'email') { return { inputLabel: 'ایمیل', title: 'ورود با ایمیل', submitText: 'ورود', subtitle: false } }
        if (mode === 'phoneNumber') { return { inputLabel: 'شماره همراه', title: 'ورود با شماره همراه', submitText: 'ورود', subtitle: false } }
    }
    changeMode(mode) { 
        let {onChangeMode} = this.props;
        onChangeMode(mode);
        this.setState({ model: this.getInitialModel(mode) }) 
    }
    getInitialModel(mode) {
        if (!mode) { mode = this.props.mode }
        let { userId } = this.props;
        return { forget: {}, register: {}, login: { userId } };
    }
    title_layout({ title, backButton }) {
        if (!title) { return false }
        let { modes } = this.props;
        return {
            className: 'aio-login-title', align: 'v',
            row: [
                { show: !!backButton, html: <Icon path={mdiChevronRight} size={1} />, size: 48, align: 'vh', onClick: () => this.changeMode(modes[0]) },
                { html: title }
            ]
        }
    }
    subtitle_layout({ subtitle }) {
        if (!subtitle) { return false }
        return { html: subtitle, className: 'aio-login-subtitle' }
    }
    getInput_phoneNumber(field,getValue){
        return {
            field, label: 'شماره همراه',
            input: {
                type: 'text', justNumber: true, before: <Icon path={mdiCellphone} size={0.8} />,
                placeholder: '09...', maxLength: 11, attrs: { style: { direction: 'ltr' } }
            },
            validations: [['function', () => {
                let value = getValue();
                if (!value) { return 'شماره همراه خود را وارد کنید' }
                if (value.indexOf('09') !== 0) { return 'شماره همراه باید با 09 شروع شود' }
                if (value.length !== 11) { return 'شماره همراه باید 11 رقم باشد' }
                return false
            }]]
        }
    }
    getInput_userName(field){
        let {userId} = this.props;
        return {
            field,label: 'نام کاربری',validations: [['required']],style: { direction: 'ltr' },
            input: {type: 'text', disabled: !!userId, before: <Icon path={mdiAccount} size={0.8} />}
        }
    }
    getInput_email(field,getValue){
        let {userId} = this.props;
        return {
            field, label: 'ایمیل',style: { direction: 'ltr' } ,
            input: { type: 'text', disabled: !!userId, before: <Icon path={mdiEmail} size={0.8} />},
            validations: [['function', () => {
                let value = getValue();
                if (!value) { return 'ایمیل خود را وارد کنید' }
                let atSignIndex = value.indexOf('@');
                if (atSignIndex < 1) { return 'ایمیل خود را به درستی وارد کنید' }
                if (value.indexOf('.') === -1) { return 'ایمیل خود را به درستی وارد کنید' }
                if (value.lastIndexOf('.') > value.length - 3) { return 'ایمیل خود را به درستی وارد کنید' }
                return false
            }]],
        }
    }
    getInput_otp(field,getValue){
        let {otpLength} = this.props;
        return {
            field, label: 'رمز یکبار مصرف',
            input: {maxLength: otpLength, justNumber: true, type: 'text', placeholder: Array(otpLength).fill('-').join(''),className: 'aio-login-otp-code'},
            validations: [['function', () => {
                let {otpLength} = this.props;
                let value = getValue();
                if(!value){return 'رمز یکبار مصرف را وارد کنید'}
                return value.length !== otpLength ? `رمز یکبار مصرف باید شامل ${otpLength} کاراکتر باشد` : false
            }]]
        }
    }
    getInput_password(field,type){
        let validations;
        if(type === 2){
            validations = [['function',()=>{
                let {model} = this.state;
                let value = model.forget.reNewPassword;
                if(!value){return 'تکرار رمز عبور جدید را وارد کنید'}
                if (value.length < 1) { return 'رمز عبور را وارد کنید' }
                if (value !== model.forget.newPassword) { return 'رمز با تکرار آن مطابقت ندارد' }
                return false;
            }]]
        }
        else{validations = [['required']]}
        return {
            field, label: ['رمز عبور','رمز عبور جدید','تکرار رمز عبور جدید'][type],validations,
            input: { type: 'password', before: <Icon path={mdiLock} size={0.8} />, style: { direction: 'ltr' } , visible: true }
        }
    }
    getInputs() {
        let { fields } = this.state;
        let { forget,mode } = this.props;
        if (mode === 'register') {return [...fields.map((o) => AIOInput.defaults.getInput(o,'register'))]}
        if (mode === 'forgetUserId') {
            return [this['getInput_' + forget.mode](`value.forget.userId`,()=>this.state.model.forget.userId)]
        }
        if (mode === 'forgetPassword') {
            return [
                this.getInput_otp('value.forget.password',()=>this.state.model.forget.password),
                this.getInput_password('value.forget.newPassword',1),
                this.getInput_password('value.forget.reNewPassword',2),
            ]
        }
        if(mode === 'OTPNumber'){return [this.getInput_phoneNumber(`value.login.userId`,()=>this.state.model.login.userId)]}
        if(mode === 'OTPCode'){return [this.getInput_otp('value.login.password',()=>this.state.model.login.password)]}
        return [
            this['getInput_' + mode]('value.login.userId',()=>this.state.model.login.userId),
            this.getInput_password('value.login.password',0)
        ]
    }
    form_layout(labels) {
        let { model } = this.state,{ mode } = this.props;
        return {
            className: 'ofy-auto',
            html: (
                <AIOInput
                    type='form' key={mode} lang='fa' value={model} rtl={true}
                    onChange={(model) => this.setState({ model})}
                    inputs={{ props: { gap: 12 }, column: this.getInputs(labels) }}
                    footer={({disabled})=>this.submit_layout({submitText:labels.submitText,disabled})}
                />
            )
        }
    }
    submit_layout({ submitText,disabled }) {
        let { loading,timer,mode } = this.props;
        let layout = {
            style: { padding: '0 12px' },
            html: (<SubmitButton mode={mode} timer={timer} text={submitText} loading={loading} disabled={() => !!disabled} onClick={() => this.onSubmit()} />)
        }
        return <RVD layout={layout}/>
    }
    async onSubmit() {
        let { onSubmit } = this.props;
        let { model } = this.state;
        onSubmit(model);
    }
    
    changeUserId_layout() {
        let { mode } = this.props;
        if (mode !== 'OTPCode') { return false }
        return { onClick: () => this.changeMode('OTPNumber'), className: 'aio-login-text m-b-12', align: 'vh', html: 'تغییر شماره همراه' }
    }
    recode_layout() {
        let { model } = this.state;
        let { mode,onChangeMode } = this.props;
        if (mode !== 'OTPCode') { return false }
        return {
            className: 'aio-login-text m-b-12', html: `ارسال مجدد کد`, align: 'vh',
            onClick: () => {
                onChangeMode('OTPNumber')
                this.setState({ model: { ...model, login: { ...model.login, password: '' } } })
            }
        }
    }
    changeMode_layout() {
        let { mode,modes } = this.props;
        if (mode === 'register' || mode === 'forgetUserId' || mode === 'forgetPassword') { return false }
        let others = []
        for (let i = 0; i < modes.length; i++) {
            let key = modes[i];
            if (mode === key) { continue }
            if (mode === 'OTPCode' && key === 'OTPNumber') { continue }
            let title = { OTPNumber: 'رمز یکبار مصرف', userName: 'نام کاربری و رمز عبور', email: 'آدرس ایمیل و رمز عبور', phoneNumber: 'شماره همراه و رمز عبور' }[key];
            let icon = { OTPNumber: mdiAccount, phoneNumber: mdiCellphone, userName: mdiAccountBoxOutline, email: mdiEmail }[key]
            others.push({
                flex: 1, className: `of-visible aio-login-other-method aio-login-${key}`,
                onClick: () => this.changeMode(key),
                row: [{ html: <Icon path={icon} size={0.7} />, align: 'vh' }, { size: 6 }, { align: 'v', html: title }]
            })
        }
        if (!others.length) { return false }
        return {
            className: 'p-h-12',
            column: [
                {
                    gap: 6,
                    row: [
                        { flex: 1, html: <div className='aio-login-splitter'></div>, align: 'v' },
                        { html: 'یا ورود با', align: 'v', className: 'aio-login-or bold' },
                        { flex: 1, html: <div className='aio-login-splitter'></div>, align: 'v' },
                    ]
                },
                { size: 12 },
                { grid: others, gridCols: 1, gridRow: { gap: 12 } }
            ]
        }
    }
    registerButton_layout() {
        let { registerButton,mode } = this.props;
        if (!registerButton || mode === 'register') { return false }
        return { align: 'vh', html: (<button onClick={() => this.changeMode('register')} className='aio-login-register-button'>{registerButton}</button>) }
    }
    registerTab_layout() {
        let { registerTab, modes,mode } = this.props;
        if (registerTab === true) { registerTab = 'ثبت نام' }
        if (!registerTab) { return false }
        if (mode === 'forgetUserId' || mode === 'forgetPassword') { return false }
        return {
            html: (
                <AIOInput
                    className='aio-login-register-tabs'
                    type='tabs' value={mode === 'register' ? 'register' : 'login'}
                    options={[{ text: 'ورود', value: 'login' }, { text: registerTab, value: 'register' }]}
                    onChange={(tab) => {
                        if (tab === 'login') { this.changeMode(modes[0]) }
                        else if (tab === 'register') { this.changeMode('register') }
                    }}
                />
            )
        }
    }
    forget_layout() {
        let { forget,mode } = this.props;
        if (!forget) { return false }
        if (mode === 'register' || mode === 'OTPCode' || mode === 'OTPNumber' || mode === 'forgetUserId' || mode === 'forgetPassword') { return false }
        let { text = [] } = forget
        let buttonText = text[0] || 'رمز عبور خود را فراموش کرده اید؟ اینجا کلیک کنید';
        return { className: 'aio-login-forget', html: buttonText, onClick: () => this.changeMode('forgetUserId') }
    }
    render() {
        let { attrs,mode } = this.props, labels = this.getLabels(mode);
        return (
            <RVD
                layout={{
                    className: 'aio-login' + (attrs.className ? ' ' + attrs.className : ''), style: attrs.style,
                    attrs: { ...attrs, onKeyDown: (e) => { if (e.keyCode === 13) { this.onSubmit() } } },
                    column: [
                        this.registerTab_layout(),
                        { column: [this.title_layout(labels), this.subtitle_layout(labels)] },
                        this.form_layout(labels),
                        this.forget_layout(),
                        { gap: 12, align: 'h', row: [this.recode_layout(), this.changeUserId_layout()] },
                        this.changeMode_layout(),
                        this.registerButton_layout()
                    ]
                }}
            />
        )
    }
}
class SubmitButton extends Component {
    state = { 
        time:this.getDelta()
    }
    async onClick() {
        let { onClick, loading } = this.props;
        if (loading) { return; }
        this.setLastTry();
        await onClick();
    }
    setLastTry(){
        let {mode} = this.props;
        AIOStorage('aiologinlasttrypermode').save({name:'dic',value:{...this.getLastTry(),[mode]:new Date().getTime()}})
        let delta = this.getDelta();
        this.setState({time:delta})
    }
    getLastTry(){
        return AIOStorage('aiologinlasttrypermode').load({name:'dic',def:{}});
    }
    getDelta(){
        let {mode,timer} = this.props;
        if(!timer){return 0}
        let lastTry = this.getLastTry();
        let lastTime = lastTry[mode]
        if(!lastTime){return 0}
        let delta = new Date().getTime() - lastTime;
        delta = delta / 1000;
        delta = timer - delta;
        delta = Math.round(delta)
        if(delta < 0){delta = 0}
        return delta
    }
    render() {
        let { disabled, loading, text, outline } = this.props;
        let isDisabled = disabled();
        let loadingText = 'در حال ارسال';
        let {time} = this.state;
        if(time > 0){
            setTimeout(()=>this.setState({time:this.state.time - 1}),1000);
        }
        else if(time < 0){
            setTimeout(()=>this.setState({time:0}),0);
        }
        if(time){isDisabled = true; text = `لطفا ${time} ثانیه صبر کنید`}
        return (
            <button className={'aio-login-submit' + (outline ? ' aio-login-submit-outline' : '')} disabled={isDisabled} onClick={() => this.onClick()}>
                {!loading && text}
                {!!loading && <Icon path={mdiLoading} size={1} spin={0.2} style={{ margin: '0 6px' }} />}
                {!!loading && loadingText}
            </button>
        )
    }
}
function AIOLoginValidator(props) {
    let { id, onAuth, onSubmit, modes, timer, checkToken, register, userId = '', attrs, forget, otpLength } = props;
    for (let prop in props) {
        if (['id', 'onAuth', 'onSubmit', 'modes', 'timer', 'checkToken', 'register', 'userId', 'attrs', 'forget', 'otpLength', 'splash'].indexOf(prop) === -1) {
            let error = `
                aio-login error => invalid props 
                ${prop} is not one of AIOLogin props,
                valid props are 'id' | 'onAuth' | 'onSubmit' | 'modes' | 'timer' | 'checkToken' | 'register' | 'userId' | 'attrs' | 'forget' | 'otpLength' | 'splash'
            `;
            alert(error); console.log(error); return;
        }
    }
    if (!id) { alert(`aio-login error=> missing id props, id props should be an string`) }
    if (!onAuth) {
        let error = `
            aio-login error => missing onAuth props
            onAuth type is => ({token:string,userId:string,logout:function})=>void
        `;
        alert(error); console.log(error); return;
    }
    if (typeof userId !== 'string') {
        let error = `aio-login error=> userId props should be an string`;
        alert(error); console.log(error); return;
    }
    if (!checkToken) {
        let error = `
            aio-login error=> missing checkToken props 
            checkToken type is => (token:string)=>boolean
            for prevent it set checkToken : ()=>true
        `;
        alert(error); console.log(error); return;
    }
    if (!onSubmit) {
        let error = `
            aio-login error=> missing onSubmit props,
            onSubmit type is => 
            (model:<model type>,mode:<mode type>)=>string|undefined
            <model type> is {
                login:{userId:string,password:string | number},
                forget:{userId:string,password:string | number},
                register:{[field:string]:any}
            }
            <mode type> is 'OTPNumber' | 'OTPCode' | 'userName' | 'email' | 'phoneNumber' | 'forgetUserId' | 'forgetPassword' | 'register' | 'auth'
        `;
        alert(error); console.log(error); return;
    }
    if (typeof timer !== 'number') {
        let error = `aio-login error=> timer props should be an number`;
        alert(error); console.log(error); return;
    }
    if (!Array.isArray(modes) || !modes.filter((o) => ['OTPNumber', 'userName', 'email', 'phoneNumber'].indexOf(o) !== -1).length) {
        let error = `
            aio-login error=> modes props should be an array contain composite of 'OTPNumber' | 'userName' | 'email' | 'phoneNumber'
        `
        alert(error); console.log(error); return;
    }
    if (modes.indexOf('OTPNumber') !== -1) {
        if (!otpLength) {
            let error = `aio-login error=> otpLength props is not an number (for define length of otp code)`
            alert(error); console.log(error); return;
        }
    }
    if (register) {
        if (
            typeof register !== 'object' ||
            ['mode', 'tab', 'button'].indexOf(register.type) === -1 ||
            !register.text ||
            !Array.isArray(register.fields) ||
            !register.fields.length
        ) {
            let error = `
                aio-login error=> register props should be an object contain: 
                type: "tab" | "button" | "mode"
                fields:[
                    {
                        type:"text" | "number" | "textarea" | "chechbox" | "radio" | "select" | "multiselect" ,
                        before:html (for example an icon),
                        label:string (form input label),
                        validation:(value)=>string (error message) | undefined,
                        field:string (register object property)
                    },
                    ...
                ],
                text:string
            `;
            alert(error); console.log(error); return;
        }
    }
    if (forget) {
        if (typeof forget !== 'object') { alert(`aio-login error=> forget props should be an object`) }
        if (['phoneNumber', 'email'].indexOf(forget.mode) === -1) {
            let error = `aio-login error=> forget props object, mode property should be one of "phoneNumber" | "email"`;
            alert(error); console.log(error); return;
        }
    }
}
