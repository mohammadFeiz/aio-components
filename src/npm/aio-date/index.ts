type I_dateObject = { year?: number, month?: number, day?: number, hour?: number, minute?: number };
export type I_Date = string | number | Date | I_dateObject | number[];
export default class AIODate {
    isThisWeek = (date:I_Date,jalali?:boolean):boolean=>{
        jalali = jalali === undefined?this.isJalali(date):jalali
        const [year,month,day] = this.convertToArray(date,jalali)
        const days = this.getDaysOfWeek([year,month,day])
        for(let d of days){
            if(year !== d[0]){continue}
            if(month !== d[1]){continue}
            if(day !== d[1]){continue}
            return true
        }
        return false
    }
    isThisMonth = (date:I_Date,jalali?:boolean):boolean=>{
        jalali = jalali === undefined?this.isJalali(date):jalali
        const dateArray = this.convertToArray(date,jalali)
        const [year,month] = this.getToday(jalali)
        if(dateArray[0] !== year){return false}
        if(dateArray[1] !== month){return false}
        return true
    }
    toMiliseconds = (p: { year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number }):number => {
        const { day = 0, hour = 0, minute = 0, second = 0 } = p;
        let res = 0;
        res += day * 24 * 60 * 60 * 1000;
        res += hour * 60 * 60 * 1000;
        res += minute * 60 * 1000;
        res += second * 1000;
        return res
    }
    isMatch = (date: I_Date, matchers: string[]):boolean => {
        date = this.convertToArray(date)
        for (let i = 0; i < matchers.length; i++) {
            let matcher = matchers[i], type, targets;
            try {
                let a = matcher.split(',');
                type = a[0];
                targets = a.slice(1, a.length);
            }
            catch { return false }
            if (type === '<') { for (let i = 0; i < targets.length; i++) { if (this.isLess(date, targets[i])) { return true } } }
            else if (type === '>') { for (let i = 0; i < targets.length; i++) { if (this.isGreater(date, targets[i])) { return true } } }
            else if (type === '<=') { for (let i = 0; i < targets.length; i++) { if (this.isEqual(date, targets[i])) { return true } if (this.isLess(date, targets[i])) { return true } } }
            else if (type === '>=') { for (let i = 0; i < targets.length; i++) { if (this.isEqual(date, targets[i])) { return true } if (this.isGreater(date, targets[i])) { return true } } }
            else if (type === '=') { for (let i = 0; i < targets.length; i++) { if (this.isEqual(date, targets[i])) { return true } } }
            else if (type === '!=') { for (let i = 0; i < targets.length; i++) { if (!this.isEqual(date, targets[i])) { return true } } }
            else if (type === '<>') {
                if (targets[0] && targets[1]) {
                    let start, end;
                    if (this.isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
                    else { start = targets[1]; end = targets[0]; }
                    if (this.isGreater(date, start) && this.isLess(date, end)) { return true }
                }
            }
            else if (type === '<=>') {
                if (targets[0] && targets[1]) {
                    let start, end;
                    if (this.isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
                    else { start = targets[1]; end = targets[0]; }
                    if (this.isGreater(date, start) && this.isLess(date, end)) { return true }
                    if (this.isEqual(date, start) || this.isEqual(date, end)) { return true }
                }
            }
            else if (type === '!<>') {
                if (targets[0] && targets[1]) {
                    let start, end;
                    if (this.isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
                    else { start = targets[1]; end = targets[0]; }
                    if (!this.isGreater(date, start) || !this.isLess(date, end)) { return true }
                }
            }
            else if (type === '!<=>') {
                if (targets[0] && targets[1]) {
                    let start, end;
                    if (this.isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
                    else { start = targets[1]; end = targets[0]; }
                    if (!this.isEqual(date, start) && !this.isEqual(date, end) && (this.isLess(date, start) || this.isGreater(date, end))) { return true }
                }
            }
            else if (type === 'w') {
                let w = this.getWeekDay(date).index;
                for (let i = 0; i < targets.length; i++) { if (w === +targets[i]) { return true } }
            }
            else if (type === '!w') {
                let w = this.getWeekDay(date).index;
                for (let i = 0; i < targets.length; i++) { if (w !== +targets[i]) { return true } }
            }
        }
        return false
    }
    convertToArray = (date: I_Date, jalali?: boolean):number[] => {
        if (!date) { return [] }
        let list;
        if (Array.isArray(date)) { list = [...date] }
        else if (typeof date === 'string') {
            if (date.indexOf("T") !== -1) {
                //"2015-03-25T12:00:00Z"
                let [d1, t1] = date.split("T");
                let t2 = t1.split(".")[0];
                let t3 = t2.split(':');
                let d2 = d1.split('-');
                list = [...d2.map((o) => +o), ...t3.map((o) => +o), 0]
            }
            else {
                list = date.split(this.getSplitter(date)).map((o) => +o);
            }
        }
        else if (typeof date === 'number') {
            let d = new Date(date);
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            let day = d.getDate();
            let hour = d.getHours();
            let minute = d.getMinutes();
            let second = d.getSeconds();
            let miliseconds = d.getMilliseconds();
            let tenthsecond = Math.round(miliseconds / 100);
            list = [year, month, day, hour, minute, second, tenthsecond]
        }
        else if (typeof date === 'object') {
            if (typeof (date as Date).getMonth === 'function') {
                let dateObject = date as Date;
                let year = dateObject.getFullYear();
                let month = dateObject.getMonth() + 1;
                let day = dateObject.getDate();
                let hour = dateObject.getHours();
                let minute = dateObject.getMinutes();
                let second = dateObject.getSeconds();
                let miliseconds = dateObject.getMilliseconds();
                let tenthsecond = Math.round(miliseconds / 100);
                list = [year, month, day, hour, minute, second, tenthsecond]
            }
            else {
                let today = this.getToday(jalali);
                let dateObject = date as { year?: number, month?: number, day?: number, hour?: number, minute?: number, second?: number }
                return [
                    dateObject.year === undefined ? today[0] : dateObject.year,
                    dateObject.month === undefined ? today[1] : dateObject.month,
                    dateObject.day === undefined ? today[2] : dateObject.day,
                    dateObject.hour === undefined ? today[3] : dateObject.hour,
                    dateObject.minute === undefined ? today[4] : dateObject.minute,
                    dateObject.second === undefined ? today[5] : dateObject.second,
                ]
            }
        }
        else { return [] }
        if (jalali) {
            let [year, month, day] = this.toJalali([list[0], list[1], list[2]]);
            list[0] = year; list[1] = month; list[2] = day;
        }
        return list
    }
    compaire = (date1: I_Date, date2: I_Date):'less' | 'greater' | 'equal' => {
        date1 = this.convertToArray(date1);
        date2 = this.convertToArray(date2);
        let compaireKey: 'equal' | 'less' | 'greater' = 'equal';
        for (let i = 0; i < date1.length; i++) {
            if (isNaN(date2[i])) { date2[i] = date1[i] }
            let a = date1[i];
            let b = date2[i] || 0;
            if (a < b) { compaireKey = 'less'; break; }
            if (a > b) { compaireKey = 'greater'; break; }
        }
        return compaireKey;
    }
    isLess = (date1: I_Date, date2: I_Date):boolean => this.compaire(date1, date2) === 'less'
    isEqual = (date1: I_Date, date2: I_Date):boolean => this.compaire(date1, date2) === 'equal'
    isGreater = (date1: I_Date, date2: I_Date):boolean => this.compaire(date1, date2) === 'greater'
    isBetween = (date1: I_Date, dates: [I_Date, I_Date]):boolean => this.compaire(date1, dates[0]) === 'greater' && this.compaire(date1, dates[1]) === 'less'
    isToday = (date: I_Date):boolean => this.isEqual(date, this.getToday(this.isJalali(date)))
    getDateByDeltaMiliseconds = (date: I_Date, miliseconds: number):number[] => this.convertToArray(this.getTime(date) + miliseconds)
    getWeekDay = (date: I_Date):{ weekDay: string, index: number } => {
        let dateArray = this.convertToArray(date);
        let jalali = this.isJalali(dateArray);
        dateArray = this.toGregorian(date) as number[]
        let index = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]).getDay();
        if (jalali) {
            index += 1;
            index = index % 7;
        }
        return { weekDay: this.getWeekDays(jalali)[index], index };
    }
    isJalali = (date: I_Date):boolean => { return this.convertToArray(date)[0] < 1700 ? true : false }
    getWeekDays = (jalali?: boolean):string[] => {
        return [
            ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
            ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
        ][jalali ? 0 : 1]
    }
    toGregorian = (date: I_Date):number[] => {
        if (!date) { return [] }
        let arr = this.convertToArray(date);
        let jalali = this.isJalali(arr);
        if (!jalali) { return arr }
        let [jy, jm, jd] = arr;
        var sal_a, gy, gm, gd, days;
        jy += 1595; days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
        gy = 400 * ~~(days / 146097); days %= 146097;
        if (days > 36524) { gy += 100 * ~~(--days / 36524); days %= 36524; if (days >= 365) days++; }
        gy += 4 * ~~(days / 1461); days %= 1461;
        if (days > 365) { gy += ~~((days - 1) / 365); days = (days - 1) % 365; }
        gd = days + 1;
        sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
        arr[0] = gy; arr[1] = gm; arr[2] = gd;
        return arr;
    }
    pattern = (date: I_Date, pattern: string, jalali?: boolean):string => {
        jalali = jalali === undefined?this.isJalali(date):jalali
        date = this.convertToArray(date, jalali);
        let [year, month, day, hour, minute, second, tenthsecond] = date;
        pattern = pattern.replace('{year}', year.toString());
        if (typeof month === 'number') { pattern = pattern.replace('{month}', this.get2Digit(month)); }
        if (typeof day === 'number') { pattern = pattern.replace('{day}', this.get2Digit(day)); }
        if (typeof hour === 'number') { pattern = pattern.replace('{hour}', this.get2Digit(hour)); }
        if (typeof minute === 'number') { pattern = pattern.replace('{minute}', this.get2Digit(minute)); }
        if (typeof second === 'number') { pattern = pattern.replace('{second}', this.get2Digit(second)); }
        if (typeof tenthsecond === 'number') { pattern = pattern.replace('{tenthsecond}', this.get2Digit(tenthsecond)); }
        if (pattern.indexOf('{monthString}') !== -1) {
            pattern = pattern.replace('{monthString}', this.getMonths(jalali)[month - 1]);
        }
        if (pattern.indexOf('{weekDay}') !== -1) {
            let weekDays = this.getWeekDays(jalali);
            let { index } = this.getWeekDay(date);
            pattern = pattern.replace('{weekDay}', weekDays[index]);
        }
        return pattern
    }
    get2Digit = (n: number):string => {
        let ns: string;
        try { ns = n.toString() }
        catch { return n.toString() }
        if (ns.length === 1) { ns = '0' + n }
        return ns
    }
    getMonths = (jalali?: boolean):string[] => {
        return [
            ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',],
            ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
        ][jalali ? 0 : 1]
    }
    toJalali = (date: I_Date):number[] => {
        let arr = this.convertToArray(date);
        let jalali = this.isJalali(arr);
        if (jalali) { return arr }
        let [gy, gm, gd] = arr;
        var g_d_m, jy, jm, jd, gy2, days;
        g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        gy2 = (gm > 2) ? (gy + 1) : gy;
        days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
        jy = -1595 + (33 * ~~(days / 12053)); days %= 12053; jy += 4 * ~~(days / 1461); days %= 1461;
        if (days > 365) { jy += ~~((days - 1) / 365); days = (days - 1) % 365; }
        if (days < 186) { jm = 1 + ~~(days / 31); jd = 1 + (days % 31); } else { jm = 7 + ~~((days - 186) / 30); jd = 1 + ((days - 186) % 30); }
        arr[0] = jy; arr[1] = jm; arr[2] = jd;
        return arr;
    }
    getSplitter = (value:string):string => {
        let splitter = '/';
        for (let i = 0; i < value.length; i++) {if (isNaN(parseInt(value[i]))) { return value[i] }}
        return splitter;
    }
    getTime = (date: I_Date, jalali?: boolean):number => {
        if (!date) { return 0 }
        jalali = jalali === undefined?this.isJalali(date):jalali;
        if (typeof date === 'number') { return date }
        date = this.convertToArray(date);
        let [year, month = 1, day = 1, hour = 0, minute = 0, second = 0, tenthsecond = 0] = date;
        if (jalali) { date = this.toGregorian([year, month, day, hour, minute, second, tenthsecond]) }
        let time = new Date(date[0], date[1] - 1, date[2]).getTime()
        time += hour * 60 * 60 * 1000;
        time += minute * 60 * 1000;
        time += second * 1000;
        time += tenthsecond * 100;
        return time;
    }
    getNextTime = (date: I_Date, offset: number, jalali?: boolean):number[] => {
        if (!offset) { return this.convertToArray(date) }
        jalali = jalali === undefined?this.isJalali(date):jalali
        let time: number = this.getTime(date, jalali);
        time += offset;
        let dateArray: number[] = this.convertToArray(time);
        if (jalali) {
            let [jy, jm, jd] = this.toJalali(dateArray);
            dateArray[0] = jy; dateArray[1] = jm; dateArray[2] = jd;
        }
        return dateArray;
    }
    getMonthDaysLength = (date:I_Date):number => {
        if (!date) { return 0 }
        let [year, month] = this.convertToArray(date);
        let jalali = this.isJalali([year, month]);
        if (jalali) { return [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, [1, 5, 9, 13, 17, 22, 26, 30].indexOf(year % 33) === -1 ? 29 : 30][month - 1] }
        else { return new Date(year, month - 1, 0).getDate(); }
    }
    getYearDaysLength = (date:I_Date):number => {
        if (!date) { return 0 }
        let [year] = this.convertToArray(date);
        let res = 0;
        for (let i = 1; i <= 12; i++) {res += this.getMonthDaysLength([year, i])}
        return res
    }
    getYesterday = (date: I_Date):I_Date => {
        const [year, month, day] = this.convertToArray(date);
        let newYear = year, newMonth = month, newDay = day;
        if (day === 1) {
            if (month === 1) {newYear = newYear - 1; newMonth = 12; newDay = this.getMonthDaysLength([newYear, newMonth])}
            else {newMonth = newMonth - 1; newDay = this.getMonthDaysLength([newYear, newMonth])}
        }
        else {newDay = newDay - 1}
        return [newYear, newMonth, newDay]
    }
    getTomarrow = (date:I_Date):I_Date => {
        const [year, month, day] = this.convertToArray(date);
        let newYear = year, newMonth = month, newDay = day;
        const daysLength = this.getMonthDaysLength(date)
        if (day === daysLength) {
            if (month === 12) {newYear = newYear + 1; newMonth = 1; newDay = 1}
            else {newMonth = newMonth + 1; newDay = 1}
        }
        else {newDay = newDay + 1}
        return [newYear, newMonth, newDay]
    }
    getDaysOfWeek = (date:I_Date, pattern?:string):any[] => {
        if (!date) { return [] }
        let dateArray = this.convertToArray(date);
        let { index } = this.getWeekDay(dateArray);
        let firstDay: I_Date = [...dateArray];
        for (let i = 0; i < index; i++) {firstDay = this.getYesterday(firstDay);}
        const res: I_Date[] = [];
        for (let i = 0; i < 7; i++) {
            res.push(firstDay)
            firstDay = this.getTomarrow(firstDay)
        }
        if (pattern) { return res.map((o) => this.getDateByPattern(o, pattern)) }
        return res
    }
    getDatesBetween = (date:I_Date, otherDate:any, step:number):any[] => {
        if (!date || !otherDate) { return [] }
        date = this.convertToArray(date);
        otherDate = this.convertToArray(otherDate);
        if (!this.isGreater(otherDate, date)) { return [] }
        let delta = this.getDelta(date, otherDate) as { miliseconds: number };
        let length = delta.miliseconds / step;
        if (isNaN(length) || length > 1000) {
            console.error('AIODate().getDatesBetween() => too many dates');
            return [];
        }
        let nextDate = this.getNextTime(date, step);
        let res = [];
        while (this.isLess(nextDate, otherDate)) {
            res.push(nextDate);
            nextDate = this.getNextTime(nextDate, step);
        }
        return res
    }
    getDelta = (date:I_Date, otherDate?:I_Date, unit?:'day' | 'hour' | 'minute' | 'second' | 'tenthsecond' | 'milisecond'):{ day: number, hour: number, minute: number, second: number, tenthsecond: number, miliseconds: number, type: 'remaining' | 'passed' | 'now' } => {
        let dif = this.getTime(date) - this.getTime(otherDate || this.getToday());
        return this.convertMiliseconds(-dif, unit)
    }
    convertMiliseconds = (miliseconds:number, unit?:'day' | 'hour' | 'minute' | 'second' | 'tenthsecond' | 'milisecond'):{ day: number, hour: number, minute: number, second: number, tenthsecond: number, miliseconds: number, type: 'remaining' | 'passed' | 'now' } => {
        unit = unit || 'day'
        let type: 'remaining' | 'passed' | 'now';
        if (miliseconds < 0) { type = 'passed'; miliseconds = -miliseconds }
        else if (miliseconds > 0) { type = 'remaining' }
        else { type = 'now' }
        let index = ['day', 'hour', 'minute', 'second', 'tenthsecond', 'milisecond'].indexOf(unit);
        let day = 0, hour = 0, minute = 0, second = 0, tenthsecond = 0;
        let dif = miliseconds;
        if (index <= 0) {
            day = Math.floor(dif / (24 * 60 * 60 * 1000));
            dif -= day * (24 * 60 * 60 * 1000);
        }
        if (index <= 1) {
            hour = Math.floor(dif / (60 * 60 * 1000));
            dif -= hour * (60 * 60 * 1000);
        }
        if (index <= 2) {
            minute = Math.floor(dif / (60 * 1000));
            dif -= minute * (60 * 1000);
        }
        if (index <= 3) {
            second = Math.floor(dif / (1000));
            dif -= second * (1000);
        }
        if (index <= 4) {
            tenthsecond = Math.floor(dif / (100));
        }
        return { day, hour, minute, second, tenthsecond, miliseconds, type }
    }
    getDaysOfMonth = (date:I_Date, pattern?:string):any[] => {
        if (!date) { return [] }
        let dateArray = this.convertToArray(date);
        let daysLength = this.getMonthDaysLength(date)
        let firstDay: I_Date = [dateArray[0], dateArray[1], 1];
        let res: I_Date[] = []
        for (let i = 0; i < daysLength; i++) {
            res.push(firstDay)
            firstDay = this.getTomarrow(firstDay);
        }
        if (pattern) { return res.map((o) => this.getDateByPattern(o, pattern)) }
        return res
    }
    getLastDayOfMonth = (date:I_Date):any[] => {
        let dateArray: number[] = this.convertToArray(date);
        let length = this.getMonthDaysLength(dateArray);
        return [dateArray[0], dateArray[1], length];
    }
    getDateByPattern = (date:I_Date, pattern:string):string => this.pattern(date, pattern)
    getToday = (jalali?:boolean):number[] => {
        let date = new Date();
        let dateArray: number[] = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), Math.round(date.getMilliseconds() / 100)]
        if (jalali) { dateArray = this.toJalali(dateArray) as number[] }
        return dateArray;
    }
    getDayIndex = (date:I_Date, unit: 'week' | 'year' | 'month'):number => {
        date = this.convertToArray(date);
        if (unit === 'week') {
            let days = this.getDaysOfWeek(date);
            for (let i = 0; i < days.length; i++) {
                let [year, month, day] = days[i];
                if (year !== date[0]) { continue }
                if (month !== date[1]) { continue }
                if (day !== date[2]) { continue }
                return i;
            }
        }
        if (unit === 'month') {return date[2] - 1;}
        if (unit === 'year') {
            let res = 0;
            for (let i = 0; i < date[1] - 1; i++) {res += this.getMonthDaysLength(date)}
            res += date[1];
            return res - 1
        }
        return 0
    }
}