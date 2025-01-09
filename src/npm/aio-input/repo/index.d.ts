import { FC, ReactNode, MutableRefObject } from 'react';
import AIOPopup, { AP_modal } from "./../aio-popup";
import { DragClass } from './../aio-utils';
import AIODate from './../aio-date';
import './index.css';
declare const AIOInput: FC<AITYPE>;
export default AIOInput;
export type I_openState = boolean | undefined;
export type AI_Layout = {
    option?: AI_option;
    text?: ReactNode;
    index?: number;
    properties?: any;
};
export declare const Acardion: FC;
type I_treeRowDetails = {
    level: number;
    index: number;
    isLastChild: boolean;
    isFirstChild: boolean;
};
type AI_dateDetails = {
    months: string[];
    jalaliDateArray: number[];
    gregorianDateArray: number[];
    dateArray: number[];
    weekDay: string;
    weekDayIndex: number;
    dateString: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    monthString: string;
    jalaliMonthString: string;
    gregorianMonthString: string;
};
export declare function Calendar(props: {
    onClose?: () => void;
}): JSX.Element;
type AI_sbp = (size: number, conf?: {
    half?: boolean;
    min?: number;
    max?: number;
    range?: number;
}) => number;
type AI_cbs = (rangeCircle: I_rangeConfig, type: 'offset' | 'radius') => {
    thickness: number;
    color: string;
    roundCap: boolean;
    full: boolean;
    radius: number;
};
type AI_rbs = (range: I_rangeConfig) => {
    thickness: number;
    color: string;
    roundCap: boolean;
    offset: number;
};
export type I_rangeConfig = {
    thickness: number;
    offset: number;
    color: string;
    roundCap?: boolean;
    full?: boolean;
};
export type I_RangeContext = {
    getXPByValue: (value: number) => number;
    fixAngle: (angle: number) => number;
    getAngleByValue: (value: number, extra?: number) => number;
    isValueDisabled: (value: number) => boolean;
    getSide: () => 'left' | 'right' | 'top' | 'bottom';
    getOffset: () => 'top' | 'left';
    rootProps: AITYPE;
    dom: any;
    value: number[];
    getDefaultOffset: (type: 'point' | 'label' | 'scale') => number;
    getCircleByStr: AI_cbs;
    getRectByStr: AI_rbs;
    sbp: AI_sbp;
};
export type I_RangeLabelItem = {
    label: AI_label;
    itemValue: number;
};
export type AI_Sidemenu = {
    items: AI_Sidemenu_item[];
    onChange: (item: AI_Sidemenu_item) => void;
    option?: any;
    type?: 'hover' | 'normal' | 'icon';
    className?: string;
    style?: any;
    attrs?: any;
};
export type AI_Sidemenu_item = {
    text: ReactNode;
    value: string;
    badge?: AI_Sidemenu_badge | AI_Sidemenu_badge[];
    icon: ReactNode;
    items?: AI_Sidemenu_item[];
    onClick?: () => void;
};
export type AI_Sidemenu_badge = {
    text: string;
    circle?: boolean;
    color: 'red' | 'green' | 'blue' | 'grey' | 'white' | 'orange' | 'yellow';
};
export declare const SideMenu: FC<AI_Sidemenu>;
type I_AICard = {
    text: ReactNode;
    subtext?: ReactNode;
    onClick: () => void;
    before?: ReactNode;
    after?: ReactNode;
};
export declare const AICard: FC<I_AICard>;
type I_AIPanel = {
    text: string;
    subtext?: ReactNode;
    before?: ReactNode;
    after?: ReactNode;
    body: ReactNode;
};
export declare const AIPanel: FC<I_AIPanel>;
export declare const AISwitch: FC<{
    size?: number[];
    value: boolean;
    onChange?: (v: boolean) => void;
    colors?: string[];
}>;
export type AI_timeUnits = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';
export declare function AIOInput_defaultProps(p: {
    [key in keyof AITYPE]?: any;
}): void;
export type I_MonthCalendar = {
    date: number[];
    onClick?: (date: number[]) => void;
    dateAttrs?: (date: number[]) => any;
};
export declare const MonthCalendar: FC<I_MonthCalendar>;
export declare function Code(code: string, language?: 'js' | 'css', style?: any): JSX.Element;
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
    rememberTime: number;
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
export declare const AILogin: FC<I_AILogin>;
type I_AIApp = {
    attrs?: any;
    bottomMenu: {
        options: AI_bottomMenuOption[];
        onChange: (v: string) => void;
    };
    body: () => ReactNode;
    header?: () => ReactNode | false;
    children?: ReactNode;
};
type AI_bottomMenuOption = {
    text?: ReactNode;
    uptext?: ReactNode;
    subtext?: ReactNode;
    value: string;
    before?: ReactNode;
    after?: ReactNode;
    show?: boolean;
    active?: boolean;
};
export declare const AIApp: FC<I_AIApp>;
export type I_mask_pattern = ['number' | 'text' | 'select' | ReactNode, number, (string[] | ReactNode)?][];
export declare const Mask: FC<{
    value?: string;
    pattern: I_mask_pattern;
    onChange: (v: string) => void;
}>;
export type I_MonthCells = {
    year: number;
    month: number;
    cellContent: (date: number[], weekDayIndex: number) => ReactNode;
    weekDayContent?: (v: number) => ReactNode;
    changeMonth: (month: number) => void;
};
export declare const MonthCells: FC<I_MonthCells>;
export declare const RichText: FC;
type AI_FormItem = {
    label?: string;
    input: ReactNode;
    action?: {
        text: ReactNode;
        fn?: () => void;
    };
    error?: () => string | undefined | void;
};
export declare const FormItem: FC<AI_FormItem>;
type AI_FormContainer = {
    body: ReactNode;
    buttons?: {
        text: ReactNode;
        active?: boolean;
        disabled?: boolean;
        onClick: () => void;
    }[];
};
export declare const FormContainer: FC<AI_FormContainer>;
export type AITYPE = AI_hasOption & AI_isDropdown & AI_isMultiple & AI_hasKeyboard & AI_isTable & AI_isRange & AI_isTree & AI_isDate & {
    after?: ReactNode | ((p?: any) => ReactNode);
    attrs?: any;
    before?: ReactNode | ((p?: any) => ReactNode);
    className?: string;
    disabled?: boolean | any[];
    footer?: ReactNode;
    imageAttrs?: any;
    justify?: boolean;
    label?: string;
    lang?: 'fa' | 'en';
    loading?: boolean | ReactNode;
    onChange?: (newValue: any, p?: any) => undefined | boolean | void;
    placeholder?: ReactNode;
    reportError?: (errorMessage: string | undefined) => void;
    rtl?: boolean;
    showErrors?: boolean | string;
    style?: any;
    subtext?: ReactNode | (() => ReactNode);
    type: AI_type;
    validations?: (any[]) | ((v: any) => string | undefined);
    value?: any;
    body?: (value: AI_optionDetails) => {
        attrs?: any;
        html?: ReactNode;
    };
    checkIcon?: AI_checkIcon;
    listOptions?: {
        decay?: number;
        stop?: number;
        count?: number;
        move?: any;
        editable?: boolean;
    };
    getOptions?: (text: string) => Promise<any[]>;
    hideTags?: boolean;
    onClick?: (e: Event) => void;
    onSwap?: true | ((newValue: any[], startRow: any, endRow: any) => void);
    preview?: boolean;
    text?: ReactNode | (() => ReactNode);
};
export type AI_option = {
    show: any;
    checked?: boolean;
    checkIcon: AI_checkIcon;
    after: ReactNode | ((p?: any) => ReactNode);
    before: ReactNode | ((p?: any) => ReactNode);
    draggable: boolean;
    text: ReactNode;
    subtext: ReactNode;
    justify: boolean;
    loading: boolean | ReactNode;
    disabled: boolean;
    attrs: any;
    className: string;
    style: any;
    value: any;
    tagAttrs: any;
    tagBefore: any;
    tagAfter: any;
    onClick?: (o1: any, o2?: any) => void;
    close?: boolean;
    level?: number;
    details: AI_optionDetails;
};
export type AI_optionDetails = {
    option: any;
    rootProps: AITYPE;
    index: number;
    level?: number;
    active?: boolean;
    change?: (v: any) => any;
};
export type AI_optionKey = ('attrs' | 'text' | 'value' | 'disabled' | 'checkIcon' | 'checked' | 'before' | 'after' | 'justify' | 'subtext' | 'onClick' | 'className' | 'style' | 'tagAttrs' | 'tagBefore' | 'tagAfter' | 'close' | 'show');
export type AI_optionProp = {
    [key in AI_optionKey]?: string | ((optionDetails: AI_optionDetails) => any);
};
export type AI_optionDic = {
    [key: string]: AI_option;
};
export type AI_options = {
    optionsList: AI_option[];
    optionsDic: AI_optionDic;
};
export type AI_type = 'text' | 'number' | 'textarea' | 'password' | 'select' | 'tree' | 'spinner' | 'slider' | 'tags' | 'button' | 'date' | 'color' | 'radio' | 'tabs' | 'list' | 'table' | 'image' | 'file' | 'checkbox' | 'time' | 'buttons' | 'range' | 'acardion';
export type AI_table_column = {
    title?: any;
    value?: any;
    sort?: true | AI_table_sort;
    search?: boolean;
    id?: string;
    _id?: string;
    width?: any;
    minWidth?: any;
    input?: AITYPE;
    onChange?: (newValue: any) => void;
    titleAttrs?: {
        [key: string]: any;
    } | string;
    template?: string | ((p: {
        row: any;
        column: AI_table_column;
        rowIndex: number;
    }) => ReactNode);
    excel?: string | boolean;
    justify?: boolean;
    cellAttrs?: {
        [key: string]: any;
    } | ((p: {
        row: any;
        rowIndex: number;
        column: AI_table_column;
    }) => any) | string;
};
export type AI_date_unit = 'year' | 'month' | 'day' | 'hour';
export type AI_time_unit = {
    [key in ('year' | 'month' | 'day' | 'hour' | 'minute' | 'second')]?: boolean;
};
export type AI_table_param = {
    row: any;
    column: AI_table_column;
    rowIndex: number;
};
export type AI_date_trans = 'Today' | 'Clear' | 'This Hour' | 'Today' | 'This Month' | 'Select Year';
export type AI_point = (index: number, p: any) => {
    offset?: number;
    html?: ReactNode;
    attrs?: any;
};
export type AI_labels = AI_label[];
export type AI_label = {
    list?: number[];
    start?: number;
    end?: number;
    step?: number;
    dynamic?: boolean;
    autoHide?: boolean;
    zIndex?: number;
    setting: (value: number, p: {
        angle: number;
        disabled: boolean;
    }) => AI_labelItem;
};
export type AI_labelItem = {
    offset?: number;
    fixAngle?: boolean;
    html?: ReactNode;
};
export type AI_range_handle = ((value: number, p: any) => AI_range_handle_config) | false;
export type AI_range_handle_config = {
    thickness?: number;
    size?: number;
    color?: string;
    offset?: number;
    sharp?: boolean;
};
export type AI_fill = {
    thickness?: number;
    color?: string;
    className?: string;
    style?: any;
};
export type AI_checkIcon = {
    [key: string]: string | number;
} | [ReactNode, ReactNode];
export type AI_getProp_param = {
    key: string;
    def?: any;
    preventFunction?: boolean;
};
export type AI_getProp = (p: AI_getProp_param) => any;
export type AI_addToAttrs = (attrs: any, p: {
    className?: string | (any[]);
    style?: any;
    attrs?: any;
}) => any;
export type AI_context = {
    rootProps: AITYPE;
    popup: AIOPopup;
    showPassword: boolean;
    setShowPassword: (v?: boolean) => void;
    DragOptions: DragClass;
    datauniqid: string;
    touch: boolean;
    click: (e: any, dom: any) => void;
    optionClick: (option: AI_option, p?: any) => void;
    types: AI_types;
    DATE: AIODate;
    options: AI_options;
    error?: string;
};
export type AI_types = {
    isMultiple: boolean;
    isInput: boolean;
    isDropdown: boolean;
    hasOption: boolean;
    hasPlaceholder: boolean;
    hasKeyboard: boolean;
    hasText: boolean;
    hasSearch: boolean;
};
export type AI_table_sort = {
    active?: boolean;
    dir?: 'dec' | 'inc';
    title?: ReactNode;
    type?: 'string' | 'number';
    sortId?: string;
    getValue?: (row: any) => any;
};
export type type_table_temp = {
    start?: any;
    isInitSortExecuted?: boolean;
};
export type AI_table_paging = {
    serverSide?: boolean;
    number: number;
    size: number;
    length?: number;
    sizes?: number[];
};
export type AI_table_rows = {
    rows: any[];
    searchedRows: any[];
    sortedRows: any[];
    pagedRows: any[];
};
export type type_table_getCellAttrs = (p: {
    row: any;
    rowIndex: number;
    column: AI_table_column;
    type: 'title' | 'cell';
}) => any;
export type type_table_context = {
    rootProps: AITYPE;
    columns: AI_table_column[];
    ROWS: {
        rows: any[];
        searchedRows: any[];
        sortedRows: any[];
        pagedRows: any[];
    };
    add: () => void;
    remove: (row: any, index: number) => void;
    search: (searchValue: string) => void;
    exportToExcel: () => void;
    sorts: AI_table_sort[];
    setSorts: (newSorts: AI_table_sort[]) => void;
    sortRows: (rows: any[], sorts: AI_table_sort[]) => any[];
    excelColumns: AI_table_column[];
    getRowAttrs: (row: any, rowIndex: number) => any;
    getCellAttrs: type_table_getCellAttrs;
    getDynamics: any;
};
export type AI_Popover_props = {
    getRootProps: () => AITYPE;
    id: string;
    toggle: (popover: any) => void;
    types: AI_types;
};
export type type_time_value = {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
};
export type AI_indent = {
    size: number;
    isLastChild: boolean;
    isFirstChild: boolean;
    childsLength: number;
    level: number;
    index: number;
    parentIndent?: AI_indent;
    height: number;
};
export type I_list_temp = {
    dom: any;
    activeIndex: number;
    interval: any;
    moved: boolean;
    lastY: number;
    deltaY: number;
    so: {
        y: number;
        top: number;
        newTop?: number;
        limit: {
            top: number;
            bottom: number;
        };
    };
};
type AI_hasOption = {
    deSelect?: any;
    onSwap?: true | ((newValue: any[], startRow: any, endRow: any) => void);
    option?: AI_optionProp;
    options?: any[] | ((p?: any) => any[]);
    search?: string;
};
type AI_isDate = {
    dateAttrs?: (p: {
        dateArray: number[];
        isToday: boolean;
        isActive: boolean;
        isFuture: boolean;
        weekDayIndex: number | null;
        weekDay: string | null;
        monthString: string;
    }) => any;
    jalali?: boolean;
    now?: boolean;
    pattern?: string;
    theme?: string[];
    translate?: (text: string) => string;
    unit?: AI_date_unit | AI_time_unit;
    timeStep?: {
        year?: number;
        month?: number;
        day?: number;
        hour?: number;
        minute?: number;
        second?: number;
    };
    text?: ReactNode | (() => ReactNode);
};
type AI_isDropdown = {
    caret?: boolean | ReactNode;
    popover?: AP_modal;
    open?: boolean;
};
type AI_isMultiple = {
    multiple?: boolean | number;
    maxLength?: number;
};
type AI_hasKeyboard = {
    blurChange?: boolean;
    filter?: string[];
    inputAttrs?: any;
    maxLength?: number;
    swip?: number;
    spin?: boolean;
    autoHighlight?: boolean;
    delay?: number;
    voice?: boolean;
};
type AI_isTable = {
    addText?: ReactNode | ((value: any) => ReactNode);
    columnGap?: number;
    columns?: AI_table_column[] | ((p?: any) => AI_table_column[]);
    excel?: string | ((value: any[]) => any[]);
    getValue?: {
        [key: string]: (p: AI_table_param) => any;
    };
    headerAttrs?: any;
    onAdd?: {
        [key: string]: any;
    } | ((p?: any) => Promise<boolean | void | undefined>);
    onChangePaging?: (newPaging: AI_table_paging) => void;
    onChangeSort?: (sorts: AI_table_sort[]) => Promise<boolean>;
    onSwap?: true | ((newValue: any[], startRow: any, endRow: any) => void);
    onSearch?: true | ((searchValue: string) => void);
    paging?: AI_table_paging;
    removeText?: string;
    rowAfter?: (p: {
        row: any;
        rowIndex: number;
    }) => ReactNode;
    rowAttrs?: (p: {
        row: any;
        rowIndex: number;
    }) => any;
    rowBefore?: (p: {
        row: any;
        rowIndex: number;
    }) => ReactNode;
    rowGap?: number;
    rowsTemplate?: (rows: any[]) => ReactNode;
    rowTemplate?: (p: {
        row: any;
        rowIndex: number;
        isLast: boolean;
    }) => ReactNode;
    toolbar?: ReactNode | (() => ReactNode);
    toolbarAttrs?: any;
    tabIndex?: number;
};
type AI_isRange = {
    end?: number;
    fill?: false | AI_fill | ((index: number) => AI_fill);
    grooveAttrs?: {
        [key: string]: any;
    };
    labels?: AI_labels;
    max?: number;
    min?: number;
    point?: false | AI_point;
    ranges?: [number, I_rangeConfig][];
    reverse?: boolean;
    size?: number;
    start?: number;
    step?: number;
    vertical?: boolean;
    circles?: I_rangeConfig[];
    handle?: AI_range_handle;
    rotate?: number;
    round?: number;
};
type AI_isTree = {
    actions?: ({
        [key in keyof AI_option]?: any;
    }[]) | ((row: any, parent: any) => {
        [key in keyof AI_option]?: any;
    }[]);
    addText?: ReactNode | ((value: any) => ReactNode);
    checkIcon?: AI_checkIcon;
    getChilds?: (p: {
        row: any;
        details: I_treeRowDetails;
    }) => any[];
    indent?: number;
    onAdd?: {
        [key: string]: any;
    } | ((p?: any) => Promise<boolean | void | undefined>);
    onRemove?: true | ((p: {
        row: any;
        action?: Function;
        rowIndex?: number;
        parent?: any;
    }) => Promise<boolean | void>);
    onToggle?: (openDic: {
        [id: string]: boolean;
    }) => void;
    removeText?: string;
    setChilds?: (p: {
        row: any;
        childs: any[];
        details: I_treeRowDetails;
    }) => void;
    toggleRef?: MutableRefObject<(id: any) => void>;
    toggleIcon?: false | ((p: {
        row: any;
        level: number;
        open?: boolean;
    }) => ReactNode);
};
export type AI<AI_type> = Omit<AITYPE, 'onChange' | 'type'> & {
    onChange?: AI_onChange<AI_type>;
};
type AI_onChange<AI_type> = AI_type extends 'text' ? (v: string) => void : AI_type extends 'number' ? (v: number | undefined) => void : AI_type extends 'textarea' ? (v: string) => void : AI_type extends 'password' ? (v: string) => void : AI_type extends 'color' ? (v: string) => void : AI_type extends 'select' ? (v: any, optionDetails: AI_optionDetails) => void : AI_type extends 'radio' ? (v: any, optionDetails: AI_optionDetails) => void : AI_type extends 'tabs' ? (v: any, optionDetails: AI_optionDetails) => void : AI_type extends 'buttons' ? (v: any, optionDetails: AI_optionDetails) => void : AI_type extends 'tags' ? (v: any[]) => void : AI_type extends 'tree' ? (v: any, optionDetails: AI_optionDetails) => void : AI_type extends 'image' ? (v: any) => void : AI_type extends 'file' ? (v: any) => void : AI_type extends 'checkbox' ? (v: any) => void : AI_type extends 'date' ? (v: any, dateDetails: AI_dateDetails) => void : AI_type extends 'time' ? (v: any) => void : AI_type extends 'slider' ? (v: any) => void : AI_type extends 'spinner' ? (v: any) => void : AI_type extends 'acardion' ? (v: any) => void : AI_type extends 'list' ? (v: any, optionDetails: AI_optionDetails) => void : AI_type extends 'table' ? (v: any) => void : never;
export declare const AIText: FC<AI<'text'>>;
export declare const AINumber: FC<AI<'number'>>;
export declare const AITextarea: FC<AI<'textarea'>>;
export declare const AIPassword: FC<AI<'password'>>;
export declare const AIColor: FC<AI<'color'>>;
export declare const AISelect: FC<AI<'select'>>;
export declare const AIRadio: FC<AI<'radio'>>;
export declare const AITabs: FC<AI<'tabs'>>;
export declare const AIButtons: FC<AI<'buttons'>>;
export declare const AITags: FC<AI<'tags'>>;
export declare const AITree: FC<AI<'tree'>>;
export declare const AIImage: FC<AI<'image'>>;
export declare const AIFile: FC<AI<'file'>>;
export declare const AICheckbox: FC<AI<'checkbox'>>;
export declare const AIDate: FC<AI<'date'>>;
export declare const AITime: FC<AI<'time'>>;
export declare const AISlider: FC<AI<'slider'>>;
export declare const AISpinner: FC<AI<'spinner'>>;
export declare const AIAcardion: FC<AI<'acardion'>>;
export declare const AIList: FC<AI<'list'>>;
export declare const AITable: FC<AI<'table'>>;
