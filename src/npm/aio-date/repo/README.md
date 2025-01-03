# aio-date
## all calculations of dates (gregorian and jalali)

### instalation
```javascript
npm install aio-date
```

### use
```javascript
import AIODate from 'aio-date';
```
### date property of all functions can be:
- #### string 
    - `'2022/4/5'` (year is 2022 month is 4 day is 5)
    - `'2022/4/5/12/30'` (year is 2022 month is 4 day is 5 hour is 12 minute is 30)
- #### array
    - `[2022,4,5]` (year is 2022 month is 4 day is 5)
    - `[2022,4,5,12,30]` (year is 2022 month is 4 day is 5 hour is 12 minute is 30)
- #### iso date
    - `'2015-03-25T12:00:00Z'`
- #### miliseconds date
    - `16765675665656`

### for use AIODate class
``` javascript
import AIODate from 'aio-date';
const aioDateInstance = new AIODate()
```
## toJalali

#### type:
```javascript
(date:number | string | number[])=>number[]
```

#### Example:
```javascript
let result = aioDateInstance.toJalali('2022/4/4');
//result is [1401,1,15]
```

## toGregorian
#### type:
```javascript
(date:number | string | number[])=>number[]
```
#### Example:

``` javascript
let result = aioDateInstance.toGregorian('1400/2/2');
//result is [2021,4,22] 
```

## getToday

#### type:
```javascript
(jalali?:boolean)=>number[]
```

#### Gregorian Example
``` javascript
let gregorianToday = aioDateInstance.getToday();
//result is [2023,3,12,20,26,57,9]
```
#### Jalali Example
``` javascript
let jalaliToday = AIODate().getToday(true);
//result is [1401,12,21,20,26,57,9]
```

## getWeekDay

#### type:
```javascript
(date:string | number | number[])=>{weekDay:string,index:number}
```

#### Gregorian Example
``` javascript
let {weekDay,index} = aioDateInstance.getWeekDay('2023/6/6');
//weekday is TUESDAY
//index is 2
```

#### Jalali Example
``` javascript
let {weekDay,index} = aioDateInstance.getWeekDay('1401/5/7');
//weekday is جمعه
//index is 6
```

## getDateByPattern

#### type:
```javascript
(date: string | num,ber | number[], pattern: string) => string
```
#### Example:
``` javascript
let result = aioDateInstance.getDateByPattern('2023/4/5','{year}/{month}/{day} {weekDay}');
//result is '2023/4/5 WEDNESDAY'
```

``` javascript
let result = aioDateInstance.getDateByPattern('2023/4/5','{day} {monthString} {year} {weekDay}');
//result is '5 APRIL 2023 WEDNESDAY'
```

``` javascript
let result = aioDateInstance.getDateByPattern('2023/4/5/10/30','{year}/{month}/{day} {hour}:{minute}');
//result is '2023/4/5 10:30'
```

``` javascript
let result = aioDateInstance.getDateByPattern([2023,4,5,10,30],'{year}/{month}/{day} {hour}:{minute}');
//result is '2023/4/5 10:30'
```

## convertToArray
#### type:
``` javascript
(date: string | number | number[], jalali?: boolean) => number[]
```
#### Example:
```javascript
let result = aioDateInstance.convertToArray('2022/4/4');
//result is [2022,4,4]
```
``` javascript
let result = aioDateInstance.convertToArray(1432445566787);
//result is [2015,5,24,10,2,46,8]
```

## getTime
#### type:
```javascript
(date: string | number | number[], jalali?: boolean) => number
```
#### Example:
```javascript
let result = aioDateInstance.getTime('2022/4/5');
//result is 1649100600000
```
```javascript
let result = aioDateInstance.getTime('2022/4/5/10/30');
//result is 1649138400000
```
```javascript
let result = aioDateInstance.getTime([2022,4,5,10,30]);
//result is 1649138400000
```

```javascript
let result = aioDateInstance.getTime('2015-03-25T12:00:00Z');
//result is 1427268600000
```
```javascript
let result = aioDateInstance.getTime(1755555656665);
//result is 1755555656665
```
```javascript
let result = aioDateInstance.getTime('1402/3/3');
//result is 1684873800000
```

## compaire

#### type:
```javascript
(date1: string | number | number[], date2: string | number | number[]) => 'less' | 'greater' | 'equal'
```

#### Example:
```javascript
let result = aioDateInstance.compaire('2022/4/4','2022/7/10');       
//result is 'less'
```

```javascript
let result = aioDateInstance.compaire('2022/4/4','2022/2/10')       
//result is 'greater'
```
                    
```javascript
let result = aioDateInstance.compaire('2022/4/4','2022/4/4')       
//result is 'equal'
```

