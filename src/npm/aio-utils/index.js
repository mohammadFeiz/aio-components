import * as ReactDOMServer from 'react-dom/server';
import $ from 'jquery';
export async function DownloadUrl(url, name) {
    fetch(url, {
        mode: 'no-cors',
    })
        .then(resp => resp.blob())
        .then(blob => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(() => alert('oh no!'));
}
export function FileToBase64(file, callback) {
    const fileReader = new FileReader();
    fileReader.onload = () => callback(fileReader.result);
    fileReader.readAsDataURL(file);
}
export function HandleBackButton(callback = () => { }) {
    window.history.pushState({}, '')
    window.history.pushState({}, '')
    window.onpopstate = function (event) {
        window.history.pushState({}, '');
        callback()
    };
}
export function GetClient(e) { return 'ontouchstart' in document.documentElement && e.changedTouches ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : { x: e.clientX, y: e.clientY } }
export function ExportToExcel(rows, config = {}) {
    let { promptText = 'Inter Excel File Name' } = config;
    let o = {
        fixPersianAndArabicNumbers(str) {
            if (typeof str !== 'string') { return str }
            var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
                arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
            for (var i = 0; i < 10; i++) { str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i); }
            return str;
        },
        getJSON(rows) {
            let result = [];
            for (let i = 0; i < rows.length; i++) {
                let json = rows[i], fixedJson = {};
                for (let prop in json) { fixedJson[prop] = this.fixPersianAndArabicNumbers(json[prop]) }
                result.push(fixedJson);
            }
            return result;
        },
        export() {
            let name = window.prompt(promptText);
            if (!name || name === null || !name.length) return;
            var data = this.getJSON(rows);
            var arrData = typeof data != "object" ? JSON.parse(data) : data;
            var CSV = "";
            // CSV += 'title';
            CSV += '\r\n\n';
            if (true) {
                let row = "";
                for (let index in arrData[0]) { row += index + ","; }
                row = row.slice(0, -1);
                CSV += row + "\r\n";
            }
            for (var i = 0; i < arrData.length; i++) {
                let row = "";
                for (let index in arrData[i]) { row += '"' + arrData[i][index] + '",'; }
                row.slice(0, row.length - 1);
                CSV += row + "\r\n";
            }
            if (CSV === "") { alert("Invalid data"); return; }
            var fileName = name.replace(/ /g, "_");
            var universalBOM = "\uFEFF";
            var uri = "data:text/csv;charset=utf-8," + encodeURIComponent(universalBOM + CSV);
            var link = document.createElement("a");
            link.href = uri;
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    return o.export();
}
export function SplitNumber(price, count = 3, splitter = ',') {
    if (!price) { return price }
    let str = price.toString()
    let dotIndex = str.indexOf('.');
    if (dotIndex !== -1) {
        str = str.slice(0, dotIndex)
    }
    let res = ''
    let index = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        res = str[i] + res;
        if (index === count - 1) {
            index = 0;
            if (i > 0) { res = splitter + res; }
        }
        else { index++ }
    }
    return res
}
export function EventHandler(selector, event, action, type = 'bind') {
    var me = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend" };
    let touch = 'ontouchstart' in document.documentElement
    event = touch ? me[event] : event;
    var element = typeof selector === "string" ? (selector === "window" ? $(window) : $(selector)) : selector;
    element.unbind(event, action);
    if (type === 'bind') { element.bind(event, action) }
}
export function Swip(p) {
    let { dom, start, move, end, speedX = 1, speedY = 1, stepX = 1, stepY = 1, reverseY, reverseX, minY, maxY, minX, maxX } = p;
    let a = {
        geo:Geo(),
        timeout: undefined,
        count: 0,
        getDom() { return dom() },
        init() {
            a.count++;
            if (a.count > 10) { clearTimeout(a.timeout); return }
            let res = dom();
            if (!res.length) { a.timeout = setTimeout(() => a.init(), 400) }
            else {
                clearTimeout(a.timeout);
                EventHandler(a.getDom(), 'mousedown', $.proxy(this.mouseDown, this))
            }
        },
        getPercentByValue(value, start, end) { return 100 * (value - start) / (end - start) },
        getMousePosition(e) {
            let client = GetClient(e), x = client.x - this.left, y = client.y - this.top;
            let xp = this.getPercentByValue(x, 0, this.width), yp = this.getPercentByValue(y, 0, this.height);
            return { xp, yp, clientX: client.x, clientY: client.y, x, y }
        },
        mouseDown(e) {
            let dom = a.getDom();
            let offset = dom.offset();
            this.width = dom.width();
            this.height = dom.height();
            this.left = offset.left;
            this.top = offset.top;
            let mousePosition = this.getMousePosition(e)
            let center = [this.left + this.width / 2,this.top + this.height / 2];
            this.so = {
                client: { x: mousePosition.clientX, y: mousePosition.clientY }
            };
            let res = (start || (()=>[0,0]))({mousePosition,center},e);
            if (!Array.isArray(res)) { return; }
            let x = res[0],y = res[1];
            this.so = {...this.so,x,y,center}
            EventHandler('window', 'mousemove', $.proxy(this.mouseMove, this));
            EventHandler('window', 'mouseup', $.proxy(this.mouseUp, this))
        },
        mouseMove(e) {
            let mousePosition = this.getMousePosition(e),client = GetClient(e);
            let cx = this.so.client.x,cy = this.so.client.y,dx = client.x - cx,dy = client.y - cy;
            dx = Math.round(dx * speedX) * (reverseX ? -1 : 1)
            dy = Math.round(dy * speedY) * (reverseY ? -1 : 1)
            dx = Math.floor(dx / stepX) * stepX;
            dy = Math.floor(dy / stepY) * stepY;
            if (dx === this.dx && dy === this.dy) { return }
            this.dx = dx; this.dy = dy;
            this.dist = Math.round(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
            let angle = this.geo.getAngle({line:[[cx.cy],[client.x,client.y]]})
            let centerAngle = this.geo.getAngle({line:[this.so.center,[mousePosition.clientX,mousePosition.clientY]]})
            let x, y;
            if (this.so.x !== undefined && this.so.y !== undefined) {
                x = this.so.x + dx; y = this.so.y + dy;
                if (minX !== undefined && x < minX) { x = minX }
                if (maxX !== undefined && x > maxX) { x = maxX }
                if (minY !== undefined && y < minY) { y = minY }
                if (maxY !== undefined && y > maxY) { y = maxY }
            }
            let p = { 
              dx, dy, dist:this.dist, x, y, angle,center:this.so.center,mousePosition,centerAngle,
              limit:{left:this.left,top:this.top,height:this.height,width:this.width} 
            }
            move(p,e);
        },
        mouseUp(e) {
            EventHandler('window', 'mousemove', this.mouseMove, 'unbind');
            EventHandler('window', 'mouseup', this.mouseUp, 'unbind');
            if(end){end({ dx: this.dx, dy: this.dy, dist: this.dist }, e)}
        }
    }
    a.init();
}
export function getValueByStep({value,start,step,end}){
  let res = Math.round((value - start) / step) * step + start;
  if(res < start){res = start}
  if(res > end){res = end}
  return res;
}
export function URLToJSON(url) {
    try { return JSON.parse(`{"${decodeURI(url.split('?')[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`) }
    catch { return {} }
}
export function JSXToHTML(jsx) {
    return ReactDOMServer.renderToStaticMarkup(jsx)
}
export async function Copy(text) {
    window.navigator.clipboard.writeText(text);
}
export function IsTouch(){
    return "ontouchstart" in document.documentElement
}
export async function Paste() {
    try {
        return window.navigator.clipboard.read();
    }
    catch (err) {
        console.log(err.message)
    }
}
export function Search(items, searchValue, getValue = (o) => o) {
    if (!searchValue) { return items }
    function isMatch(keys, value) {
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (value.indexOf(key) === -1) { return false }
        }
        return true
    }
    let keys = searchValue.split(' ');
    return items.filter((o, i) => isMatch(keys, getValue(o, i)))
}
export function GenerateComponsition({level:maxLevel = 4,length = 4,childsField = 'childs',fields = {}}){
    let $$ = {
        generate(level = 0,index = ''){
            if(level >= maxLevel){return []}
            let res = []
            for(let i = 0; i < length; i++){
                let newIndex = index + '-' + i;
                let newItem = {
                    id:'aa' + Math.round(Math.random() * 10000),
                    [childsField]:$$.generate(level + 1,newIndex)
                }
                for(let prop in fields){newItem[prop] = fields[prop] + index}
                res.push(newItem)
            }
            return res        
        }
    }
    return $$.generate()
}
export function CalculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
export function JsonValidator(json,schema){
    let $$ = {
      getType(v){
        if(['string','number','boolean','array','object','null','undefined'].indexOf(v) !== -1){return v}
        if(Array.isArray(v)){return 'array'}
        return typeof v
      },
      getSchemaTypes(s){
        if(typeof s === 'string' && s.indexOf('|') !== -1){return s.split('|')}
        return [s]
      },
      compaire(data,schema,propName){
        const schemaTypes = this.getSchemaTypes(schema);
        let type = this.getType(data);
        let isMatch = false;
        for(let i = 0; i < schemaTypes.length; i++){
          let st = schemaTypes[i];
          if(['string','number','boolean','array','object','null','undefined'].indexOf(st) !== -1){
            if(type === st){isMatch = true}
          }
          else if(typeof st === 'object'){
            if(type === this.getType(st)){isMatch = true}
          }
          else{
            if(data === st){isMatch = true}
          }
        }
        if(!isMatch){return `${propName} must be ${schemaTypes.join(' or ')}`}
      },
      validate(data,schema,propName = 'data'){
        let compaireResult = this.compaire(data,schema,propName)
        if(compaireResult){return compaireResult}
        if(typeof schema === 'object'){
          if(Array.isArray(data)){
            for(let i = 0; i < data.length; i++){
              let d = data[i];
              let s = schema[i] || schema[0];
              let res = this.validate(d,s,`${propName}[${i}]`);
              if(res){return res}
            }
          }
          else{
            for(let prop in data){
              let d = data[prop];
              let s = schema[prop];
              let res = this.validate(d,s,`${propName}.${prop}`);
              if(res){return res}
            }
            for(let prop in schema){
              let d = data[prop];
              let s = schema[prop];
              let res = this.validate(d,s,`${propName}.${prop}`);
              if(res){return res}
            }
          }
        }
      }
    }
    return $$.validate(json,schema)
  }
export function AIODate() {
  let $$ = {
    isMatch(obj) {
      if (!obj || !Array.isArray(obj.matchers) || obj.date === undefined) {
        console.error(`AIODate().isMatch should get an object as parameter. {*date:number | string | array,*matchers:array}`, obj)
        return false
      }
      let { date, matchers } = obj;
      if (!date) { return false }
      if (matchers === true) { return true }
      if (matchers === false) { return false }
      date = $$.convertToArray({ date })
      let { isLess, isGreater, isEqual } = $$;
      for (let i = 0; i < matchers.length; i++) {
        let matcher = matchers[i], type, targets;
        try {
          let a = matcher.split(',');
          type = a[0];
          targets = a.slice(1, a.length);
        }
        catch { return false }
        if (type === '<') { for (let i = 0; i < targets.length; i++) { if (isLess(date, targets[i])) { return true } } }
        else if (type === '>') { for (let i = 0; i < targets.length; i++) { if (isGreater(date, targets[i])) { return true } } }
        else if (type === '<=') { for (let i = 0; i < targets.length; i++) { if (isEqual(date, targets[i])) { return true } if (isLess(date, targets[i])) { return true } } }
        else if (type === '>=') { for (let i = 0; i < targets.length; i++) { if (isEqual(date, targets[i])) { return true } if (isGreater(date, targets[i])) { return true } } }
        else if (type === '=') { for (let i = 0; i < targets.length; i++) { if (isEqual(date, targets[i])) { return true } } }
        else if (type === '!=') { for (let i = 0; i < targets.length; i++) { if (!isEqual(date, targets[i])) { return true } } }
        else if (type === '<>') {
          if (targets[0] && targets[1]) {
            let start, end;
            if (isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
            else { start = targets[1]; end = targets[0]; }
            if (isGreater(date, start) && isLess(date, end)) { return true }
          }
        }
        else if (type === '<=>') {
          if (targets[0] && targets[1]) {
            let start, end;
            if (isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
            else { start = targets[1]; end = targets[0]; }
            if (isGreater(date, start) && isLess(date, end)) { return true }
            if (isEqual(date, start) || isEqual(date, end)) { return true }
          }
        }
        else if (type === '!<>') {
          if (targets[0] && targets[1]) {
            let start, end;
            if (isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
            else { start = targets[1]; end = targets[0]; }
            if (!isGreater(date, start) || !isLess(date, end)) { return true }
          }
        }
        else if (type === '!<=>') {
          if (targets[0] && targets[1]) {
            let start, end;
            if (isLess(targets[0], targets[1])) { start = targets[0]; end = targets[1]; }
            else { start = targets[1]; end = targets[0]; }
            if (!isEqual(date, start) && !isEqual(date, end) && (isLess(date, start) || isGreater(date, end))) { return true }
          }
        }
        else if (type === 'w') {
          let w = $$.getWeekDay({ date }).index;
          for (let i = 0; i < targets.length; i++) { if (w === +targets[i]) { return true } }
        }
        else if (type === '!w') {
          let w = $$.getWeekDay({ date }).index;
          for (let i = 0; i < targets.length; i++) { if (w !== +targets[i]) { return true } }
        }
      }
      return false
    },
    getSplitter(value) {
      let splitter = '/';
      for (let i = 0; i < value.length; i++) {
        if (isNaN(parseInt(value[i]))) { return value[i] }
      }
      return splitter;
    },
    convertToArray(obj) {
      if (!obj || obj.date === undefined) {
        console.error(`
          AIODate().convertToArray should get an object as parameter. 
          { 
            *date:number | string | array
          }`, obj)
        return false
      }
      let { date,jalali } = obj;
      if (!date) { return false }
      let list;
      if (Array.isArray(date)) { list = [...date] }
      else if (typeof date === 'string') {
        if (date.indexOf("T") !== -1) {
          //"2015-03-25T12:00:00Z"
          let [d, t] = date.split("T");
          t = t.split(".")[0];
          t = t.split(':');
          d = d.split('-');
          list = d.concat(t, 0)
        }
        else {
          list = date.split($$.getSplitter(date));
        }
        list = list.map((date) => parseInt(date))
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
        if(typeof date.year === 'number'){return [date.year,date.month,date.day,date.hour,date.minute,date.second]}
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
      if(jalali){
        let [year,month,day] = $$.toJalali({date:[list[0],list[1],list[2]]});
        list[0] = year; list[1] = month; list[2] = day;
      }
      return list
    },
    toJalali(obj) {
      if (!obj || obj.date === undefined) {
        console.error(`
          AIODate().toJalali should get an object as parameter. 
          { 
            *date:number | string | array , 
            pattern:string (example: {year}/{month}/{day}) 
          }`, obj)
        return false
      }
      if (!obj.date) { return }
      let arr = $$.convertToArray({ date: obj.date });
      let jalali = $$.isJalali(arr);
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
      if (obj.pattern) { return $$.pattern(arr, obj.pattern) }
      return arr;
    },
    toGregorian(obj) {
      if (!obj || obj.date === undefined) {
        console.error(`
          AIODate().toGregorian should get an object as parameter. 
          { 
            *date:number | string | array , 
            pattern:string (example: {year}/{month}/{day}) 
          }`, obj)
        return false
      }
      if (!obj.date) { return }
      let arr = $$.convertToArray({ date: obj.date });
      let jalali = $$.isJalali(arr);
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
      if (obj.pattern) { return $$.pattern(arr, obj.pattern) }
      return arr;
    },
    compaire(obj) {
      if (!obj || obj.date === undefined || obj.otherDate === undefined) {
        console.error(`
          AIODate().compaire should get an object as parameter. 
          { 
            *date:number | string | array , 
            *otherDate:number | string | array , 
          }
          and returns 'greater' | 'less' | 'equal'
          `, obj)
        return false
      }
      let { date, otherDate } = obj;
      if (!date || !otherDate) { return }
      let arr1 = $$.convertToArray({ date });
      let arr2 = $$.convertToArray({ date: otherDate });
      for (let i = 0; i < arr1.length; i++) {
        let a = arr1[i];
        let b = arr2[i] || 0;
        if (a < b) { return 'less' }
        if (a > b) { return 'greater' }
      }
      return 'equal';
    },
    getToCompaire(o1, o2) {
      o1 = $$.convertToArray({ date: o1 });
      o2 = $$.convertToArray({ date: o2 });
      for (let i = 0; i < o1.length; i++) { if (isNaN(o2[i])) { o2[i] = o1[i] } }
      return { date: o1, otherDate: o2 }
    },
    isLess(o1, o2) {
      if (!o1 || !o2) { return false }
      return $$.compaire($$.getToCompaire(o1, o2)) === 'less'
    },
    isEqual(o1, o2) {
      if (!o1 || !o2) { return false }
      return $$.compaire($$.getToCompaire(o1, o2)) === 'equal'
    },
    isGreater(o1, o2) {
      if (!o1 || !o2) { return false }
      return $$.compaire($$.getToCompaire(o1, o2)) === 'greater'
    },
    isBetween(o1, [o2, o3]) {
      if (!o1 || !o2 || !o3) { return false }
      return $$.isGreater(o1, o2) && $$.isLess(o1, o3)
    },
    getTime(obj) {
      if (!obj || obj.date === undefined) {
        console.error(`
          AIODate().getTime should get an object as parameter. 
          { 
            *date:number | string | array , 
          }`, obj)
        return false
      }
      let { date, jalali = $$.isJalali(date) } = obj;
      if (!date) { return }
      if (typeof date === 'number') { return date }
      date = $$.convertToArray({ date });
      let [year, month = 1, day = 1, hour = 0, minute = 0, second = 0, tenthsecond = 0] = date;
      if (jalali) { date = $$.toGregorian({ date: [year, month, day, hour, minute, second, tenthsecond] }) }
      let time = new Date(date[0], date[1] - 1, date[2]).getTime()
      time += hour * 60 * 60 * 1000;
      time += minute * 60 * 1000;
      time += second * 1000;
      time += tenthsecond * 100;
      return time;
    },
    getNextTime(obj) {
      if (!obj || obj.date === undefined || isNaN(obj.offset)) {
        console.error(`
          AIODate().getNextTime should get an object as parameter. 
          { 
            *date:number | string | array , 
            *offset : number(miliseconds) ,
            jalali : boolean(return result by jalali date),
            pattern:string (example: {year}/{month}/{day}) 
          }`, obj)
        return false
      }
      let { date, offset, pattern } = obj;
      if (!offset || !date) { return date }
      let jalali = $$.isJalali(date);
      let time = $$.getTime({ date, jalali });
      time += offset;
      time = $$.convertToArray({ date: time });
      if (jalali || obj.jalali) {
        let [jy, jm, jd] = $$.toJalali({ date: time });
        time[0] = jy; time[1] = jm; time[2] = jd;
      }
      if (pattern) { return $$.pattern(time, pattern) }
      return time;
    },
    getMonthDaysLength(obj) {
      if (!obj || obj.date === undefined) {
        console.error(`
          AIODate().getMonthDaysLength should get an object as parameter. 
          { 
            *date:number | string | array
          }
          `, obj)
        return false
      }
      let { date } = obj;
      if (!date) { return }
      let [year, month] = $$.convertToArray({ date });
      let jalali = $$.isJalali([year, month]);
      if(jalali){return [31,31,31,31,31,31,30,30,30,30,30,[1, 5, 9, 13, 17, 22, 26, 30].indexOf(year % 33) === -1?29:30][month - 1]}
      else {return new Date(year, month - 1, 0).getDate();}
    },
    getYearDaysLength(obj) {
      if (!obj || obj.date === undefined) {
        console.error(`
          AIODate().getYearDaysLength should get an object as parameter. 
          { 
            *date:number | string | array
          }
          `, obj)
        return false
      }
      let { date } = obj;
      if (!date) { return }
      let [year] = $$.convertToArray({ date });
      let res = 0;
      for(let i = 1; i <= 12; i++){
        res += $$.getMonthDaysLength({date:[year,i]})
      }
      return res
    },
    isJalali(date) {return $$.convertToArray({ date })[0] < 1700 ? true : false},
    getWeekDay(obj) {
      if (!obj || !obj.date) {
        console.error(`AIODate().getWeekDay should get an object as parameter. {*date:string | array}`, obj)
        return false
      }
      let date = $$.convertToArray({ date: obj.date });
      let jalali = $$.isJalali(date);
      date = $$.toGregorian({ date })
      let index = new Date(date[0], date[1] - 1, date[2]).getDay();
      if (jalali) {
        index += 1;
        index = index % 7;
      }
      return { weekDay: $$.getWeekDays({ jalali })[index], index };
    },
    getDaysOfWeek(obj) {
      if (!obj || !obj.date) {
        console.error(`AIODate().getDaysOfWeek should get an object as parameter. {*date:string | array}`, obj)
        return false
      }
      let { index } = $$.getWeekDay({ date: obj.date });
      let startDate = $$.getNextTime({ date: [obj.date[0], obj.date[1], obj.date[2]], offset: -(index + 1) * 24 * 60 * 60 * 1000 });
      let endDate = $$.getNextTime({ date: [obj.date[0], obj.date[1], obj.date[2]], offset: (7 - index) * 24 * 60 * 60 * 1000 });
      return $$.getDatesBetween({ date: startDate, otherDate: endDate, pattern: obj.pattern, step: 24 * 60 * 60 * 1000 })
    },
    getDaysOfMonth(obj) {
      if (!obj || !obj.date) {
        console.error(`AIODate().getLastDayOfMonth should get an object as parameter. {*date:string | array}`, obj)
        return false
      }
      let date = $$.convertToArray({ date: obj.date });
      let firstDay = [date[0], date[1], 1];
      let lastDay = $$.getLastDayOfMonth({ date })
      let betweenDayes = $$.getDatesBetween({ date: firstDay, otherDate: lastDay, step: 24 * 60 * 60 * 1000 });
      let result = [firstDay];
      result = result.concat(betweenDayes);
      result.push(lastDay);
      if (obj.pattern) {
        return result.map((o) => $$.getDateByPattern({ date: o, pattern: obj.pattern }))
      }
      return result;
    },
    getLastDayOfMonth(obj) {
      if (!obj || !obj.date) {
        console.error(`AIODate().getLastDayOfMonth should get an object as parameter. {*date:string | array}`, obj)
        return false
      }
      let date = $$.convertToArray({ date: obj.date });
      let length = $$.getMonthDaysLength({ date });
      let lastDay = [date[0], date[1], length];
      if (obj.pattern) {
        return $$.getDateByPattern({ date: lastDay, pattern: obj.pattern })
      }
      return lastDay
    },
    getWeekDays({ jalali }) {
      return [
        ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
        ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
      ][jalali?0:1]
    },
    getMonths({ jalali }) {
      return [
        ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',],
        ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
      ][jalali?0:1]
    },
    getDatesBetween(obj) {
      if (!obj || obj.date === undefined || obj.otherDate === undefined) {
        console.error(`
          AIODate().getDatesBetween should get an object as parameter. 
          {
            *date:number | array | string,
            *otherDate:number | array | string,
            *step:number(miliseconds. default is 24 * 60 * 60 * 1000),
            pattern:string (example '{year/{month}/{day}}')
          }`)
        return false;
      }
      let { date, otherDate, step = 24 * 60 * 60 * 1000, pattern } = obj;
      date = $$.convertToArray({ date: date });
      otherDate = $$.convertToArray({ date: otherDate });
      if (!$$.isGreater(otherDate, date)) { return [] }
      let length = $$.getDelta({ date, otherDate }).miliseconds / step;
      if (isNaN(length) || length > 1000) {
        console.error('AIODate().getDatesBetween() => too many dates');
        return;
      }
      let nextDate = $$.getNextTime({ date, offset: step });
      let res = [];
      while ($$.isLess(nextDate, otherDate)) {
        if (pattern) {
          res.push($$.pattern(nextDate, pattern));
        }
        else {
          res.push(nextDate);
        }
        nextDate = $$.getNextTime({ date: nextDate, offset: step });
      }
      return res
    },
    getToday(obj = {}) {
      let {jalali,pattern} = obj;
      let date = new Date();
      date = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), Math.round(date.getMilliseconds() / 100)]
      if (jalali) { date = $$.toJalali({ date }) }
      if (pattern) { return $$.pattern(date, pattern) }
      return date;
    },
    getDateByPattern(obj) {
      if (!obj || !obj.date || typeof obj.pattern !== 'string') {
        console.error(`AIODate().getDateByPattern should get an object as parameter. {*date:number | string | array,*pattern:string}`)
        return false;
      }
      let { date, pattern,jalali } = obj
      return $$.pattern(date, pattern,jalali)
    },
    pattern(date, pattern,Jalali) {
      date = $$.convertToArray({ date,jalali:Jalali });
      let [year, month, day, hour, minute, second, tenthsecond] = date;
      let jalali = $$.isJalali(date);
      pattern = pattern.replace('{year}', year);
      if(typeof month === 'number'){pattern = pattern.replace('{month}', $$.get2Digit(month));}
      if(typeof day === 'number'){pattern = pattern.replace('{day}', $$.get2Digit(day));}
      if(typeof hour === 'number'){pattern = pattern.replace('{hour}', $$.get2Digit(hour));}
      if(typeof minute === 'number'){pattern = pattern.replace('{minute}', $$.get2Digit(minute));}
      if(typeof second === 'number'){pattern = pattern.replace('{second}', $$.get2Digit(second));}
      if(typeof tenthsecond === 'number'){pattern = pattern.replace('{tenthsecond}', $$.get2Digit(tenthsecond));}
      if (pattern.indexOf('{monthString}') !== -1) {
        pattern = pattern.replace('{monthString}', $$.getMonths({ jalali })[month - 1]);
      }
      if (pattern.indexOf('{weekDay}') !== -1) {
        let weekDays = $$.getWeekDays({ jalali });
        let { index } = $$.getWeekDay({ date });
        pattern = pattern.replace('{weekDay}', weekDays[index]);
      }
      return pattern
    },
    convertMiliseconds({miliseconds = 0,unit = 'day',pattern}) {
      let type;
      if(miliseconds < 0){type = 'passed'; miliseconds = -miliseconds}
      else if(miliseconds > 0){type = 'remaining'}
      else {type = 'now'}
      let index = ['day','hour','minute','second','tenthsecond','milisecond'].indexOf(unit);
      let day = 0, hour = 0, minute = 0,second = 0, tenthsecond = 0; 
      let dif = miliseconds;
      if(index <= 0){
        day = Math.floor(dif / (24 * 60 * 60 * 1000));
        dif -= day * (24 * 60 * 60 * 1000);
      }
      if(index <= 1){
        hour = Math.floor(dif / (60 * 60 * 1000));
        dif -= hour * (60 * 60 * 1000);
      }
      if(index <= 2){
        minute = Math.floor(dif / (60 * 1000));
        dif -= minute * (60 * 1000);
      }
      if(index <= 3){
        second = Math.floor(dif / (1000));
        dif -= second * (1000);
      }
      if(index <= 4){
        tenthsecond = Math.floor(dif / (100));
      }
      if (pattern) {
        return $$.pattern([0, 0, day, hour, minute, second, tenthsecond], pattern)
      }
      return { day, hour, minute, second, tenthsecond, miliseconds,type }
    },
    getDelta(obj) {
      if (!obj || !obj.date) {
        console.error(`
          AIODate().getDelta should get an object as parameter. 
          {
            *date:number | string | array,
            otherDate:number | string | array, (default is now),
            pattern:string (example: '{year}/{month}/{day}'),
            unit:'day' | 'hour' | 'minute' | 'second' | 'tenthsecond' | 'milisecond'
          }`)
        return false;
      }
      let { date, otherDate = new Date().getTime(), pattern,unit } = obj;
      let dif = $$.getTime({ date }) - $$.getTime({ date: otherDate });
      return $$.convertMiliseconds({miliseconds:-dif,unit,pattern})
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
    getDayIndex({date,unit}){
      date = $$.convertToArray({date});
      if(unit === 'week'){
        let days = $$.getDaysOfWeek({date});
        for(let i = 0; i < days.length; i++){
          let [year,month,day] = days[i];
          if(year !== date[0]){continue}
          if(month !== date[1]){continue}
          if(day !== date[2]){continue}
          return i;
        }
      }
      if(unit === 'month'){
        return date[2] - 1;
      }
      if(unit === 'year'){
        let res = 0;
        for(let i = 0; i < date[1] - 1; i++){
          res += $$.getMonthDaysLength({date})
        }
        res += date[1];
        return res - 1
      }
    },
    getNextMonth([year, month, day, hour]) { return month < 12 ? [year, month + 1, day, hour] : [year + 1, 1, 1]; },
    getPrevMonth([year, month, day, hour]) { return month > 1 ? [year, month - 1, day, hour] : [year - 1, 12, 1]; },
    get2Digit(n) {
      let ns;
      try{ns = n.toString()}
      catch{return n}
      if (ns.length === 1) { ns = '0' + n }
      return ns
    }
  }
  return {
    getDaysOfWeek: $$.getDaysOfWeek,
    getDaysOfMonth: $$.getDaysOfMonth,
    getLastDayOfMonth: $$.getLastDayOfMonth,
    getByOffset: $$.getByOffset,
    getDayIndex:$$.getDayIndex,
    pattern:$$.pattern,
    toJalali: $$.toJalali,
    toGregorian: $$.toGregorian,
    getTime: $$.getTime,
    getSplitter: $$.getSplitter,
    convertToArray: $$.convertToArray,
    compaire: $$.compaire,
    isEqual: $$.isEqual,
    isGreater: $$.isGreater,
    getDelta: $$.getDelta,
    convertMiliseconds:$$.convertMiliseconds,
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
    get2Digit:$$.get2Digit
  }
}
export function Geo(){
  let $$ = {
    getAngle(obj){
      var {line} = obj;
      var deltaX,deltaY,length;
      if(obj.line){
        deltaX = line[1][0] - line[0][0]; 
        deltaY = line[1][1] - line[0][1];
      }
      else if(obj.dip){
        deltaX = -obj.dip.deltaX; 
        deltaY = -obj.dip.deltaY;
      }
      var length = this.getLength([[0,0],[deltaX,deltaY]]);
      var angle = Math.acos(deltaX / length) / Math.PI * 180;
      angle = Math.sign(deltaY) < 0?360 - angle:angle;
      return parseFloat(angle.toFixed(4));
    },
    getLength([p1,p2]){
      return Math.sqrt(Math.pow(p1[0] - p2[0],2) + Math.pow(p1[1] - p2[1],2))
    },
    getPrepDip(line){
      var dip = this.getDip(line);
      dip.m = -1 / dip.m;
      return dip;
    },
    getDip([p1,p2]){
      var deltaY = p1[1] - p2[1];
      var deltaX = p1[0] - p2[0];
      var m = deltaY / deltaX; 
      return {deltaY,deltaX,m};
    },
    getPrepFromLine(obj){
      var {point,offset,line,dip = this.getDip(line)} = obj;
      if(!offset){return point;}
      var angle = this.getAngle({dip});
      var [p1,p2] = this.getLineBySLA(point,offset,angle - 90)
      return p2
    },
    getLineBySLA(p1,length,angle){  
      if(!length){return [p1,p1]}
      return [p1,[p1[0]+(Math.cos(angle * Math.PI / 180) * length),p1[1] + (Math.sin(angle * Math.PI / 180) * length)]];
    },
    getArcByPoints(item){
      var {arcPoints,height} = item;
      var points = [];
      var stringPoints = [];
      for(var i = 0; i < arcPoints.length; i++){
        if(i === 3){break;}
        var point = arcPoints[i];
        var stringPoint = point.toString();
        if(stringPoints.indexOf(stringPoint) !== -1){continue}
        stringPoints.push(stringPoint);
        points.push(point)
      }
      var p1 = points[0],p2= points[1],p3 = points[2];
      var changeObject = {};
      if(points.length === 1){changeObject = {r:0,x:p1[0],y:p1[1]}}
      else if(points.length === 2){
        let avg = this.getAvg([p1,p2]);
        if(height){changeObject = this.getArcBy3Points(p1,this.getPrepFromLine({point:avg,line:[p1,p2],offset:height}),p2);}
        else {changeObject = {r:this.getLength([p1,p2]) / 2,x:avg[0],y:avg[1]}}
      }
      else {changeObject = this.getArcBy3Points(p1,p2,p3);}
      item = {...changeObject,...item}
      return item
    },
    getArcBy3Points(p1,p2,p3) {
      var dip1 = this.getPrepDip([p1, p2]);
      var dip2 = this.getPrepDip([p2, p3]);
      var point1 = this.getAvg([p1, p2]);
      var point2 = this.getAvg([p2, p3]) 
      var meet = this.getMeet({point1,dip1,point2,dip2});
      if (!meet) {return false;}
      var x = meet[0],y = meet[1];
      var a1 = this.getAngle({line:[meet, p1]}),
          a2 = this.getAngle({line:[meet, p2]}),
          a3 = this.getAngle({line:[meet, p3]});
      
      var slice;
      if (a1 < a2 && a2 < a3) {slice = [a1, a3];} 
      else if (a2 < a3 && a3 < a1) {slice = [a1, a3];} 
      else if (a3 < a1 && a1 < a2) {slice = [a1, a3];}
      else if (a3 < a2 && a2 < a1) {slice = [a3, a1];} 
      else if (a1 < a3 && a3 < a2) {slice = [a3, a1];} 
      else if (a2 < a1 && a1 < a3) {slice = [a3, a1];
      } else {slice = [0, 0];}
      return { x, y, r: this.getLength([p1, [x, y]]),slice };
    },
    getArcBy3Points(p1,p2,p3) {
      var dip1 = this.getPrepDip([p1, p2]);
      var dip2 = this.getPrepDip([p2, p3]);
      var point1 = this.getAvg([p1, p2]);
      var point2 = this.getAvg([p2, p3]) 
      var meet = this.getMeet({point1,dip1,point2,dip2});
      if (!meet) {return false;}
      var x = meet[0],y = meet[1];
      var a1 = this.getAngle({line:[meet, p1]}),
          a2 = this.getAngle({line:[meet, p2]}),
          a3 = this.getAngle({line:[meet, p3]});
      
      var slice;
      if (a1 < a2 && a2 < a3) {slice = [a1, a3];} 
      else if (a2 < a3 && a3 < a1) {slice = [a1, a3];} 
      else if (a3 < a1 && a1 < a2) {slice = [a1, a3];}
      else if (a3 < a2 && a2 < a1) {slice = [a3, a1];} 
      else if (a1 < a3 && a3 < a2) {slice = [a3, a1];} 
      else if (a2 < a1 && a1 < a3) {slice = [a3, a1];
      } else {slice = [0, 0];}
      return { x, y, r: this.getLength([p1, [x, y]]),slice };
    },
    getMeet(obj){ //get {line1,line2} or {point1,point2,dip1,dip2}
      var {line1,line2,point1 = line1[0],point2 = line2[0],dip1 = this.getDip(line1),dip2 = this.getDip(line2)} = obj;
      if(dip1.m === dip2.m){return false}
      if(Math.abs(dip1.m) === Infinity){return [point1[0],this.getYOnLineByX({point:point2,dip:dip2,x:point1[0]})]}
      if(Math.abs(dip2.m) === Infinity){return [point2[0],this.getYOnLineByX({point:point1,dip:dip1,x:point2[0]})]}
      var x = ((dip1.m * point1[0]) - (dip2.m * point2[0]) + point2[1] - point1[1]) / (dip1.m - dip2.m);
      var y = dip1.m * (x - point1[0]) + point1[1];
      return [x,y]
    },
    getYOnLineByX(obj){ // get {x,line} or {x,point,dip}
      var {x,line,point = line[0],dip = this.getDip(line)} = obj;
      if(dip.m === Infinity){return false}
      return dip.m * (x - point[0]) + point[1];
    },
    getPopintsByNGon(radius,count,corner){
      let ang = (180 - (360 / count));
      let w = +(Math.cos(ang / 2 * Math.PI / 180) * radius).toFixed(6) * 2;
      let h = +(Math.sin(ang / 2 * Math.PI / 180) * radius).toFixed(6);
      let p1 = [0,-h,corner];
      let p2 = [0 + w / 2,-h,corner];
      let points = [p1,p2];
      let a = 360 / count;
      for(let i = 0; i < count - 1; i++){
        let p = [points[i + 1][0]+(Math.cos(a * Math.PI / 180) * w),points[i + 1][1] + (Math.sin(a * Math.PI / 180) * w),corner];
        a += 360 / count;
        points.push(p)
      }
      points.push(p1);
      return points;
    },
    getXOnLineByY(obj){ // get {y,line} or {y,point,dip}
      var {y,line,point = line[0],dip = this.getDip(line)} = obj;
      if(dip.m === 0){return false}
      if(dip.m === Infinity){return point[0]}
      return (y - point[1]) / dip.m + point[0];
    },
    getAvg(arr){
      var x = 0,y = 0,length = arr.length;
      for(var i = 0; i < length; i++){ x += arr[i][0]; y += arr[i][1]; }
      return [x / length,y / length]
    }
  }
  return {
    getAngle:$$.getAngle,
    getLength:$$.getLength,
    getDip:$$.getDip,
    getPrepDip:$$.getPrepDip,
    getPrepFromLine:$$.getPrepFromLine,
    getLineBySLA:$$.getLineBySLA,
    getArcByPoints:$$.getArcByPoints,
    getArcBy3Points:$$.getArcBy3Points,
    getMeet:$$.getMeet,
    getYOnLineByX:$$.getYOnLineByX,
    getXOnLineByY:$$.getXOnLineByY,
    getPopintsByNGon:$$.getPopintsByNGon,
    getAvg:$$.getAvg
  }
}