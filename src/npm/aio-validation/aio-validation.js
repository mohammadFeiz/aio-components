export default function AIOValidation(props) {
    let dateCalc = DateCalculator();
    let $$ = {
      translate(text){
        if(!text){return text}
        let {lang} = props;
        let dict = {
          'should be contain':'باید شامل',
          'should be before':'باید قبل از',
          'cannot be after':'نمی تواند بعد از',
          'should be after':'باید بعد از',
          'cannot be before':'نمی تواند قبل از',
          'should not be contain':'نمی تواند شامل',
          'should be less than':'باید کمتر از',
          'should be more than':'باید بیشتر از',
          'could not be more than':'نباید بزرگ تر از',
          'could not be less than':'نباید کوچک تر از',
          'character(s)':'کاراکتر',
          'item(s)':'مورد',
          'should be equal':'باید برابر',
          'cannot be equal':'نمی تواند برابر'
        }
        return lang === 'fa'?dict[text]:text
      },
      getMessage(target,{be,validation,unit = ''}){
        if(validation.message){return validation.message}
        let {targetPresentation = JSON.stringify(target),title = props.title} = validation;
        return `${title} ${this.translate(be)} ${targetPresentation} ${unit}` + (props.lang === 'fa'?' باشد':'')
      },
      contain(target,validation,value){
        let config = {be:'should be contain',validation};
        if(target === 'number'){
          if(!/\d/.test(value)){return this.getMessage('number',config)}
        }
        else if(target === 'letter'){
          if(!/[a-zA-Z]/.test(value)){return this.getMessage('letter',config)}  
        }  
        else if(target === 'uppercase'){
          if(!/[A-Z]/.test(value)){return this.getMessage('uppercase',config)}
        }    
        else if(target === 'lowercase'){
          if(!/[a-z]/.test(value)){return this.getMessage('lowercase',config)}
        }  
        else if(target === 'symbol'){
          if(!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)){
            return this.getMessage('symbol',config)
          }
        }
        else if(typeof target.test === 'function'){
          if(!target.test(value)){return this.getMessage(target.toString(),config)}  
        }
        else{
          if(value.indexOf(target) === -1 && target !== undefined){return this.getMessage(target,config)}
        }
      },
      notContain(target,validation,value){
        let config = {be:'should not be contain',validation};
        if(target === 'number'){
          if(/\d/.test(value)){return this.getMessage('number',config)}
        }    
        else if(target === 'letter'){
          if(/[a-zA-Z]/.test(value)){return this.getMessage('letter',config)}  
        }  
        else if(target === 'uppercase'){
          if(/[A-Z]/.test(value)){return this.getMessage('uppercase',config)}
        }    
        else if(target === 'lowercase'){
          if(/[a-z]/.test(value)){return this.getMessage('lowercase',config)}
        }
        else if(target === 'symbol'){
          if(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)){
            return this.getMessage('symbol',config)
          }
        }
        else if(typeof target.test === 'function'){
          if(target.test(value)){return this.getMessage(target.toString(),config)}  
        }    
        else {
          if(value.indexOf(target) !== -1){return this.getMessage(target,config)}
        }
      },
      length(target,validation,value,unit){
        if(value.length !== target){return this.getMessage(target,{validation,be:'should be contain',unit})}
      },
      notLength(target,validation,value,unit){
        if(value.length === target){return this.getMessage(target,{validation,be:'should not be contain',unit})}
      },
      lengthLess(target,validation,value,unit){
        if(value.length >= target){return this.getMessage(target,{validation,be:'should be less than',unit})}
      },
      lengthLessEqual(target,validation,value,unit){
        if(value.length > target){return this.getMessage(target,{validation,be:'could not be more than',unit})}
      },
      lengthMore(target,validation,value,unit){
        if(value.length <= target){return this.getMessage(target,{validation,be:'should be more than',unit})}
      },
      lengthMoreEqual(target,validation,value,unit){
        if(value.length < target){return this.getMessage(target,{validation,be:'could not be less than',unit})}
      },
      equal(target,validation,value){
        if(JSON.stringify(value) !== JSON.stringify(target)){
          return this.getMessage(target,{validation,be:'should be equal'})
        }
      },
      not(target,validation,value){
        if(JSON.stringify(value) === JSON.stringify(target)){
          return this.getMessage(target,{validation,be:'cannot be equal'})
        }
      },
      dateLess(target,validation,value){
        if(dateCalc.isGreater(value,target) || dateCalc.isEqual(value,target)){
          return this.getMessage(target,{validation,be:'should be before'})
        }
      },
      dateLessEqual(target,validation,value){
        if(dateCalc.isGreater(value,target)){
          return this.getMessage(target,{validation,be:'cannot be after'})
        }
      },
      dateMore(target,validation,value){
        if(dateCalc.isLess(value,target) || dateCalc.isEqual(value,target)){
          return this.getMessage(target,{validation,be:'should be after'})
        }
      },
      dateMoreEqual(target,validation,value){
        if(dateCalc.isLess(value,target)){
          return this.getMessage(target,{validation,be:'cannot be before'})
        }
      },
      less(target,validation,value){
        if(value >= target){
          return this.getMessage(target,{validation,be:'should be less than'})
        }
      },
      lessEqual(target,validation,value){
        if(value > target){
          return this.getMessage(target,{validation,be:'could not be more than'})
        }
      },
      more(target,validation,value){
        if(value <= target){
          return this.getMessage(target,{validation,be:'should be more than'})
        }
      },
      moreEqual(target,validation,value){
        if(value < target){
          return this.getMessage(target,{validation,be:'could not be less than'})
        }
      },
      getResult(fn,target,validation,value,unit){
        target = Array.isArray(target)?target:[target];
        for(let i = 0; i < target.length; i++){
          let result = this[fn](target[i],validation,value,unit)
          if(result){return result}
        }
      },
      getValidation(){
        let {lang = 'en',value,validations = []} = props; 
        let unit = '';
        if(Array.isArray(value)){unit = this.translate('item(s)')}
        else if(typeof value === 'string'){unit = this.translate('character(s)')}
        for(let i = 0; i < validations.length; i++){
          let [type,target,params = {}] = validations[i];
          let result;
          if(type === 'function'){
            result = target(value);
          }
          else if(type === 'required'){
            if(value === undefined || value === '' || value === false || value.length === 0){
              let {title = props.title} = params;
              if(lang === 'en'){return `${title} is required`}
              if(lang === 'fa'){return `وارد کردن ${title} ضروری است`}
            }
          }
          else if(type === 'contain'){result = this.getResult('contain',target,validations[i],value)}
          else if(type === '!contain'){result = this.getResult('notContain',target,validations[i],value)}
          else if(type === 'length'){result = this.getResult('length',target,validations[i],value,unit)}
          else if(type === '!length'){result = this.getResult('notLength',target,validations[i],value,unit)}
          else if(type === 'length<'){result = this.getResult('lengthLess',target,validations[i],value,unit)}
          else if(type === 'length<='){result = this.getResult('lengthLessEqual',target,validations[i],value,unit)}
          else if(type === 'length>'){result = this.getResult('lengthMore',target,validations[i],value,unit)}
          else if(type === 'length>='){result = this.getResult('lengthMoreEqual',target,validations[i],value,unit)}
          else if(type === '='){result = this.getResult('equal',target,validations[i],value)}
          else if(type === '!='){result = this.getResult('not',target,validations[i],value)}
          else if(type === '<'){result = this.getResult('less',target,validations[i],value)}
          else if(type === '<='){result = this.getResult('lessEqual',target,validations[i],value)}
          else if(type === '>'){result = this.getResult('more',target,validations[i],value)}
          else if(type === '>='){result = this.getResult('moreEqual',target,validations[i],value)}
          else if(type === 'date<'){result = this.getResult('dateLess',target,validations[i],value)}
          else if(type === 'date<='){result = this.getResult('dateLessEqual',target,validations[i],value)}
          else if(type === 'date>'){result = this.getResult('dateMore',target,validations[i],value)}
          else if(type === 'date>='){result = this.getResult('dateMoreEqual',target,validations[i],value)}
          if(result){return result}
        }
        return ''
      }
    }
    props.translate = props.translate || function (text){
      return text
    }
    props.lang = props.lang || 'en';
    let validation;
    try{validation = $$.getValidation()}
    catch{validation = ''}
    return validation; 
  }
  function DateCalculator(){
    let $$ = {
      getSplitter(value){
        let splitter = '/';
        for(let i = 0; i < value.length; i++){
          if(isNaN(parseInt(value[i]))){return value[i]}
        }
        return splitter;
      },
      convertToArray(o,setDefault = true){
        let list;
        if(Array.isArray(o)){list = [...o]}
        else if(typeof o === 'string'){
          list = o.split($$.getSplitter(o));
          list = list.map((o)=>parseInt(o))
        }
        else{return false}
        if(setDefault){
          let [y,m = 1,d = 1,h = 0] = list;
          return [y,m,d,h];
        }
        else {
          return list;
        }
      },
      gregorianToJalali(o) {
        let [gy, gm, gd] = $$.convertToArray(o);
        var g_d_m, jy, jm, jd, gy2, days;
        g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        gy2 = (gm > 2) ? (gy + 1) : gy;
        days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
        jy = -1595 + (33 * ~~(days / 12053));days %= 12053;jy += 4 * ~~(days / 1461);days %= 1461;
        if (days > 365) {jy += ~~((days - 1) / 365);days = (days - 1) % 365;}
        if (days < 186) {jm = 1 + ~~(days / 31);jd = 1 + (days % 31);} else {jm = 7 + ~~((days - 186) / 30);jd = 1 + ((days - 186) % 30);}
        return [jy, jm, jd];
      },
      jalaliToGregorian(o) {
        let [jy, jm, jd] = $$.convertToArray(o);
        var sal_a, gy, gm, gd, days;
        jy += 1595;days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
        gy = 400 * ~~(days / 146097);days %= 146097;
        if (days > 36524) {gy += 100 * ~~(--days / 36524);days %= 36524;if (days >= 365) days++;}
        gy += 4 * ~~(days / 1461);days %= 1461;
        if (days > 365) {gy += ~~((days - 1) / 365);days = (days - 1) % 365;}
        gd = days + 1;
        sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
        return [gy, gm, gd];
      },
      compaireDate([year1,month1,day1,hour1],[year2,month2,day2,hour2]){
        if(year1 < year2){return 'less'}
        if(year1 > year2){return 'greater'}
        if(month1 < month2){return 'less'}
        if(month1 > month2){return 'greater'}
        if(day1 < day2){return 'less'}
        if(day1 > day2){return 'greater'}
        if(hour1 < hour2){return 'less'}
        if(hour1 > hour2){return 'greater'}
        return 'equal';
      },
      isLess(o1,o2){
        if(!o1 || !o2){return false}
        o1 = $$.convertToArray(o1);
        o2 = $$.convertToArray(o2,false);
        for(let i = 0; i < o1.length; i++){
          if(o2[i] === undefined){o2[i] = o1[i]}
        }
        return $$.compaireDate(o1,o2) === 'less'
      },
      isEqual(o1,o2){
        if(!o1 || !o2){return false}
        o1 = $$.convertToArray(o1);
        o2 = $$.convertToArray(o2,false);
        for(let i = 0; i < o1.length; i++){
          if(o2[i] === undefined){o2[i] = o1[i]}
        }
        return $$.compaireDate(o1,o2) === 'equal'
      },
      isGreater(o1,o2){
        if(!o1 || !o2){return false}
        o1 = $$.convertToArray(o1);
        o2 = $$.convertToArray(o2,false);
        for(let i = 0; i < o1.length; i++){
          if(o2[i] === undefined){o2[i] = o1[i]}
        }
        return $$.compaireDate(o1,o2) === 'greater'
      },
      isBetween(o1,[o2,o3]){
        if(!o1 || !o2 || !o3){return false}
        o1 = $$.convertToArray(o1);
        o2 = $$.convertToArray(o2,false);
        o3 = $$.convertToArray(o3,false);
        for(let i = 0; i < o1.length; i++){
          if(o2[i] === undefined){o2[i] = o1[i]}
          if(o3[i] === undefined){o3[i] = o1[i]}
        }
        return $$.compaireDate(o1,o2) === 'greater' && $$.compaireDate(o1,o3) === 'less'
      },
      getByOffset({date,offset,unit = 'day',calendarType = 'gregorian'}){
        if(!offset){return date}
        let fn = $$['get' + (Math.sign(offset)>0?'Next':'Prev') + {'hour':'Hour','day':'Day','month':'Month'}[unit]];
        let abs = Math.abs(offset);
        for(let i = 0; i < abs; i++){date = fn(date,calendarType);}
        return date;
      },
      getNextHour([year,month,day,hour],calendarType){
        if(hour < 23){return [year,month,day,hour + 1]}
        let a = $$.getNextDay([year,month,day],calendarType);
        return [a[0],a[1],a[2],0] 
      },
      getPrevHour([year,month,day,hour],calendarType){
        if(hour > 0){return [year,month,day,hour - 1]}
        let a = $$.getPrevDay([year,month,day],calendarType);
        return [a[0],a[1],a[2],23] 
      },
      getNextDay([year,month,day,hour],calendarType){
        if(day < $$.getMonthDaysLength(year,month,calendarType)){return [year,month,day + 1,hour]}
        if(month < 12){return [year,month + 1,1,hour]}
        return [year + 1,1,1,hour];
      },
      getPrevDay([year,month,day],calendarType){
        if(day > 1){return [year,month,day - 1]}
        if(month > 1){
          month -= 1;
          day = $$.getMonthDaysLength(year,month,calendarType);
          return [year,month,day];
        }
        year -= 1;
        month = 12;
        day = $$.getMonthDaysLength(year,month,calendarType);
        return [year,month,day];
      },
      getNextMonth([year,month]){return month < 12?[year,month + 1,1]:[year + 1,1,1];},
      getPrevMonth([year,month]){return month > 1?[year,month - 1,1]:[year - 1,12,1];},
      GetMonthDaysLength:{
        jalali:(year,month)=>{
          if(month <= 6){return  31;}
          if(month <= 11){return 30;}
          if([1,5,9,13,17,22,26,30].indexOf(year % 33) === -1){return 29;}
          return 30;
        },
        gregorian:(year,month)=>{return new Date(year, month, 0).getDate();}
      },
      getMonthDaysLength(year,month,calendarType){return $$.GetMonthDaysLength[calendarType](year,month)},
      GetWeekDay:{
        jalali:([year,month,day])=>{
          var offset;
          var weekDays = $$.getWeekDays('jalali');
          if($$.isEqual([year,month,day],[1399,12,30])){offset = 0;}
          else if($$.isLess([year,month,day],[1399,12,30])){
            offset = (-$$.getDaysBetween([year,month,day],[1399,12,30]) - 1) % 7;
            if(offset < 0){offset += 7}
          }
          else{offset = ($$.getDaysBetween([1399,12,30],[year,month,day]) + 1) % 7;}
          return {weekDay:weekDays[offset],index:offset};
        },
        gregorian:([year,month,day])=>{
          var offset = new Date(year,month - 1,day).getDay();
          var weekDays = $$.getWeekDays('gregorian');
          return {weekDay:weekDays[offset],index:offset};
        }
      },
      getWeekDay(date,calendarType = 'gregorian'){return $$.GetWeekDay[calendarType](date)},
      getWeekDays(calendarType){
        return {
          jalali:['شنبه','یکشنبه','دوشنبه','سه شنبه','چهارشنبه','پنجشنبه','جمعه'],
          gregorian:['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']
        }[calendarType]
      },
      getMonths(calendarType){
        return {
          jalali:['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند',],
          gregorian:['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER']
        }[calendarType]
      },
      getDaysBetween(start,end){
        if(end[0] - start[0] === 0){return Math.max($$.getDayIndexInYear(end) - $$.getDayIndexInYear(start) - 1,0);}
        var result = 0;
        if(end[0] - start[0] > 1){
          var leaps = $$.getLeapBetweenYears(start[0],end[0]);
          var notLeaps = Math.max(end[0] - start[0] - 1 - leaps,0);
          result = leaps * 366 + notLeaps * 365;
        }
        result += $$.getDayIndexInYear(end) - 1;
        result += ([1,5,9,13,17,22,26,30].indexOf(start[0] % 33) !== -1?366:365) - $$.getDayIndexInYear(start);
        return result;
      },
      getDayIndexInYear([year,month,day]){
        let index = 0;
        for(let i = 1; i < month; i++){index += i <= 6 ? 31 : 30;}
        return index + day;
      },
      getLeapBetweenYears(start,end){
        var count = 0;
        start++;
        while(start < end){
          if([1,5,9,13,17,22,26,30].indexOf(start % 33) !== -1){count++;}
          start++;
        }
        return count;
      },
      GetToday:{
        jalali:(unit)=>{
          let dateObject = new Date();
          var date = dateObject.toLocaleDateString('fa-IR').split('/');
          var dic = {'۰':0,'۱':1,'۲':2,'۳':3,'۴':4,'۵':5,'۶':6,'۷':7,'۸':8,'۹':9};
          for(var j = 0; j < date.length; j++){
            var str = '';
            for(var i = 0; i < date[j].length; i++){str+= dic[date[j][i]]; }
            date[j] = Number(str);
          }   
          date.push(dateObject.getHours());
          if(unit === 'day'){date[3] = 0;}
          if(unit === 'month'){date[2] = 1; date[3] = 0;}
          return date;
        },
        gregorian:(unit)=>{
          var date = new Date();
          var result = [date.getFullYear(),date.getMonth() + 1,date.getDate(),date.getHours()]
          if(unit === 'day'){date[3] = 0;}
          if(unit === 'month'){date[2] = 1; date[3] = 0;}
          return result;
        }
      },
      getToday(calendarType,unit = 'day'){return $$.GetToday[calendarType](unit)},
      
    }
    return {
      gregorianToJalali:$$.gregorianToJalali,
      jalaliToGregorian:$$.jalaliToGregorian,
      getSplitter:$$.getSplitter,
      convertToArray:$$.convertToArray,
      isEqual:$$.isEqual,
      isGreater:$$.isGreater,
      isLess:$$.isLess,
      isBetween:$$.isBetween,
      getByOffset:$$.getByOffset,
      getMonthDaysLength:$$.getMonthDaysLength,
      getWeekDay:$$.getWeekDay,
      getWeekDays:$$.getWeekDays,
      getMonths:$$.getMonths,
      getToday:$$.getToday
    }
  }