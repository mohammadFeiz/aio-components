class AIODateTS {
    isMatch: (p: { date: any, matchers: string[] }) => boolean;
    convertToArray: (p: { date: any, jalali?: boolean }) => number[];
    getToCompaire:(o1:any,o2:any)=>{date:any,otherDate:any}
    isLess:(o1:any,o2:any)=>boolean;
    isGreater:(o1:any,o2:any)=>boolean;
    isEqual:(o1:any,o2:any)=>boolean;
    isBetween:(o1:any,o2:any)=>boolean;
    compaire:(p:{date:any,otherDate:any})=>'less'|'greater'|'equal';
    getWeekDay:(p:{date:any})=>{weekDay:string,index:number}
    isJalali:(date:any)=>boolean;
    getWeekDays:(p?:{jalali?:boolean})=>string[];
    toGregorian:(p:{date:any,pattern?:string})=>string | number[];
    toJalali:(p:{date:any,pattern?:string})=>string | number[];
    pattern:(date:any,pattern:string,jalali?:boolean)=>string;
    get2Digit:(n:number)=>string;
    getMonths:(p?:{jalali?:boolean})=>string[];
    getSplitter:(value:string)=>string;
    getTime:(p:{date:any,jalali?:boolean})=>number;
    getNextTime:(p:{date:any,offset:number,pattern?:string,jalali?:boolean})=>number[] | string;
    getMonthDaysLength:(p:{date:any})=>number;
    getYearDaysLength:(p:{date:any})=>number;
    getDaysOfWeek:(p:{date:any,pattern?:string})=>any[];
    getDatesBetween:(p:{date:any,otherDate:any,step?:number,pattern?:string})=>any[];
    getDelta:(p:{date:any,otherDate?:any,pattern?:string,unit?:'day' | 'hour' | 'minute' | 'second' | 'tenthsecond' | 'milisecond'})=>{ day:number, hour:number, minute:number, second:number, tenthsecond:number, miliseconds:number, type:'ramaining'|'passed' } | string;
    convertMiliseconds:(p:{miliseconds:number,unit?:'day' | 'hour' | 'minute' | 'second' | 'tenthsecond' | 'milisecond',pattern?:string})=>{ day:number, hour:number, minute:number, second:number, tenthsecond:number, miliseconds:number, type:'ramaining'|'passed' } | string;
    getDaysOfMonth:(p:{date:any,pattern?:string})=>any[];
    getLastDayOfMonth:(p:{date:any,pattern?:string})=>any[] | string;
    getDateByPattern:(p:{date:any,pattern?:string,jalali?:boolean})=>string;
    constructor() {
        this.isMatch = (p) => {
            let { date, matchers } = p;
            date = this.convertToArray({ date })
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
                    let w = this.getWeekDay({ date }).index;
                    for (let i = 0; i < targets.length; i++) { if (w === +targets[i]) { return true } }
                }
                else if (type === '!w') {
                    let w = this.getWeekDay({ date }).index;
                    for (let i = 0; i < targets.length; i++) { if (w !== +targets[i]) { return true } }
                }
            }
            return false
        }
        this.convertToArray = (p) => {
            let { date, jalali } = p || {};
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
                    list = [...d2.map((o)=>+o),...t3.map((o)=>+o), 0]
                }
                else {
                    list = date.split(this.getSplitter(date)).map((o)=>+o);
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
                if (typeof date.year === 'number') { return [date.year, date.month, date.day, date.hour] }
                else {
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    let hour = date.getHours();
                    let minute = date.getMinutes();
                    let second = date.getSeconds();
                    let miliseconds = date.getMilliseconds();
                    let tenthsecond = Math.round(miliseconds / 100);
                    list = [year, month, day, hour, minute, second, tenthsecond]
                }
            }
            else { return false }
            if (jalali) {
                let [year, month, day] = this.toJalali({ date: [list[0], list[1], list[2]] });
                list[0] = year; list[1] = month; list[2] = day;
            }
            return list
        }
        this.isLess = (o1, o2) => {
            if (!o1 || !o2) { return false }
            return this.compaire(this.getToCompaire(o1, o2)) === 'less'
        }
        this.isEqual = (o1, o2) => {
            if (!o1 || !o2) { return false }
            return this.compaire(this.getToCompaire(o1, o2)) === 'equal'
        }
        this.isGreater = (o1, o2) => {
            if (!o1 || !o2) { return false }
            return this.compaire(this.getToCompaire(o1, o2)) === 'greater'
        }
        this.isBetween = (o1, [o2, o3]) => {
            if (!o1 || !o2 || !o3) { return false }
            return this.isGreater(o1, o2) && this.isLess(o1, o3)
        }
        this.getToCompaire = (o1, o2) => {
            o1 = this.convertToArray({ date: o1 });
            o2 = this.convertToArray({ date: o2 });
            for (let i = 0; i < o1.length; i++) { if (isNaN(o2[i])) { o2[i] = o1[i] } }
            return { date: o1, otherDate: o2 }
        }
        this.compaire = (p) => {
            let { date, otherDate } = p;
            if (!date || !otherDate) { return }
            let arr1 = this.convertToArray({ date });
            let arr2 = this.convertToArray({ date: otherDate });
            for (let i = 0; i < arr1.length; i++) {
                let a = arr1[i];
                let b = arr2[i] || 0;
                if (a < b) { return 'less' }
                if (a > b) { return 'greater' }
            }
            return 'equal';
        }
        this.getWeekDay = (p) => {
            let date = this.convertToArray({ date: p.date });
            let jalali = this.isJalali(date);
            let dateArray = this.toGregorian({ date }) as number[]
            let index = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]).getDay();
            if (jalali) {
                index += 1;
                index = index % 7;
            }
            return { weekDay: this.getWeekDays({ jalali })[index], index };
        }
        this.isJalali = (date) => { return this.convertToArray({ date })[0] < 1700 ? true : false }
        this.getWeekDays = (p = {}) => {
            return [
                ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
                ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
            ][p.jalali ? 0 : 1]
        }
        this.toGregorian = (p) => {
            if (!p || !p.date) { return []}
            let arr = this.convertToArray({ date: p.date });
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
            if (p.pattern) { return this.pattern(arr, p.pattern) }
            return arr;
        }
        this.pattern = (date, pattern, Jalali) => {
            date = this.convertToArray({ date, jalali: Jalali });
            let [year, month, day, hour, minute, second, tenthsecond] = date;
            let jalali = this.isJalali(date);
            pattern = pattern.replace('{year}', year);
            if (typeof month === 'number') { pattern = pattern.replace('{month}', this.get2Digit(month)); }
            if (typeof day === 'number') { pattern = pattern.replace('{day}', this.get2Digit(day)); }
            if (typeof hour === 'number') { pattern = pattern.replace('{hour}', this.get2Digit(hour)); }
            if (typeof minute === 'number') { pattern = pattern.replace('{minute}', this.get2Digit(minute)); }
            if (typeof second === 'number') { pattern = pattern.replace('{second}', this.get2Digit(second)); }
            if (typeof tenthsecond === 'number') { pattern = pattern.replace('{tenthsecond}', this.get2Digit(tenthsecond)); }
            if (pattern.indexOf('{monthString}') !== -1) {
                pattern = pattern.replace('{monthString}', this.getMonths({ jalali })[month - 1]);
            }
            if (pattern.indexOf('{weekDay}') !== -1) {
                let weekDays = this.getWeekDays({ jalali });
                let { index } = this.getWeekDay({ date });
                pattern = pattern.replace('{weekDay}', weekDays[index]);
            }
            return pattern
        }
        this.get2Digit = (n) => {
            let ns;
            try { ns = n.toString() }
            catch { return n }
            if (ns.length === 1) { ns = '0' + n }
            return ns
        }
        this.getMonths = ({ jalali }) => {
            return [
                ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',],
                ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
            ][jalali ? 0 : 1]
        }
        this.toJalali = (p) => {
            if (!p || !p.date) { return }
            let arr = this.convertToArray({ date: p.date });
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
            if (p.pattern) { return this.pattern(arr, p.pattern) }
            return arr;
        }
        this.getSplitter = (value) => {
            let splitter = '/';
            for (let i = 0; i < value.length; i++) {
                if (isNaN(parseInt(value[i]))) { return value[i] }
            }
            return splitter;
        }
        this.getTime = (p) => {
            let { date, jalali = this.isJalali(date) } = p || {};
            if (!date) { return }
            if (typeof date === 'number') { return date }
            date = this.convertToArray({ date });
            let [year, month = 1, day = 1, hour = 0, minute = 0, second = 0, tenthsecond = 0] = date;
            if (jalali) { date = this.toGregorian({ date: [year, month, day, hour, minute, second, tenthsecond] }) }
            let time = new Date(date[0], date[1] - 1, date[2]).getTime()
            time += hour * 60 * 60 * 1000;
            time += minute * 60 * 1000;
            time += second * 1000;
            time += tenthsecond * 100;
            return time;
        }
        this.getNextTime = (p) => {
            let { date, offset, pattern } = p || {};
            if (!offset || !date) { return date }
            let jalali = this.isJalali(date);
            let time = this.getTime({ date, jalali });
            time += offset;
            let dateArray = this.convertToArray({ date: time });
            if (jalali || p.jalali) {
                let [jy, jm, jd] = this.toJalali({ date: dateArray });
                time[0] = jy; time[1] = jm; time[2] = jd;
            }
            if (pattern) { return this.pattern(dateArray, pattern) }
            return time;
        }
        this.getMonthDaysLength = (p) => {
            let { date } = p || {};
            if (!date) { return 0}
            let [year, month] = this.convertToArray({ date });
            let jalali = this.isJalali([year, month]);
            if (jalali) { return [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, [1, 5, 9, 13, 17, 22, 26, 30].indexOf(year % 33) === -1 ? 29 : 30][month - 1] }
            else { return new Date(year, month - 1, 0).getDate(); }
        }
        this.getYearDaysLength = (p) => {
            let { date } = p || {};
            if (!date) { return 0}
            let [year] = this.convertToArray({ date });
            let res = 0;
            for (let i = 1; i <= 12; i++) {
                res += this.getMonthDaysLength({ date: [year, i] })
            }
            return res
        }
        this.getDaysOfWeek = (p) => {
            let {date} = p || {};
            if(!date){return []}
            let dateArray = this.convertToArray(date);
            let { index } = this.getWeekDay({ date: dateArray });
            let startDate = this.getNextTime({ date: [dateArray[0], dateArray[1], dateArray[2]], offset: -(index + 1) * 24 * 60 * 60 * 1000 });
            let endDate = this.getNextTime({ date: [dateArray[0], dateArray[1], dateArray[2]], offset: (7 - index) * 24 * 60 * 60 * 1000 });
            return this.getDatesBetween({ date: startDate, otherDate: endDate, pattern: p.pattern, step: 24 * 60 * 60 * 1000 })
        }
        this.getDatesBetween = (p) => {
            let { date, otherDate, step = 24 * 60 * 60 * 1000, pattern } = p || {};
            if(!date || !otherDate){return []}
            date = this.convertToArray({ date: date });
            otherDate = this.convertToArray({ date: otherDate });
            if (!this.isGreater(otherDate, date)) { return [] }
            let delta = this.getDelta({ date, otherDate }) as {miliseconds:number};
            let length = delta.miliseconds / step;
            if (isNaN(length) || length > 1000) {
                console.error('AIODate().getDatesBetween() => too many dates');
                return;
            }
            let nextDate = this.getNextTime({ date, offset: step });
            let res = [];
            while (this.isLess(nextDate, otherDate)) {
                if (pattern) {
                    res.push(this.pattern(nextDate, pattern));
                }
                else {
                    res.push(nextDate);
                }
                nextDate = this.getNextTime({ date: nextDate, offset: step });
            }
            return res
        }
        this.getDelta = (p) => {
            let { date, otherDate = new Date().getTime(), pattern, unit } = p || {};
            let dif = this.getTime({ date }) - this.getTime({ date: otherDate });
            return this.convertMiliseconds({ miliseconds: -dif, unit, pattern })
        }
        this.convertMiliseconds = (p) => {
            let { miliseconds = 0, unit = 'day', pattern } = p || {}
            let type;
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
            if (pattern) {
                return this.pattern([0, 0, day, hour, minute, second, tenthsecond], pattern)
            }
            return { day, hour, minute, second, tenthsecond, miliseconds, type }
        }
        this.getDaysOfMonth = (p) => {
            let {date,pattern} = p || {}; 
            let dateArray = this.convertToArray({ date });
            let firstDay = [dateArray[0], dateArray[1], 1];
            let lastDay = this.getLastDayOfMonth({ date:dateArray })
            let betweenDayes = this.getDatesBetween({ date: firstDay, otherDate: lastDay, step: 24 * 60 * 60 * 1000 });
            let result = [firstDay];
            result = result.concat(betweenDayes);
            result.push(lastDay as number[]);
            if (pattern) {
                return result.map((o) => this.getDateByPattern({ date: o, pattern }))
            }
            return result;
        }
        this.getLastDayOfMonth = (p) => {
            let {date,pattern} = p || {};
            let dateArray = this.convertToArray({ date });
            let length = this.getMonthDaysLength({ date:dateArray });
            let lastDay = [date[0], date[1], length];
            if (pattern) {
                return this.getDateByPattern({ date: lastDay, pattern })
            }
            return lastDay
        }
        this.getDateByPattern = (p) => {
            let { date, pattern, jalali } = p;
            return this.pattern(date, pattern, jalali)
        }
        
        
        
        
        
        
        
        
        
        
        
    }
}
export default function AIODate() {
    let $$ = {
        getToday(obj = {}) {
            let { jalali, pattern } = obj;
            let date = new Date();
            date = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), Math.round(date.getMilliseconds() / 100)]
            if (jalali) { date = $$.toJalali({ date }) }
            if (pattern) { return $$.pattern(date, pattern) }
            return date;
        },
        getByOffset({ date, offset, unit = 'day', jalali }) {
            if (!offset) { return date }
            let fn = $$['get' + (offset > 0 ? 'Next' : 'Prev') + { 'hour': 'Hour', 'day': 'Day', 'month': 'Month', 'year': 'Year' }[unit]];
            let abs = Math.abs(offset);
            for (let i = 0; i < abs; i++) { date = fn(date, jalali); }
            return date;
        },
        getNextYear([year, month]) {
            return [year + 1, month, 1, 0]
        },
        getPrevYear([year, month]) {
            return [year - 1, month, 1, 0]
        },
        getNextHour([year, month, day, hour], jalali) {
            if (hour < 23) { return [year, month, day, hour + 1] }
            let a = $$.getNextDay([year, month, day], jalali);
            return [a[0], a[1], a[2], 0]
        },
        getPrevHour([year, month, day, hour], jalali) {
            if (hour > 0) { return [year, month, day, hour - 1] }
            let a = $$.getPrevDay([year, month, day], jalali);
            return [a[0], a[1], a[2], 23]
        },
        getNextDay([year, month, day, hour]) {
            if (day < $$.getMonthDaysLength({ date: [year, month] })) { return [year, month, day + 1, hour] }
            if (month < 12) { return [year, month + 1, 1, hour] }
            return [year + 1, 1, 1, hour];
        },
        getPrevDay([year, month, day, hour], jalali) {
            if (day > 1) { return [year, month, day - 1] }
            if (month > 1) {
                month -= 1;
                day = $$.getMonthDaysLength({ date: [year, month] });
                return [year, month, day, hour];
            }
            year -= 1;
            month = 12;
            day = $$.getMonthDaysLength({ date: [year, month] });
            return [year, month, day, hour];
        },
        getDayIndex({ date, unit }) {
            date = $$.convertToArray({ date });
            if (unit === 'week') {
                let days = $$.getDaysOfWeek({ date });
                for (let i = 0; i < days.length; i++) {
                    let [year, month, day] = days[i];
                    if (year !== date[0]) { continue }
                    if (month !== date[1]) { continue }
                    if (day !== date[2]) { continue }
                    return i;
                }
            }
            if (unit === 'month') {
                return date[2] - 1;
            }
            if (unit === 'year') {
                let res = 0;
                for (let i = 0; i < date[1] - 1; i++) {
                    res += $$.getMonthDaysLength({ date })
                }
                res += date[1];
                return res - 1
            }
        },
        getNextMonth([year, month, day, hour]) { return month < 12 ? [year, month + 1, day, hour] : [year + 1, 1, 1]; },
        getPrevMonth([year, month, day, hour]) { return month > 1 ? [year, month - 1, day, hour] : [year - 1, 12, 1]; },
        
    }
    return {
        getDaysOfWeek: $$.getDaysOfWeek,
        getDaysOfMonth: $$.getDaysOfMonth,
        getLastDayOfMonth: $$.getLastDayOfMonth,
        getByOffset: $$.getByOffset,
        getDayIndex: $$.getDayIndex,
        toJalali: $$.toJalali,
        toGregorian: $$.toGregorian,
        getTime: $$.getTime,
        getSplitter: $$.getSplitter,
        convertToArray: $$.convertToArray,
        compaire: $$.compaire,
        isEqual: $$.isEqual,
        isGreater: $$.isGreater,
        getDelta: $$.getDelta,
        convertMiliseconds: $$.convertMiliseconds,
        isLess: $$.isLess,
        isBetween: $$.isBetween,
        getMonthDaysLength: $$.getMonthDaysLength,
        getYearDaysLength: $$.getYearDaysLength,
        getWeekDay: $$.getWeekDay,
        getWeekDays: $$.getWeekDays,
        getMonths: $$.getMonths,
        getToday: $$.getToday,
        isMatch: $$.isMatch,
        getNextTime: $$.getNextTime,
        getDatesBetween: $$.getDatesBetween,
        getDateByPattern: $$.getDateByPattern,
        get2Digit: $$.get2Digit
    }
}