```javascript
let result = aioDateInstance.compaire('2022/4/4',1700000000000)       
//result is 'less'
```

```javascript
let result = aioDateInstance.compaire('2022/4/4',[2022,2,10])       
//result is 'greater'
```

## getMonthDaysLength

#### type:
```javascript
(date: string | number | number[]) => number
```

### Example:
```javascript
let result = aioDateInstance.getMonthDaysLength('2022/4');
//result is 30
```

```javascript
let result = aioDateInstance.getMonthDaysLength('2022/7/5');
//result is 31
```

```javascript
let result = aioDateInstance.getMonthDaysLength('1400/12');
//result is 29
```

```javascript
let result = aioDateInstance.getMonthDaysLength('1399/12');
//result is 30
```

## getDelta

#### type:
```javascript
(date: string | number | number[], otherDate: string | number | number[], unit?: 'day' | 'hour' | 'minute' | 'second' | 'tenthsecond' | 'milisecond') => {
    day: number,
    hour: number,
    minute: number,
    second: number,
    tenthsecond: number,
    milisecond: number,
    type: 'remaining' | 'passed' | 'now'
}
```

#### Example:

```javascript
let result = aioDateInstance.getDelta('2023/4/5',new Date().getTime());
//result is 
//{
//  "day": 23,
//  "hour": 3,
//  "minute": 10,
//  "second": 57,
//  "tenthsecond": 9,
//  "type": "remaining"
//}
```
```javascript
let result = aioDateInstance.getDelta(new Date().getTime() + 23000,new Date().getTime());
//result is 
//{
//   "day": 0,
//   "hour": 0,
//   "minute": 0,
//   "second": 23,
//   "tenthsecond": 0,
//   "type": "remaining"
//}
```
```javascript
let result = aioDateInstance.getDelta(date:new Date().getTime() - 23000,new Date().getTime());
//result is 
//{
//   "day": 0,
//   "hour": 0,
//   "minute": 0,
//   "second": 23,
//   "tenthsecond": 0,
//   "type": "passed"
//}
```
```javascript
let res = aioDateInstance.getDelta('1401/12/12',new Date().getTime());
//res is 
//{
//   "day": 9,
//   "hour": 20,
//   "minute": 49,
//   "second": 2,
//   "tenthsecond": 0,
//   "type": "passed"
//}
```

## getNextTime
#### type:
```javascript
(date: string | number | number[], offset: number, jalali?: boolean) => number[]
```

#### Example:
```javascript
let result = AIODate().getNextTime('1400/2/2/22/30',1.5 * 60 * 60 * 1000);
```

## getDatesBetween
#### type:
```javascript
(date: stirng | number | number[], otherDate: stirng | number | number[], step?: number) => any[]
```
#### Example:
```javascript
let result = AIODate().getdatesBetween('2022/4/4','2022/7/10',48 * 60 * 60 * 1000);       
//result is [
//  "6 APRIL 2022",
//  "8 APRIL 2022",
//  "10 APRIL 2022",
//  "12 APRIL 2022",
//  "14 APRIL 2022",
//  "16 APRIL 2022",
//  "18 APRIL 2022",
//  "20 APRIL 2022",
//  "22 APRIL 2022",
//  "24 APRIL 2022",
//  "26 APRIL 2022",
//  "28 APRIL 2022",
//  "30 APRIL 2022",
//  "2 MAY 2022",
//  "4 MAY 2022",
//  "6 MAY 2022",
//  "8 MAY 2022",
//  "10 MAY 2022",
//  "12 MAY 2022",
//  "14 MAY 2022",
//  "16 MAY 2022",
//  "18 MAY 2022",
//  "20 MAY 2022",
//  "22 MAY 2022",
//  "24 MAY 2022",
//  "26 MAY 2022",
//  "28 MAY 2022",
//  "30 MAY 2022",
//  "1 JUNE 2022",
//  "3 JUNE 2022",
//  "5 JUNE 2022",
//  "7 JUNE 2022",
//  "9 JUNE 2022",
//  "11 JUNE 2022",
//  "13 JUNE 2022",
//  "15 JUNE 2022",
//  "17 JUNE 2022",
//  "19 JUNE 2022",
//  "21 JUNE 2022",
//  "23 JUNE 2022",
//  "25 JUNE 2022",
//  "27 JUNE 2022",
//  "29 JUNE 2022",
//  "1 JULY 2022",
//  "3 JULY 2022",
//  "5 JULY 2022",
//  "7 JULY 2022",
//  "9 JULY 2022"
//]
                    
```
- #### date is required (string | array | number)
- #### otherDate is required (string | array | number)
- #### step is required (number) (miliseconds)
- #### pattern is optional (string)

