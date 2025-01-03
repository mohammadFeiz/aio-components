type I_dateObject = {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
};
export type I_Date = string | number | Date | I_dateObject | number[];
export default class AIODate {
    isMatch: (date: I_Date, matchers: string[]) => boolean;
    convertToArray: (date: I_Date, jalali?: boolean) => number[];
    isLess: (date1: I_Date, date2: I_Date) => boolean;
    isGreater: (date1: I_Date, date2: I_Date) => boolean;
    isEqual: (date1: I_Date, date2: I_Date) => boolean;
    isBetween: (date1: I_Date, dates: [I_Date, I_Date]) => boolean;
    compaire: (date1: I_Date, date2: I_Date) => 'less' | 'greater' | 'equal';
    getWeekDay: (date: I_Date) => {
        weekDay: string;
        index: number;
    };
    isToday: (date: I_Date) => boolean;
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
        type: 'remaining' | 'passed' | 'now';
    };
    convertMiliseconds: (miliseconds: number, unit?: 'day' | 'hour' | 'minute' | 'second' | 'tenthsecond' | 'milisecond') => {
        day: number;
        hour: number;
        minute: number;
        second: number;
        tenthsecond: number;
        miliseconds: number;
        type: 'remaining' | 'passed' | 'now';
    };
    getDaysOfMonth: (date: I_Date, pattern?: string) => any[];
    getLastDayOfMonth: (date: I_Date) => any[];
    getDateByPattern: (date: I_Date, pattern: string) => string;
    getToday: (jalali?: boolean) => number[];
    getDayIndex: (date: I_Date, unit: 'week' | 'year' | 'month') => number;
    getYesterday: (date: I_Date) => I_Date;
    getTomarrow: (date: I_Date) => I_Date;
    toMiliseconds: (p: {
        year?: number;
        month?: number;
        day?: number;
        hour?: number;
        minute?: number;
        second?: number;
    }) => number;
    getDateByDeltaMiliseconds: (date: I_Date, miliseconds: number) => number[];
    constructor();
}
export {};
