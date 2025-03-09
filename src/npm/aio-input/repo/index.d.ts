import { FC, ReactNode, MutableRefObject } from 'react';
import { AP_modal, AP_usePopup } from "../../aio-popup";
import * as UT from 'aio-utils';
import AIODate from 'aio-date';
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
    className?: string;
};
type AI_rbs = (range: I_rangeConfig) => {
    thickness: number;
    color: string;
    roundCap: boolean;
    offset: number;
    className?: string;
};
export type I_rangeConfig = {
    thickness: number;
    offset: number;
    color: string;
    roundCap?: boolean;
    full?: boolean;
    className?: string;
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
export declare const AISwitch: FC<{
    value?: boolean;
    onChange?: (v: boolean) => void;
    colors?: string[];
    borderSize?: number;
    buttonSize?: number;
    grooveSize?: number;
    width?: number;
    padding?: number;
    attrs?: any;
    html?: (v: boolean) => ReactNode;
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
export type I_mask_pattern = ['number' | 'text' | 'select' | ReactNode, number, (string[] | ReactNode)?][];
export declare const Mask: FC<{
    value?: string;
    pattern: I_mask_pattern;
    onChange: (v: string) => void;
}>;
export declare const RichText: FC;
type I_JoyStick_data = {
    length: number;
    angle: number;
    x: number;
    y: number;
};
export declare const JoyStick: FC<{
    x?: number;
    y?: number;
    angle?: number;
    length?: number;
    scale?: number;
    size: number;
    onChange: (v: I_JoyStick_data) => void;
    centerOriented?: boolean;
}>;
export type AI_switch = {
    value?: boolean;
    onChange?: (v: boolean) => void;
    colors?: string[];
    borderSize?: number;
    buttonSize?: number;
    grooveSize?: number;
    width?: number;
    padding?: number;
};
export type AITYPE = AI_hasOption & AI_isDropdown & AI_isMultiple & AI_hasKeyboard & AI_isTable & AI_isRange & AI_isTree & AI_isDate & {
    after?: ReactNode | ((p?: any) => ReactNode);
    attrs?: any;
    before?: ReactNode | ((p?: any) => ReactNode);
    className?: string;
    disabled?: boolean | any[];
    imageAttrs?: any;
    justify?: boolean;
    loading?: boolean | ReactNode;
    onChange?: (newValue: any, p?: any) => undefined | boolean | void;
    placeholder?: ReactNode;
    rtl?: boolean;
    style?: any;
    subtext?: ReactNode | (() => ReactNode);
    type: AI_type;
    validations?: (any[]) | ((v: any) => string | undefined);
    value?: any;
    body?: (option: any, details: AI_optionDetails) => {
        attrs?: any;
        html?: ReactNode;
    };
    checkIcon?: (p: {
        checked: boolean;
        row: any;
    }) => ReactNode;
    switch?: AI_switch;
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
    optionOrg: any;
    show: any;
    checked?: boolean;
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
    rootProps: AITYPE;
    index: number;
    level?: number;
    active?: boolean;
    change?: (v: any) => any;
};
export type AI_optionKey = ('attrs' | 'text' | 'value' | 'disabled' | 'checked' | 'before' | 'after' | 'justify' | 'subtext' | 'onClick' | 'className' | 'style' | 'tagAttrs' | 'tagBefore' | 'tagAfter' | 'close' | 'show');
export type AI_optionProp = {
    [key in AI_optionKey]?: string | ((optionOrg: any, optionDetails: AI_optionDetails) => any);
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
    popup: AP_usePopup;
    showPassword: boolean;
    setShowPassword: (v?: boolean) => void;
    DragOptions: UT.DragClass;
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
export type AI_date_cell_param = {
    dateArray: number[];
    isToday: boolean;
    isActive: boolean;
    isFuture: boolean;
    weekDayIndex: number | null;
    weekDay: string | null;
    monthString: string;
};
type AI_isDate = {
    dateAttrs?: (p: AI_date_cell_param) => any;
    jalali?: boolean;
    calendarMode?: boolean;
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
    popover?: Partial<AP_modal>;
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
    voice?: 'en' | 'fa';
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
    fill?: false | {
        thickness?: number;
        color?: string;
        className?: string;
        style?: any;
    } | ((index: number) => {
        thickness?: number;
        color?: string;
        className?: string;
        style?: any;
    });
    grooveAttrs?: {
        [key: string]: any;
    };
    labels?: AI_labels;
    max?: number;
    min?: number;
    point?: false | ((p: {
        disabled: boolean;
        angle: number;
        value: number;
        index: number;
    }) => {
        offset?: number;
        html?: ReactNode;
        attrs?: any;
    });
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
    toggleIcon?: (p: {
        row: any;
        level: number;
        open?: boolean;
    }) => ReactNode;
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
export type I_validateType = 'email' | 'irMobile' | 'irNationalCode';
export type I_formInput<T> = AITYPE & {
    label: string;
    required?: boolean;
    validateType?: I_validateType;
    field: I_formField<T>;
    validate?: (p: {
        data: T;
        value: any;
        input: I_formInput<T>;
        field: I_formField<T>;
    }) => string | undefined;
};
type I_useFormProps<T> = {
    initData: Partial<T>;
    inlineLabel?: boolean;
    onSubmit?: (data: T) => void;
    liveSubmit?: boolean;
    fa?: boolean;
    showLabel?: boolean;
    getLayout?: (context: I_formContext<T>) => I_formNode<T>;
};
export type I_formField<T> = NestedKeys<T> | 'none';
type NestedKeys<T> = {
    [K in keyof T]: T[K] extends object ? `${K & string}` | `${K & string}.${NestedKeys<T[K]>}` : `${K & string}`;
}[keyof T];
type I_formTag = 'fieldset' | 'section' | 'div' | 'p' | 'form';
export type I_formNode<T> = {
    v?: I_formNode<T>[];
    h?: I_formNode<T>[];
    html?: ReactNode;
    input?: I_formInput<T>;
    attrs?: any;
    className?: string;
    style?: any;
    show?: boolean;
    flex?: number;
    size?: number;
    scroll?: boolean;
    tag?: I_formTag;
    legend?: ReactNode;
    id?: string;
    isStatic?: boolean;
    align?: 'v' | 'h' | 'vh' | 'hv';
    hide_xs?: boolean;
    hide_sm?: boolean;
    hide_md?: boolean;
    hide_lg?: boolean;
    show_xs?: boolean;
    show_sm?: boolean;
    show_md?: boolean;
    show_lg?: boolean;
};
export type I_formHook<T> = {
    data: T;
    renderLayout: ReactNode;
    changeData: (data: T) => void;
    getErrorsDic: () => {
        [key in I_formField<T>]?: string | undefined;
    };
    getErrorsList: () => string[];
    reset: () => void;
    renderSubmitButton: (text: string, attrs?: any) => ReactNode;
    isSubmitDisabled: () => boolean;
    renderInput: (input: I_formInput<T>, attrs?: any) => ReactNode;
    changeByField: (field: I_formField<T>, value: any) => void;
};
export type I_formContext<T> = {
    changeData: (data: T) => void;
    changeByInput: (field: I_formInput<T>, value: any) => void;
    getErrorsDic: () => {
        [key in I_formField<T>]?: string | undefined;
    };
    getErrorsList: () => string[];
    reset: () => void;
    renderSubmitButton: (text: string, attrs?: any) => ReactNode;
    isSubmitDisabled: () => boolean;
    getData: () => T;
    isDataChanged: () => boolean;
    rootProps: I_useFormProps<T>;
    isFieldChanged: (field: I_formField<T>) => boolean;
    getValueByInput: (input: I_formInput<T>) => any;
    getErrorByInput: (input: I_formInput<T>, value: any) => string | undefined;
    hasError: () => boolean;
    getNodeAttrs: (p: {
        node: I_formNode<T>;
        isRoot: boolean;
        parentNode?: I_formNode<T>;
    }) => any;
    setInputsRef: (field: I_formField<T>, input: I_formInput<T>) => void;
};
export declare const useForm: <T extends Record<string, any>>(p: I_useFormProps<T>) => I_formHook<T>;
export declare const AIFormInput: FC<{
    label?: string;
    inlineLabel?: boolean;
    showLabel?: boolean;
    input: ReactNode;
    attrs?: any;
    className?: string;
    style?: any;
    action?: {
        text: ReactNode;
        fn?: () => void;
    };
    error?: string;
    id?: string;
    before?: ReactNode;
    after?: ReactNode;
    subtext?: string;
    required?: boolean;
}>;
export declare const Plate: FC<{
    type: 'motor_cycle' | 'car';
    value: string[];
    onChange: (v: string[]) => void;
    label?: string;
}>;
