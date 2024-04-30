export type I_Swip_mousePosition = {
    x: number;
    y: number;
    xp: number;
    yp: number;
    clientX: number;
    clientY: number;
    centerAngle: number;
};
export type I_Swip_change = {
    x: number;
    y: number;
    dx: number;
    dy: number;
    dist: number;
    angle: number;
    deltaCenterAngle: number;
};
export type I_Swip_parameter = {
    change?: I_Swip_change;
    mousePosition: I_Swip_mousePosition;
    domLimit: I_Swip_domLimit;
    parentLimit: I_Swip_domLimit;
    event: any;
};
export type I_Swip = {
    dom: () => any;
    parent?: () => any;
    onClick?: (p: I_Swip_parameter) => void;
    page?: () => any;
    start: (p: I_Swip_parameter) => number[];
    move: (p: I_Swip_parameter) => void;
    end?: (p: I_Swip_parameter) => void;
    speedX?: number;
    speedY?: number;
    stepX?: number | boolean;
    stepY?: number | boolean;
    reverseY?: boolean;
    reverseX?: boolean;
    minY?: number;
    maxY?: number;
    minX?: number;
    maxX?: number;
    insideX?: boolean;
    insideY?: boolean;
};
export type I_Swip_domLimit = {
    width: number;
    height: number;
    left: number;
    top: number;
    centerX: number;
    centerY: number;
    right: number;
    bottom: number;
};
export type I_Date = string | number | Date | {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
} | number[];
export type I_point = number[];
export type I_line = [I_point, I_point];
export type I_dline = [number, number, number];
export type I_dip = number;
export type I_arc = {
    x: number;
    y: number;
    r: number;
    slice?: [number, number];
};
export type I_rect = [I_point, I_point];
export declare function DownloadUrl(url: string, name: string): Promise<void>;
export declare function stall(stallTime?: number): Promise<void>;
export declare function FileToBase64(file: any, callback?: (result: any) => void): void;
export declare function HandleBackButton(callback?: () => void): void;
export declare function GetClient(e: any): {
    x: number;
    y: number;
};
export declare function ExportToExcel(rows: any[], config?: any): void;
export declare function SplitNumber(price: number, count?: number, splitter?: string): string;
export declare function EventHandler(selector: any, event: any, action: any, type?: string): void;
export declare function getValueByStep({ value, start, step, end }: {
    value: any;
    start: any;
    step: any;
    end: any;
}): any;
export declare function URLToJSON(url: string): {
    [key: string]: any;
};
export declare function JSXToHTML(jsx: any): string;
export declare function Copy(text: any): Promise<void>;
export declare function IsTouch(): boolean;
export declare function Paste(): Promise<ClipboardItems>;
export declare function Search(items: any[], searchValue: string, getValue?: (item: any, index: number) => any): any[];
export declare function GenerateComponsition({ level: maxLevel, length, childsField, fields }: {
    level?: number;
    length?: number;
    childsField?: string;
    fields?: {};
}): any[];
export declare function CalculateDistance(lat1: any, lon1: any, lat2: any, lon2: any): number;
export declare function getEventAttrs(eventType: 'onMouseDown' | 'onMouseMove' | 'onMouseUp', callback: any): {
    [x: string]: any;
};
export declare function JsonValidator(json: any, schema: any): any;
export declare class Swip {
    p: I_Swip;
    geo: Geo;
    timeout: any;
    count: number;
    domLimit: I_Swip_domLimit;
    parentLimit: I_Swip_domLimit;
    getDom: () => any;
    getParent: () => any;
    init: () => void;
    dx: number;
    dy: number;
    cx: number;
    cy: number;
    dist: number;
    so: {
        client?: {
            x: number;
            y: number;
        };
        x?: number;
        y?: number;
    };
    getPercentByValue: (value: number, start: number, end: number) => number;
    getMousePosition: (e: any) => I_Swip_mousePosition;
    click: (e: any) => void;
    mouseDown: (e: any) => void;
    mouseMove: (e: any) => void;
    mouseUp: (e: any) => void;
    getDOMLimit: (type: 'dom' | 'parent') => I_Swip_domLimit;
    change: I_Swip_change;
    getPage: () => any;
    isMoving: boolean;
    centerAngle: number;
    constructor(p: I_Swip);
}
export declare class AIODate {
    isMatch: (date: I_Date, matchers: string[]) => boolean;
    convertToArray: (date: I_Date, jalali?: boolean) => number[];
    isAny: (date1: I_Date, date2: I_Date, key: 'less' | 'greater' | 'equal') => boolean;
    isLess: (date1: I_Date, date2: I_Date) => boolean;
    isGreater: (date1: I_Date, date2: I_Date) => boolean;
    isEqual: (date1: I_Date, date2: I_Date) => boolean;
    isBetween: (date1: I_Date, dates: [I_Date, I_Date]) => boolean;
    getWeekDay: (date: I_Date) => {
        weekDay: string;
        index: number;
    };
    isJalali: (date: I_Date) => boolean;
    getWeekDays: (jalali?: boolean) => string[];
    toGregorian: (date: I_Date) => number[];
    toJalali: (date: I_Date) => number[];
    pattern: (date: I_Date, pattern: string, jalali?: boolean) => string;
    get2Digit: (n: number) => string;
    getMonths: (jalali?: boolean) => string[];
    getSplitter: (value: string) => string;
    getTime: (date: I_Date, jalali?: boolean) => number;
    getNextTime: (date: I_Date, offset: number, jalali?: boolean) => number[];
    getMonthDaysLength: (date: I_Date) => number;
    getYearDaysLength: (date: I_Date) => number;
    getDaysOfWeek: (date: I_Date, pattern?: string) => any[];
    getDatesBetween: (date: I_Date, otherDate: any, step?: number) => any[];
    getDelta: (date: I_Date, otherDate?: I_Date, unit?: 'day' | 'hour' | 'minute' | 'second' | 'tenthsecond' | 'milisecond') => {
        day: number;
        hour: number;
        minute: number;
        second: number;
        tenthsecond: number;
        miliseconds: number;
        type: 'ramaining' | 'passed';
    };
    convertMiliseconds: (miliseconds: number, unit?: 'day' | 'hour' | 'minute' | 'second' | 'tenthsecond' | 'milisecond') => {
        day: number;
        hour: number;
        minute: number;
        second: number;
        tenthsecond: number;
        miliseconds: number;
        type: 'ramaining' | 'passed';
    };
    getDaysOfMonth: (date: I_Date, pattern?: string) => any[];
    getLastDayOfMonth: (date: I_Date) => any[];
    getDateByPattern: (date: I_Date, pattern: string) => string;
    getToday: (jalali?: boolean) => number[];
    getDayIndex: (date: I_Date, unit: 'week' | 'year' | 'month') => number;
    constructor();
}
export declare class Geo {
    getAngle: (l: I_line | I_dline) => number;
    getDipAngle: (dip: I_dip) => number;
    getLength: (p: I_line) => number;
    getPrepDip: (dip: I_dip) => number;
    getDip: (l: I_line | I_dline) => I_dip;
    getPrepFromLine: (l: I_dline | I_line, point: I_point, offset: number) => I_point;
    getLineBySLA: (p1: I_point, length: number, angle: number) => I_line;
    getArcByPoints: (arcPoints: I_point[], height?: number) => any;
    getAvg: (list: I_point[]) => I_point;
    getArcBy3Points: (p1: I_point, p2: I_point, p3: I_point) => I_arc;
    getYOnLineByX: (l: I_dline | I_line, X: number) => number;
    getXOnLineByY: (l: I_dline | I_line, Y: number) => number;
    getMeet: (l1: I_dline | I_line, l2: I_dline | I_line) => I_point | false;
    getInnerMeet: (line1: I_line, line2: I_line) => false | I_point;
    getDLineByLine: (line: I_line) => I_dline;
    getPointsByNGon: (r: number, count: number, corner: number) => I_point[];
    getLineByDLine: (dline: I_dline) => I_line;
    tri: (type: 'sin' | 'cos', teta: number) => number;
    getPrepToLine: (l: I_dline | I_line, p: I_point) => I_point | false;
    getLineType: (line: I_dline | I_line) => 'DLine' | 'Line';
    getLine: (l: I_dline | I_line) => I_line;
    getDLine: (l: I_dline | I_line) => I_dline;
    setLineByLength: (line: I_line, length: number, from?: 'center' | 'start' | 'end') => I_line;
    getParallelLine: (points: I_point[], offset: number) => I_point[];
    getPointsByDivide: (points: I_point[], divide: number) => I_point[];
    fix: (value: number) => number;
    setLineByAngle: (line: I_line, angle: number) => I_line;
    getNumberByStep: (number: number, step: number) => number;
    setLineByOrtho: (line: I_line, ortho: number) => I_line;
    rotateSpline: (points: I_point[], angle: number, center: I_point) => I_point[];
    isPointInPath: (points: I_point[], point: I_point) => boolean;
    getDXF: (p: {
        type: 'line' | 'rect' | 'arc';
        obj: any;
    }[]) => string;
    constructor();
}
export declare function svgArc(x: any, y: any, radius: any, startAngle: any, endAngle: any): string;
