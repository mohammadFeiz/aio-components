import { FC, ReactNode } from "react";
import { AITYPE } from "aio-input";
import './index.css';
type I_loginMode = 'userpass' | 'register' | 'otpcode' | 'otpnumber';
type I_login_field = string;
export type I_login_key = 'registerButton' | 'userpassButton' | 'otpnumberButton' | 'otpcodeButton' | 'registerTitle' | 'userpassTitle' | 'otpcodeTitle' | 'otpnumberTitle' | 'switchuserpass' | 'switchregister' | 'switchotp' | 'repasswordMatch' | 'usernameRequired' | 'passwordRequired' | 'repasswordRequired' | 'otpnumberRequired' | 'otpcodeLength' | 'registerError' | 'userpassError' | 'otpcodeError' | 'otpnumberError';
type I_login_model = {
    username: string;
    password: string;
    otpnumber: string;
    otpcode: string;
    register: any;
};
type I_AILogin = {
    checkToken: (token: string) => Promise<{
        method: 'post' | 'get';
        url: string;
        body?: any;
        onSuccess: (response: any) => string | boolean;
        onCatch: (response: any) => string | false;
    }>;
    before?: (mode: I_loginMode) => ReactNode;
    after?: (mode: I_loginMode) => ReactNode;
    renderApp: (p: {
        user: any;
        token: string;
        logout: () => void;
    }) => ReactNode;
    translate?: (key: I_login_key) => string | undefined;
    fa?: boolean;
    id: string;
    splash?: {
        html: ReactNode;
        time: number;
    };
    label: (field: I_login_field) => string;
    validation?: (model: I_login_model, mode: I_loginMode) => string | undefined;
    otpLength?: number;
    otp?: {
        numberApi: (model: I_login_model, mode: I_loginMode) => Promise<{
            method: 'post' | 'get';
            url: string;
            body?: any;
            onSuccess: (response: any) => Promise<{
                message?: string;
            }>;
            onCatch: (response: any) => string;
        }>;
        codeApi: (model: I_login_model, mode: I_loginMode) => Promise<{
            method: 'post' | 'get';
            url: string;
            body?: any;
            onSuccess: (response: any) => Promise<{
                user: any;
                token: string;
                message?: string;
            }>;
            onCatch: (response: any) => string;
        }>;
    };
    userpass?: {
        api: (model: I_login_model, mode: I_loginMode) => Promise<{
            method: 'post' | 'get';
            url: string;
            body?: any;
            onSuccess: (response: any) => Promise<{
                user: any;
                token: string;
                message?: string;
            }>;
            onCatch: (response: any) => string;
        }>;
    };
    register?: {
        defaultValue?: {
            [field: string]: any;
        };
        inputs?: (model: I_login_model) => (AITYPE & {
            field: string;
        })[];
        api: (model: I_login_model, mode: I_loginMode) => Promise<{
            method: 'post' | 'get';
            url: string;
            body?: any;
            onSuccess: (response: any) => Promise<{
                message?: string;
            }>;
            onCatch: (response: any) => string;
        }>;
    };
    mode?: I_loginMode;
    attrs?: any;
    setAttrs?: (key: I_login_key) => any;
    mock?: {
        user: any;
        token: string;
    };
};
export declare function AIOLogin_updateCatchedUser(loginId: string, newUser: any): any;
declare const AILogin: FC<I_AILogin>;
export default AILogin;
