import { FC, ReactNode } from "react";
import { I_formInput } from "aio-input";
import './index.css';
type I_loginMode = 'userpass' | 'register' | 'otpcode' | 'otpnumber';
export type I_login_key = 'registerButton' | 'userpassButton' | 'otpnumberButton' | 'otpcodeButton' | 'registerTitle' | 'userpassTitle' | 'otpcodeTitle' | 'otpnumberTitle' | 'switchuserpass' | 'switchregister' | 'switchotpnumber' | 'repasswordMatch' | 'usernameRequired' | 'passwordRequired' | 'repasswordRequired' | 'otpnumberRequired' | 'otpcodeLength' | 'registerError' | 'userpassError' | 'otpcodeError' | 'otpnumberError' | 'username' | 'password' | 'repassword' | 'otpnumber' | 'otpcode';
type I_login_model<T> = {
    userpass: {
        username: string;
        password: string;
    };
    otpnumber: string;
    otpcode: string;
    register: {
        username: string;
        password: string;
        repassword: string;
        properties: {
            [key in keyof T]?: T[key] | undefined;
        };
    };
};
type I_registerInputs = {
    [field: string]: I_formInput;
};
type I_AILogin<T> = {
    app: FC<{
        user: T;
        token: string;
        base_url: string;
        logout: () => void;
    }>;
    base_url: string;
    checkToken: {
        url: string;
        method?: 'post' | 'get';
        body?: any;
        getResult?: (response: any) => boolean;
    };
    before?: (mode: I_loginMode) => ReactNode;
    after?: (mode: I_loginMode) => ReactNode;
    translate?: (key: I_login_key) => string | undefined;
    fa?: boolean;
    id: string;
    splash?: {
        html: ReactNode;
        time: number;
    };
    validate?: (p: {
        field: string;
        data: I_login_model<T>;
        value: any;
        input: I_formInput;
    }) => string | undefined;
    otpnumber?: {
        path: string;
        method: 'post' | 'get';
        body?: (data: I_login_model<T>) => any;
        onSuccess: (response: any) => Promise<{
            message?: string;
        }>;
    };
    otpcode?: {
        length: number;
        method: 'post' | 'get';
        body?: (data: I_login_model<T>) => any;
        path: string;
        onSuccess: (response: any) => Promise<{
            user: T;
            token: string;
            message?: string;
        }>;
    };
    userpass?: {
        path: string;
        method: 'post' | 'get';
        body?: (data: I_login_model<T>) => any;
        onSuccess: (response: any) => Promise<{
            user: T;
            token: string;
            message?: string;
        }>;
    };
    register?: {
        inputs?: (model: I_login_model<T>) => I_registerInputs;
        path: string;
        method: 'post' | 'get';
        body?: (data: I_login_model<T>) => any;
        onSuccess: (response: any) => Promise<{
            message?: string;
        }>;
        defaultData?: any;
    };
    getStatus?: (response: any) => number;
    getMessage?: (response: any) => string;
    mode?: I_loginMode;
    attrs?: {
        [key: string]: any;
    };
    setAttrs?: (key: I_login_key) => any;
    mock?: {
        user: T;
        token: string;
    };
};
export declare function AIOLogin_updateCatchedUser<T>(loginId: string, newUser: T): any;
export type I_AuthContext<T> = {
    user?: T;
    token?: string;
    logout: () => void;
    base_url: string;
};
declare const useLogin: <T extends Record<string, any>>(props: I_AILogin<T>) => {
    render: () => JSX.Element;
};
export default useLogin;
