"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var AIODate = /** @class */ (function () {
    function AIODate() {
        var _this = this;
        this.toMiliseconds = function (p) {
            var _a = p.day, day = _a === void 0 ? 0 : _a, _b = p.hour, hour = _b === void 0 ? 0 : _b, _c = p.minute, minute = _c === void 0 ? 0 : _c, _d = p.second, second = _d === void 0 ? 0 : _d;
            var res = 0;
            res += day * 24 * 60 * 60 * 1000;
            res += hour * 60 * 60 * 1000;
            res += minute * 60 * 1000;
            res += second * 1000;
            return res;
        };
        this.isMatch = function (date, matchers) {
            date = _this.convertToArray(date);
            for (var i = 0; i < matchers.length; i++) {
                var matcher = matchers[i], type = void 0, targets = void 0;
                try {
                    var a = matcher.split(',');
                    type = a[0];
                    targets = a.slice(1, a.length);
                }
                catch (_a) {
                    return false;
                }
                if (type === '<') {
                    for (var i_1 = 0; i_1 < targets.length; i_1++) {
                        if (_this.isLess(date, targets[i_1])) {
                            return true;
                        }
                    }
                }
                else if (type === '>') {
                    for (var i_2 = 0; i_2 < targets.length; i_2++) {
                        if (_this.isGreater(date, targets[i_2])) {
                            return true;
                        }
                    }
                }
                else if (type === '<=') {
                    for (var i_3 = 0; i_3 < targets.length; i_3++) {
                        if (_this.isEqual(date, targets[i_3])) {
                            return true;
                        }
                        if (_this.isLess(date, targets[i_3])) {
                            return true;
                        }
                    }
                }
                else if (type === '>=') {
                    for (var i_4 = 0; i_4 < targets.length; i_4++) {
                        if (_this.isEqual(date, targets[i_4])) {
                            return true;
                        }
                        if (_this.isGreater(date, targets[i_4])) {
                            return true;
                        }
                    }
                }
                else if (type === '=') {
                    for (var i_5 = 0; i_5 < targets.length; i_5++) {
                        if (_this.isEqual(date, targets[i_5])) {
                            return true;
                        }
                    }
                }
                else if (type === '!=') {
                    for (var i_6 = 0; i_6 < targets.length; i_6++) {
                        if (!_this.isEqual(date, targets[i_6])) {
                            return true;
                        }
                    }
                }
                else if (type === '<>') {
                    if (targets[0] && targets[1]) {
                        var start = void 0, end = void 0;
                        if (_this.isLess(targets[0], targets[1])) {
                            start = targets[0];
                            end = targets[1];
                        }
                        else {
                            start = targets[1];
                            end = targets[0];
                        }
                        if (_this.isGreater(date, start) && _this.isLess(date, end)) {
                            return true;
                        }
                    }
                }
                else if (type === '<=>') {
                    if (targets[0] && targets[1]) {
                        var start = void 0, end = void 0;
                        if (_this.isLess(targets[0], targets[1])) {
                            start = targets[0];
                            end = targets[1];
                        }
                        else {
                            start = targets[1];
                            end = targets[0];
                        }
                        if (_this.isGreater(date, start) && _this.isLess(date, end)) {
                            return true;
                        }
                        if (_this.isEqual(date, start) || _this.isEqual(date, end)) {
                            return true;
                        }
                    }
                }
                else if (type === '!<>') {
                    if (targets[0] && targets[1]) {
                        var start = void 0, end = void 0;
                        if (_this.isLess(targets[0], targets[1])) {
                            start = targets[0];
                            end = targets[1];
                        }
                        else {
                            start = targets[1];
                            end = targets[0];
                        }
                        if (!_this.isGreater(date, start) || !_this.isLess(date, end)) {
                            return true;
                        }
                    }
                }
                else if (type === '!<=>') {
                    if (targets[0] && targets[1]) {
                        var start = void 0, end = void 0;
                        if (_this.isLess(targets[0], targets[1])) {
                            start = targets[0];
                            end = targets[1];
                        }
                        else {
                            start = targets[1];
                            end = targets[0];
                        }
                        if (!_this.isEqual(date, start) && !_this.isEqual(date, end) && (_this.isLess(date, start) || _this.isGreater(date, end))) {
                            return true;
                        }
                    }
                }
                else if (type === 'w') {
                    var w = _this.getWeekDay(date).index;
                    for (var i_7 = 0; i_7 < targets.length; i_7++) {
                        if (w === +targets[i_7]) {
                            return true;
                        }
                    }
                }
                else if (type === '!w') {
                    var w = _this.getWeekDay(date).index;
                    for (var i_8 = 0; i_8 < targets.length; i_8++) {
                        if (w !== +targets[i_8]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        this.convertToArray = function (date, jalali) {
            if (!date) {
                return [];
            }
            var list;
            if (Array.isArray(date)) {
                list = __spreadArray([], date, true);
            }
            else if (typeof date === 'string') {
                if (date.indexOf("T") !== -1) {
                    //"2015-03-25T12:00:00Z"
                    var _a = date.split("T"), d1 = _a[0], t1 = _a[1];
                    var t2 = t1.split(".")[0];
                    var t3 = t2.split(':');
                    var d2 = d1.split('-');
                    list = __spreadArray(__spreadArray(__spreadArray([], d2.map(function (o) { return +o; }), true), t3.map(function (o) { return +o; }), true), [0], false);
                }
                else {
                    list = date.split(_this.getSplitter(date)).map(function (o) { return +o; });
                }
            }
            else if (typeof date === 'number') {
                var d = new Date(date);
                var year = d.getFullYear();
                var month = d.getMonth() + 1;
                var day = d.getDate();
                var hour = d.getHours();
                var minute = d.getMinutes();
                var second = d.getSeconds();
                var miliseconds = d.getMilliseconds();
                var tenthsecond = Math.round(miliseconds / 100);
                list = [year, month, day, hour, minute, second, tenthsecond];
            }
            else if (typeof date === 'object') {
                if (typeof date.getMonth === 'function') {
                    var dateObject = date;
                    var year = dateObject.getFullYear();
                    var month = dateObject.getMonth() + 1;
                    var day = dateObject.getDate();
                    var hour = dateObject.getHours();
                    var minute = dateObject.getMinutes();
                    var second = dateObject.getSeconds();
                    var miliseconds = dateObject.getMilliseconds();
                    var tenthsecond = Math.round(miliseconds / 100);
                    list = [year, month, day, hour, minute, second, tenthsecond];
                }
                else {
                    var today = _this.getToday(jalali);
                    var dateObject = date;
                    return [
                        dateObject.year === undefined ? today[0] : dateObject.year,
                        dateObject.month === undefined ? today[1] : dateObject.month,
                        dateObject.day === undefined ? today[2] : dateObject.day,
                        dateObject.hour === undefined ? today[3] : dateObject.hour,
                        dateObject.minute === undefined ? today[4] : dateObject.minute,
                        dateObject.second === undefined ? today[5] : dateObject.second,
                    ];
                }
            }
            else {
                return [];
            }
            if (jalali) {
                var _b = _this.toJalali([list[0], list[1], list[2]]), year = _b[0], month = _b[1], day = _b[2];
                list[0] = year;
                list[1] = month;
                list[2] = day;
            }
            return list;
        };
        this.compaire = function (o1, o2) {
            o1 = _this.convertToArray(o1);
            o2 = _this.convertToArray(o2);
            var compaireKey = 'equal';
            for (var i = 0; i < o1.length; i++) {
                if (isNaN(o2[i])) {
                    o2[i] = o1[i];
                }
                var a = o1[i];
                var b = o2[i] || 0;
                if (a < b) {
                    compaireKey = 'less';
                    break;
                }
                if (a > b) {
                    compaireKey = 'greater';
                    break;
                }
            }
            return compaireKey;
        };
        this.isLess = function (o1, o2) { return _this.compaire(o1, o2) === 'less'; };
        this.isEqual = function (o1, o2) { return _this.compaire(o1, o2) === 'equal'; };
        this.isGreater = function (o1, o2) { return _this.compaire(o1, o2) === 'greater'; };
        this.isBetween = function (o1, _a) {
            var o2 = _a[0], o3 = _a[1];
            return _this.compaire(o1, o2) === 'greater' && _this.compaire(o1, o2) === 'less';
        };
        this.isToday = function (date) { return _this.isEqual(date, _this.getToday(_this.isJalali(date))); };
        this.getDateByDeltaMiliseconds = function (date, miliseconds) { return _this.convertToArray(_this.getTime(date) + miliseconds); };
        this.getWeekDay = function (date) {
            var dateArray = _this.convertToArray(date);
            var jalali = _this.isJalali(dateArray);
            dateArray = _this.toGregorian(date);
            var index = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]).getDay();
            if (jalali) {
                index += 1;
                index = index % 7;
            }
            return { weekDay: _this.getWeekDays(jalali)[index], index: index };
        };
        this.isJalali = function (date) { return _this.convertToArray(date)[0] < 1700 ? true : false; };
        this.getWeekDays = function (jalali) {
            return [
                ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
                ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
            ][jalali ? 0 : 1];
        };
        this.toGregorian = function (date) {
            if (!date) {
                return [];
            }
            var arr = _this.convertToArray(date);
            var jalali = _this.isJalali(arr);
            if (!jalali) {
                return arr;
            }
            var jy = arr[0], jm = arr[1], jd = arr[2];
            var sal_a, gy, gm, gd, days;
            jy += 1595;
            days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
            gy = 400 * ~~(days / 146097);
            days %= 146097;
            if (days > 36524) {
                gy += 100 * ~~(--days / 36524);
                days %= 36524;
                if (days >= 365)
                    days++;
            }
            gy += 4 * ~~(days / 1461);
            days %= 1461;
            if (days > 365) {
                gy += ~~((days - 1) / 365);
                days = (days - 1) % 365;
            }
            gd = days + 1;
            sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++)
                gd -= sal_a[gm];
            arr[0] = gy;
            arr[1] = gm;
            arr[2] = gd;
            return arr;
        };
        this.pattern = function (date, pattern, jalali) {
            if (jalali === void 0) { jalali = _this.isJalali(date); }
            date = _this.convertToArray(date, jalali);
            var year = date[0], month = date[1], day = date[2], hour = date[3], minute = date[4], second = date[5], tenthsecond = date[6];
            pattern = pattern.replace('{year}', year.toString());
            if (typeof month === 'number') {
                pattern = pattern.replace('{month}', _this.get2Digit(month));
            }
            if (typeof day === 'number') {
                pattern = pattern.replace('{day}', _this.get2Digit(day));
            }
            if (typeof hour === 'number') {
                pattern = pattern.replace('{hour}', _this.get2Digit(hour));
            }
            if (typeof minute === 'number') {
                pattern = pattern.replace('{minute}', _this.get2Digit(minute));
            }
            if (typeof second === 'number') {
                pattern = pattern.replace('{second}', _this.get2Digit(second));
            }
            if (typeof tenthsecond === 'number') {
                pattern = pattern.replace('{tenthsecond}', _this.get2Digit(tenthsecond));
            }
            if (pattern.indexOf('{monthString}') !== -1) {
                pattern = pattern.replace('{monthString}', _this.getMonths(jalali)[month - 1]);
            }
            if (pattern.indexOf('{weekDay}') !== -1) {
                var weekDays = _this.getWeekDays(jalali);
                var index = _this.getWeekDay(date).index;
                pattern = pattern.replace('{weekDay}', weekDays[index]);
            }
            return pattern;
        };
        this.get2Digit = function (n) {
            var ns;
            try {
                ns = n.toString();
            }
            catch (_a) {
                return n.toString();
            }
            if (ns.length === 1) {
                ns = '0' + n;
            }
            return ns;
        };
        this.getMonths = function (jalali) {
            return [
                ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',],
                ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
            ][jalali ? 0 : 1];
        };
        this.toJalali = function (date) {
            var arr = _this.convertToArray(date);
            var jalali = _this.isJalali(arr);
            if (jalali) {
                return arr;
            }
            var gy = arr[0], gm = arr[1], gd = arr[2];
            var g_d_m, jy, jm, jd, gy2, days;
            g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
            gy2 = (gm > 2) ? (gy + 1) : gy;
            days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
            jy = -1595 + (33 * ~~(days / 12053));
            days %= 12053;
            jy += 4 * ~~(days / 1461);
            days %= 1461;
            if (days > 365) {
                jy += ~~((days - 1) / 365);
                days = (days - 1) % 365;
            }
            if (days < 186) {
                jm = 1 + ~~(days / 31);
                jd = 1 + (days % 31);
            }
            else {
                jm = 7 + ~~((days - 186) / 30);
                jd = 1 + ((days - 186) % 30);
            }
            arr[0] = jy;
            arr[1] = jm;
            arr[2] = jd;
            return arr;
        };
        this.getSplitter = function (value) {
            var splitter = '/';
            for (var i = 0; i < value.length; i++) {
                if (isNaN(parseInt(value[i]))) {
                    return value[i];
                }
            }
            return splitter;
        };
        this.getTime = function (date, jalali) {
            if (jalali === void 0) { jalali = _this.isJalali(date); }
            if (!date) {
                return 0;
            }
            if (typeof date === 'number') {
                return date;
            }
            date = _this.convertToArray(date);
            var year = date[0], _a = date[1], month = _a === void 0 ? 1 : _a, _b = date[2], day = _b === void 0 ? 1 : _b, _c = date[3], hour = _c === void 0 ? 0 : _c, _d = date[4], minute = _d === void 0 ? 0 : _d, _e = date[5], second = _e === void 0 ? 0 : _e, _f = date[6], tenthsecond = _f === void 0 ? 0 : _f;
            if (jalali) {
                date = _this.toGregorian([year, month, day, hour, minute, second, tenthsecond]);
            }
            var time = new Date(date[0], date[1] - 1, date[2]).getTime();
            time += hour * 60 * 60 * 1000;
            time += minute * 60 * 1000;
            time += second * 1000;
            time += tenthsecond * 100;
            return time;
        };
        this.getNextTime = function (date, offset, jalali) {
            if (jalali === void 0) { jalali = _this.isJalali(date); }
            if (!offset) {
                return _this.convertToArray(date);
            }
            var time = _this.getTime(date, jalali);
            time += offset;
            var dateArray = _this.convertToArray(time);
            if (jalali) {
                var _a = _this.toJalali(dateArray), jy = _a[0], jm = _a[1], jd = _a[2];
                dateArray[0] = jy;
                dateArray[1] = jm;
                dateArray[2] = jd;
            }
            return dateArray;
        };
        this.getMonthDaysLength = function (date) {
            if (!date) {
                return 0;
            }
            var _a = _this.convertToArray(date), year = _a[0], month = _a[1];
            var jalali = _this.isJalali([year, month]);
            if (jalali) {
                return [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, [1, 5, 9, 13, 17, 22, 26, 30].indexOf(year % 33) === -1 ? 29 : 30][month - 1];
            }
            else {
                return new Date(year, month - 1, 0).getDate();
            }
        };
        this.getYearDaysLength = function (date) {
            if (!date) {
                return 0;
            }
            var year = _this.convertToArray(date)[0];
            var res = 0;
            for (var i = 1; i <= 12; i++) {
                res += _this.getMonthDaysLength([year, i]);
            }
            return res;
        };
        this.getYesterday = function (date) {
            var _a = _this.convertToArray(date), year = _a[0], month = _a[1], day = _a[2];
            var newYear = year, newMonth = month, newDay = day;
            if (day === 1) {
                if (month === 1) {
                    newYear = newYear - 1;
                    newMonth = 12;
                    newDay = _this.getMonthDaysLength([newYear, newMonth]);
                }
                else {
                    newMonth = newMonth - 1;
                    newDay = _this.getMonthDaysLength([newYear, newMonth]);
                }
            }
            else {
                newDay = newDay - 1;
            }
            return [newYear, newMonth, newDay];
        };
        this.getTomarrow = function (date) {
            var _a = _this.convertToArray(date), year = _a[0], month = _a[1], day = _a[2];
            var newYear = year, newMonth = month, newDay = day;
            var daysLength = _this.getMonthDaysLength(date);
            if (day === daysLength) {
                if (month === 12) {
                    newYear = newYear + 1;
                    newMonth = 1;
                    newDay = 1;
                }
                else {
                    newMonth = newMonth + 1;
                    newDay = 1;
                }
            }
            else {
                newDay = newDay + 1;
            }
            return [newYear, newMonth, newDay];
        };
        this.getDaysOfWeek = function (date, pattern) {
            if (!date) {
                return [];
            }
            var dateArray = _this.convertToArray(date);
            var index = _this.getWeekDay(dateArray).index;
            var firstDay = __spreadArray([], dateArray, true);
            for (var i = 0; i < index; i++) {
                firstDay = _this.getYesterday(firstDay);
            }
            var res = [];
            for (var i = 0; i < 7; i++) {
                res.push(firstDay);
                firstDay = _this.getTomarrow(firstDay);
            }
            if (pattern) {
                return res.map(function (o) { return _this.getDateByPattern(o, pattern); });
            }
            return res;
        };
        this.getDatesBetween = function (date, otherDate, step) {
            if (step === void 0) { step = 24 * 60 * 60 * 1000; }
            if (!date || !otherDate) {
                return [];
            }
            date = _this.convertToArray(date);
            otherDate = _this.convertToArray(otherDate);
            if (!_this.isGreater(otherDate, date)) {
                return [];
            }
            var delta = _this.getDelta(date, otherDate);
            var length = delta.miliseconds / step;
            if (isNaN(length) || length > 1000) {
                console.error('AIODate().getDatesBetween() => too many dates');
                return [];
            }
            var nextDate = _this.getNextTime(date, step);
            var res = [];
            while (_this.isLess(nextDate, otherDate)) {
                res.push(nextDate);
                nextDate = _this.getNextTime(nextDate, step);
            }
            return res;
        };
        this.getDelta = function (date, otherDate, unit) {
            var dif = _this.getTime(date) - _this.getTime(otherDate || _this.getToday());
            return _this.convertMiliseconds(-dif, unit);
        };
        this.convertMiliseconds = function (miliseconds, unit) {
            if (miliseconds === void 0) { miliseconds = 0; }
            if (unit === void 0) { unit = 'day'; }
            var type;
            if (miliseconds < 0) {
                type = 'passed';
                miliseconds = -miliseconds;
            }
            else if (miliseconds > 0) {
                type = 'remaining';
            }
            else {
                type = 'now';
            }
            var index = ['day', 'hour', 'minute', 'second', 'tenthsecond', 'milisecond'].indexOf(unit);
            var day = 0, hour = 0, minute = 0, second = 0, tenthsecond = 0;
            var dif = miliseconds;
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
            return { day: day, hour: hour, minute: minute, second: second, tenthsecond: tenthsecond, miliseconds: miliseconds, type: type };
        };
        this.getDaysOfMonth = function (date, pattern) {
            if (!date) {
                return [];
            }
            var dateArray = _this.convertToArray(date);
            var daysLength = _this.getMonthDaysLength(date);
            var firstDay = [dateArray[0], dateArray[1], 1];
            var res = [];
            for (var i = 0; i < daysLength; i++) {
                res.push(firstDay);
                firstDay = _this.getTomarrow(firstDay);
            }
            if (pattern) {
                return res.map(function (o) { return _this.getDateByPattern(o, pattern); });
            }
            return res;
        };
        this.getLastDayOfMonth = function (date) {
            var dateArray = _this.convertToArray(date);
            var length = _this.getMonthDaysLength(dateArray);
            var lastDay = [dateArray[0], dateArray[1], length];
            return lastDay;
        };
        this.getDateByPattern = function (date, pattern) { return _this.pattern(date, pattern); };
        this.getToday = function (jalali) {
            var date = new Date();
            var dateArray = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), Math.round(date.getMilliseconds() / 100)];
            if (jalali) {
                dateArray = _this.toJalali(dateArray);
            }
            return dateArray;
        };
        this.getDayIndex = function (date, unit) {
            date = _this.convertToArray(date);
            if (unit === 'week') {
                var days = _this.getDaysOfWeek(date);
                for (var i = 0; i < days.length; i++) {
                    var _a = days[i], year = _a[0], month = _a[1], day = _a[2];
                    if (year !== date[0]) {
                        continue;
                    }
                    if (month !== date[1]) {
                        continue;
                    }
                    if (day !== date[2]) {
                        continue;
                    }
                    return i;
                }
            }
            if (unit === 'month') {
                return date[2] - 1;
            }
            if (unit === 'year') {
                var res = 0;
                for (var i = 0; i < date[1] - 1; i++) {
                    res += _this.getMonthDaysLength(date);
                }
                res += date[1];
                return res - 1;
            }
            return 0;
        };
    }
    return AIODate;
}());
exports.default = AIODate;
