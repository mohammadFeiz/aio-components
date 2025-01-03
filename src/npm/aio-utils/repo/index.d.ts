import { ReactNode } from 'react';
type I_dateObject = {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
};
export type I_Date = string | number | Date | I_dateObject | number[];
export type I_point = number[];
export type I_line = [I_point, I_point];
export type I_dline = [number, number, number];
export type I_dip = number;
export type I_arc = {
    x: number;
    y: number;
    r: number;
    slice?: number[];
};
export type I_rect = [I_point, I_point];
export declare function HasClass(target: any, className: string): any;
export declare function DownloadFile(file: any): Promise<void>;
export declare function GetFileUrl(file: any): string;
export declare function Stall(stallTime?: number): Promise<void>;
export declare function FileToBase64(file: any, callback: (result: any) => void): void;
export declare function GetPrecisionCount(number: number): number;
export declare function HandleBackButton(callback?: () => void): void;
export declare function SortArray(arr: any[], sorts: {
    getValue: (v: any) => any;
    inc?: boolean;
}[]): any[];
export declare function ParseString(str: string): any;
export declare function ReOrder(data: any[], fromIndex: number, toIndex: number): any[];
export declare class DragClass {
    over: (e: any) => void;
    dragData: any;
    getDragAttrs: (dragData: any) => any;
    getDropAttrs: (dropData: any) => any;
    reOrder: (data: any[], fromIndex: number, toIndex: number) => any[];
    constructor(p: {
        callback: (dragData: any, dropData: any) => void;
    });
}
export declare function GetClient(e: any): {
    x: number;
    y: number;
};
export declare function ExportToExcel(rows: any[], config?: any): void;
export declare function SplitNumber(price: number, count?: number, splitter?: string): string;
export declare function EventHandler(selector: string, event: 'mousedown' | 'mousemove' | 'mouseup' | 'click', action: any, type?: 'bind' | 'unbind'): void;
export declare function getValueByStep(p: {
    value: number;
    start: number;
    step: number;
    end: number;
}): number;
export declare function GetPercentByValue(start: number, end: number, value: number): number;
export declare function URLToJSON(url: string): {
    [key: string]: any;
};
export declare function FileSize(number: number): string;
export declare function FilePreview(file: any, attrs?: any): React.ReactNode;
export declare function JSXToHTML(jsx: any): string;
export declare function Copy(text: any): Promise<void>;
export declare function IsTouch(): boolean;
export declare function Paste(): Promise<ClipboardItems>;
export declare function Search(items: any[], searchValue: string, getValue?: (item: any, index: number) => any): any[];
export declare function GenerateComponsition(p: {
    level?: number;
    length?: number;
    childsField?: string;
    fields: any;
}): any[];
export declare function CalculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
export declare const FilterTree: (p: {
    data: {
        [key: string]: any;
    };
    checkNode: (node: {
        [key: string]: any;
    }) => boolean;
    childsField: string;
}) => any;
export declare function getEventAttrs(eventType: 'onMouseDown' | 'onMouseMove' | 'onMouseUp', callback: (e: any) => void): {
    [x: string]: (e: any) => void;
};
export declare function AddToAttrs(attrs: any, p: any): any;
export declare function GetCities(): {
    "\u0622\u0630\u0631\u0628\u0627\u06CC\u062C\u0627\u0646 \u0634\u0631\u0642\u06CC": string[];
    "\u0622\u0630\u0631\u0628\u0627\u06CC\u062C\u0627\u0646 \u063A\u0631\u0628\u06CC": string[];
    اردبیل: string[];
    اصفهان: string[];
    البرز: string[];
    ایلام: string[];
    بوشهر: string[];
    تهران: string[];
    "\u0686\u0647\u0627\u0631\u0645\u062D\u0627\u0644 \u0648 \u0628\u062E\u062A\u06CC\u0627\u0631\u06CC": string[];
    "\u062E\u0631\u0627\u0633\u0627\u0646 \u062C\u0646\u0648\u0628\u06CC": string[];
    "\u062E\u0631\u0627\u0633\u0627\u0646 \u0631\u0636\u0648\u06CC": string[];
    "\u062E\u0631\u0627\u0633\u0627\u0646 \u0634\u0645\u0627\u0644\u06CC": string[];
    خوزستان: string[];
    زنجان: string[];
    سمنان: string[];
    "\u0633\u06CC\u0633\u062A\u0627\u0646 \u0648 \u0628\u0644\u0648\u0686\u0633\u062A\u0627\u0646": string[];
    فارس: string[];
    قزوین: string[];
    قم: string[];
    کردستان: string[];
    کرمان: string[];
    کرمانشاه: string[];
    "\u06A9\u0647\u06AF\u06CC\u0644\u0648\u06CC\u0647 \u0648 \u0628\u0648\u06CC\u0631\u0627\u062D\u0645\u062F": string[];
    گلستان: string[];
    لرستان: string[];
    گیلان: string[];
    مازندران: string[];
    مرکزی: string[];
    هرمزگان: string[];
    همدان: string[];
    یزد: string[];
};
export declare function Get2Digit(n: number): string;
export declare function svgArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string;
export declare function getValueByField(data: any, field: string, def?: any): any;
export declare function setValueByField(data: any, field: string, value: any): any;
export declare function GetArray(count: number, fn?: (index: number) => any, step?: number): any[];
export declare function GetRandomNumber(from: number, to: number): number;
type I_storage_model = {
    [key: string]: any;
};
type I_storage_time = {
    [key: string]: number;
};
export declare class Storage {
    model: I_storage_model;
    time: I_storage_time;
    init: () => void;
    saveStorage: (model: I_storage_model, time: I_storage_time) => void;
    getParent: (field: string) => I_storage_model | undefined;
    removeValueByField: (field: string) => I_storage_model;
    setValueByField: (field: string, value: any) => I_storage_model;
    getValueByField: (field: string) => any;
    save: (field: string, value: any) => I_storage_model;
    remove: (field: string, callback?: () => void) => I_storage_model;
    load: (field: string, def?: any, time?: number) => any;
    clear: () => void;
    download: (file: any, name: string) => void;
    export: () => void;
    read: (file: any, callback: (model: any) => void) => void;
    import: (file: any, callback: () => void) => void;
    getModel: () => I_storage_model;
    constructor(id: string);
}
export declare function DisabledContextMenu(): void;
export type AV_operator = 'contain' | 'required' | '=' | '>' | '>=' | '<' | '<=' | 'startBy' | '<>' | '<=>';
export type AV_props = {
    lang?: 'fa' | 'en';
    title?: string;
    value: any;
    validations: AV_item[];
};
type AV_item_object = {
    target: any;
    title?: string;
    message?: string;
    value: any;
    operator: AV_operator;
    not: boolean;
    equal: boolean;
    fn: any;
};
export type AV_item = string | Omit<AV_item_object, 'value' | 'equal' | 'fn'>;
type AV_fn = 'less' | 'greater' | 'equal' | 'contain' | 'startBy' | 'required' | 'between';
export declare class Validation {
    contain: (target: any, value: any) => {
        result: boolean;
        unit: any;
    };
    startBy: (target: any, value: any) => {
        result: boolean;
        unit: any;
    };
    equal: (target: any, value: any, equal?: boolean) => {
        result: boolean;
        unit: any;
    };
    less: (target: any, value: any, equal?: boolean) => {
        result: boolean;
        unit: any;
    };
    greater: (target: any, value: any, equal?: boolean) => {
        result: boolean;
        unit: any;
    };
    between: (targets: any[], value: any, equal?: boolean) => {
        result: boolean;
        unit: any;
    };
    getMessage: (p: {
        translate: string;
        target: string;
        message?: string;
        title?: string;
        unit: string;
    }) => string;
    translate: (operator: AV_operator, not: boolean) => string;
    getResult: (p: AV_item_object) => string | undefined;
    getValidation: () => string | undefined;
    validate: () => string | undefined;
    boolKey: (key: 'more' | 'less') => string;
    getDateArray: (str: string) => number[];
    compaireDates: (str1: string, str2: string) => 'less' | 'greater' | 'equal';
    boolDic: any;
    getUnit: (value: any) => string;
    constructor(props: AV_props);
}
export declare function ValidationTextToObject(vtext: string, Title?: string): {
    title: string;
    target: any;
    not: boolean;
    equal: boolean;
    fn: AV_fn;
    operator: AV_operator;
    message: string;
};
type PS_validation = {
    targets: any[];
    not: boolean;
    operator: AV_operator;
    bool?: PS_bool;
};
type PS_filter = {
    field: string;
    validation: PS_validation | string;
};
export declare function ConvertTextToFilters(sentence: string, columns: any[]): (PS_filter | string)[];
type PS_bool = 'و' | 'یا';
export declare function FilterRows(rows: any[], filters: PS_filter[][]): any[];
type I_color = any;
type I_color_type = 'rgb' | 'hex' | 'array';
export declare class AIOColors {
    number_to_hex: (number: number) => string;
    getType: (c: I_color) => I_color_type;
    to_array: (c: I_color) => number[];
    between: (c1: I_color, c2: I_color, count: number) => string[];
    getBetween: (v: (string | number)[]) => I_color[];
    to_dark: (c: I_color, percent: number) => I_color;
    to_light: (c: I_color, percent: number) => I_color;
    brightness: (c: I_color, percent: number) => I_color;
    to_hex: (c: I_color) => string;
    to_rgb: (c: I_color) => string;
    log: (c: I_color[]) => void;
    getRandomRGB: (c1?: I_color, c2?: I_color) => string;
    reverse: (c: I_color) => I_color;
    constructor();
}
declare class GetSvg {
    getStyle: (color?: string) => {
        fill: string;
    };
    getSvgStyle: (size?: number) => {
        width: string;
        height: string;
    };
    fixSvgContent: (content: ReactNode, size?: number, p?: {
        spin?: number;
        color?: string;
    }) => JSX.Element;
    getIcon: (path: string, size?: number, p?: {
        spin?: number;
        color?: string;
    }) => JSX.Element;
    mdiChevronDown: (color?: string) => JSX.Element;
    mdiClose: (color?: string) => JSX.Element;
    mdiLoading: (color?: string) => JSX.Element;
    mdiAttachment: (color?: string) => JSX.Element;
    mdiCircleMedium: (color?: string) => JSX.Element;
    mdiMagnify: (color?: string) => JSX.Element;
    mdiPlusThick: (color?: string) => JSX.Element;
    mdiImage: (color?: string) => JSX.Element;
    mdiEye: (color?: string) => JSX.Element;
    mdiEyeOff: (color?: string) => JSX.Element;
    mdiDotsHorizontal: (color?: string) => JSX.Element;
    mdiChevronRight: (color?: string) => JSX.Element;
    mdiChevronLeft: (color?: string) => JSX.Element;
    mdiArrowDown: (color?: string) => JSX.Element;
    mdiArrowUp: (color?: string) => JSX.Element;
    mdiFileExcel: (color?: string) => JSX.Element;
    mdiSort: (color?: string) => JSX.Element;
    mdiDelete: (color?: string) => JSX.Element;
    mdiCircleSmall: (color?: string) => JSX.Element;
    mdiMicrophoneOutline: (color?: string) => JSX.Element;
}
export { GetSvg };
export declare class getRandomByPriority {
    private list;
    private idField;
    constructor(p: {
        list: any[];
        priorityField: string;
        idField: string;
    });
    private getList;
    private remove;
    getItem: (type?: 'remove one' | 'remove all') => any;
}
export declare function FakeName(p: {
    type: 'firstname' | 'lastname' | 'fullname';
    gender?: 'male' | 'female';
    lang: 'en' | 'fa';
}): any;
export declare function StyleObjectToString(styleObject: any): string;
export declare function Normalize(str: string): string;
type I_os = 'Macintosh' | 'MacIntel' | 'MacPPC' | 'Mac68K' | 'Win32' | 'Win64' | 'Windows' | 'WinCE' | 'iPhone' | 'iPad' | 'iPod' | 'macOS' | 'iOS' | 'Windows' | 'Android' | 'Linux' | 'Unknown';
export declare const DetectOS: () => I_os;
