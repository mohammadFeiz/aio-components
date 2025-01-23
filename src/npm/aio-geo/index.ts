export type I_point = number[]
export type I_line = [I_point, I_point]
export type I_dline = [number, number, number]//x,y,dip
export type I_dip = number
export type I_arc = { x: number, y: number, r: number, slice?: number[] }
export type I_rect = [I_point, I_point]
export default class Geo {
    getAngle: (l: I_line | I_dline) => number
    getDipAngle: (dip: I_dip) => number
    getLength: (p: I_line) => number
    getPrepDip: (dip: I_dip) => number
    getDip: (l: I_line | I_dline) => I_dip
    getPrepFromLine: (l: I_dline | I_line, point: I_point, offset: number) => I_point
    getLineBySLA: (p1: I_point, length: number, angle: number) => I_line
    getArcByPoints: (arcPoints: I_point[], height?: number) => any
    getAvg: (list: I_point[]) => I_point
    getArcBy3Points: (p1: I_point, p2: I_point, p3: I_point) => I_arc
    getYOnLineByX: (l: I_dline | I_line, X: number) => number
    getXOnLineByY: (l: I_dline | I_line, Y: number) => number
    getMeet: (l1: I_dline | I_line, l2: I_dline | I_line) => I_point | false
    getInnerMeet: (line1: I_line, line2: I_line) => false | I_point
    getDLineByLine: (line: I_line) => I_dline
    getPointsByNGon: (r: number, count: number, corner: number) => I_point[]
    getLineByDLine: (dline: I_dline) => I_line
    tri: (type: 'sin' | 'cos', teta: number) => number
    getPrepToLine: (l: I_dline | I_line, p: I_point) => I_point | false
    getLineType: (line: I_dline | I_line) => 'DLine' | 'Line'
    getLine: (l: I_dline | I_line) => I_line
    getDLine: (l: I_dline | I_line) => I_dline
    setLineByLength: (line: I_line, length: number, from?: 'center' | 'start' | 'end') => I_line
    getParallelLine: (points: I_point[], offset: number) => I_point[]
    getPointsByDivide: (points: I_point[], divide: number) => I_point[]
    fix: (value: number) => number
    setLineByAngle: (line: I_line, angle: number) => I_line
    getNumberByStep: (number: number, step: number) => number
    setLineByOrtho: (line: I_line, ortho: number) => I_line
    rotateSpline: (points: I_point[], angle: number, center: I_point) => I_point[]
    isPointInPath: (points: I_point[], point: I_point) => boolean
    getDXF: (p: { type: 'line' | 'rect' | 'arc', obj: any }[]) => string;
    smooth: (points: I_point[], angle: number) => I_point[]
    constructor() {
        this.getAngle = (l) => {
            let line: I_line = this.getLineType(l) === 'DLine' ? this.getLineByDLine(l as I_dline) : (l as I_line)
            let [p1, p2] = line;
            let deltaX = p2[0] - p1[0];
            let deltaY = p2[1] - p1[1];
            let length = this.getLength([[0, 0], [deltaX, deltaY]]);
            let angle = Math.acos(deltaX / length) / Math.PI * 180;
            angle = Math.sign(deltaY) < 0 ? 360 - angle : angle;
            return parseFloat(angle.toFixed(4));
        }
        this.getLineType = (line) => Array.isArray(line[0]) ? 'Line' : 'DLine'
        this.getLine = (l) => this.getLineType(l) === 'Line' ? l as I_line : this.getLineByDLine(l as I_dline)
        this.getDLine = (l) => this.getLineType(l) === 'DLine' ? l as I_dline : this.getDLineByLine(l as I_line)
        this.getDipAngle = (dip) => this.getAngle([0, 0, dip])
        this.getLength = (line) => Math.sqrt(Math.pow(line[0][0] - line[1][0], 2) + Math.pow(line[0][1] - line[1][1], 2))
        this.getPrepDip = (dip) => -1 / dip
        this.getDip = (l) => {
            let line: I_line = this.getLine(l);
            return line[0][1] - line[1][1] / line[0][0] - line[1][0]
        }
        this.getLineByDLine = (dline) => {
            let [x, y] = dline;
            let X = this.getXOnLineByY(dline, y + 10)
            let Y = this.getYOnLineByX(dline, X)
            return [[x, y], [X, Y]]
        }
        this.getPrepFromLine = (l, point, offset) => {
            if (!offset) { return point; }
            let dline = this.getDLine(l);
            let angle: number = this.getAngle(dline);
            return this.getLineBySLA(point, offset, angle - 90)[1]
        }
        this.getPrepToLine = (l, point) => {
            let dline = this.getDLine(l);
            let prepLine: I_dline = [point[0], point[1], this.getPrepDip(dline[2])]
            return this.getMeet(dline, prepLine);
        }
        this.getLineBySLA = (p1, length, angle) => {
            if (!length) { return [p1, p1] }
            return [p1, [p1[0] + (this.tri('cos', angle) * length), p1[1] + (this.tri('sin', angle) * length)]];
        }
        this.getArcByPoints = (arcPoints, height) => {
            var points = [];
            var stringPoints = [];
            for (var i = 0; i < arcPoints.length; i++) {
                if (i === 3) { break; }
                var point = arcPoints[i];
                var stringPoint = point.toString();
                if (stringPoints.indexOf(stringPoint) !== -1) { continue }
                stringPoints.push(stringPoint);
                points.push(point)
            }
            var p1 = points[0], p2 = points[1], p3 = points[2];
            var changeObject: I_arc = { x: 0, y: 0, r: 0 };
            if (points.length === 1) { changeObject = { r: 0, x: p1[0], y: p1[1] } }
            else if (points.length === 2) {
                let avg = this.getAvg([p1, p2]);
                let dline = this.getDLineByLine([p1, p2])
                let pm = this.getPrepFromLine(dline, avg, height || 0);
                if (height) { changeObject = this.getArcBy3Points(p1, pm, p2); }
                else { changeObject = { r: this.getLength([p1, p2]) / 2, x: avg[0], y: avg[1] } }
            }
            else { changeObject = this.getArcBy3Points(p1, p2, p3); }
            return changeObject
        }
        this.getAvg = (arr) => {
            var x = 0, y = 0, length = arr.length;
            for (var i = 0; i < length; i++) { x += arr[i][0]; y += arr[i][1]; }
            return [x / length, y / length]
        }
        this.getArcBy3Points = (p1, p2, p3) => {
            let dip1: I_dip = this.getPrepDip(this.getDip([p1, p2]));
            let dip2: I_dip = this.getPrepDip(this.getDip([p2, p3]));
            let point1: I_point = this.getAvg([p1, p2]);
            let point2: I_point = this.getAvg([p2, p3])
            let dline1: I_dline = [point1[0], point1[1], dip1]
            let dline2: I_dline = [point2[0], point2[1], dip2]
            let meet = this.getMeet(dline1, dline2);
            if (!meet) { return { x: 0, y: 0, r: 0 }; }
            let x = meet[0], y = meet[1];
            let a1 = this.getAngle([meet, p1]),
                a2 = this.getAngle([meet, p2]),
                a3 = this.getAngle([meet, p3]);
            let slice;
            if (a1 < a2 && a2 < a3) { slice = [a1, a3]; }
            else if (a2 < a3 && a3 < a1) { slice = [a1, a3]; }
            else if (a3 < a1 && a1 < a2) { slice = [a1, a3]; }
            else if (a3 < a2 && a2 < a1) { slice = [a3, a1]; }
            else if (a1 < a3 && a3 < a2) { slice = [a3, a1]; }
            else if (a2 < a1 && a1 < a3) {
                slice = [a3, a1];
            } else { slice = [0, 0]; }
            let arc: I_arc = { x, y, r: this.getLength([p1, [x, y]]), slice };
            return arc
        }
        this.getDLineByLine = (line) => {
            let [p1] = line;
            return [p1[0], p1[1], this.getDip(line)]
        }
        this.getMeet = (l1, l2) => { //get {line1,line2} or {point1,point2,dip1,dip2}
            let dline1 = this.getDLine(l1);
            let dline2 = this.getDLine(l2);
            let [p1x, p1y, dip1] = dline1;
            let [p2x, p2y, dip2] = dline2;
            if (dip1 === dip2) { return false }
            if (Math.abs(dip1) === Infinity) { return [p1x, this.getYOnLineByX(dline2, p1x)] }
            if (Math.abs(dip2) === Infinity) { return [p2x, this.getYOnLineByX(dline1, p2x)] }
            var x = ((dip1 * p1x) - (dip2 * p2x) + p2y - p1y) / (dip1 - dip2);
            var y = dip1 * (x - p1x) + p1y;
            return [x, y]
        }
        this.getInnerMeet = (line1, line2) => {
            let meet = this.getMeet(line1, line2);
            if (meet === false) { return false }
            if (line2[0][0] < line2[1][0]) {
                if (meet[0] < line2[0][0] || meet[0] > line2[1][0]) { return false }
            }
            else {
                if (meet[0] < line2[1][0] || meet[0] > line2[0][0]) { return false }
            }
            if (line2[0][1] < line2[1][1]) {
                if (meet[1] < line2[0][1] || meet[1] > line2[1][1]) { return false }
            }
            else {
                if (meet[1] < line2[1][1] || meet[1] > line2[0][1]) { return false }
            }
            if (line1[0][0] < line1[1][0]) {
                if (meet[0] < line1[0][0] || meet[0] > line1[1][0]) { return false }
            }
            else {
                if (meet[0] < line1[1][0] || meet[0] > line1[0][0]) { return false }
            }
            if (line1[0][1] < line1[1][1]) {
                if (meet[1] < line1[0][1] || meet[1] > line1[1][1]) { return false }
            }
            else {
                if (meet[1] < line1[1][1] || meet[1] > line1[0][1]) { return false }
            }
            return meet;
        }
        this.getYOnLineByX = (l, X) => { // get {x,line} or {x,point,dip}
            let [x, y, dip] = this.getDLine(l);
            if (dip === Infinity) { return 0 }
            return dip * (X - x) + y;
        }
        this.getXOnLineByY = (l, Y) => { // get {y,line} or {y,point,dip}
            let [x, y, dip] = this.getDLine(l);
            if (dip === 0) { return 0 }
            if (dip === Infinity) { return x }
            return (Y - y) / dip + x;
        }
        this.tri = (type, a) => Math[type](a * Math.PI / 180)
        this.getPointsByNGon = (radius, count, corner) => {
            let ang = (180 - (360 / count));
            let w = +(this.tri('cos', ang / 2) * radius).toFixed(6) * 2;
            let h = +(this.tri('sin', ang / 2) * radius).toFixed(6);
            let p1 = [0, -h, corner];
            let p2 = [0 + w / 2, -h, corner];
            let points = [p1, p2];
            let a = 360 / count;
            for (let i = 0; i < count - 1; i++) {
                let p = [points[i + 1][0] + (this.tri('cos', a) * w), points[i + 1][1] + (this.tri('sin', a) * w), corner];
                a += 360 / count;
                points.push(p)
            }
            points.push(p1);
            return points;
        }
        this.setLineByLength = (line, length, side = 'end') => {
            let p1: I_point = [0, 0], p2: I_point = [0, 0], angle = this.getAngle(line);
            if (side === 'center') {
                let center = this.getAvg(line);
                let line1 = this.getLineBySLA(center, length / 2, angle + 180);
                let line2 = this.getLineBySLA(center, length / 2, angle);
                p1 = line1[1]; p2 = line2[1];
            }
            else if (side === 'end') {
                p1 = line[0];
                let newLine = this.getLineBySLA(p1, length, angle);
                p2 = newLine[1];
            }
            else if (side === 'start') {
                p2 = line[1];
                let newLine = this.getLineBySLA(p2, length, angle + 180);
                p1 = newLine[1]
            }
            return [p1, p2];
        }
        this.getParallelLine = (points, offset) => {
            let lines: I_line[] = [];
            let length = points.length;
            if (length === 2) {
                let p1 = this.getPrepFromLine([points[0], points[1]], points[0], offset);
                let p2 = this.getPrepFromLine([points[0], points[1]], points[1], offset);
                return [p1, p2];
            }
            for (var i = 1; i <= length; i++) {
                var point = points[i];
                if (i === length) { break; }
                var beforePoint = points[i - 1];
                var p1 = this.getPrepFromLine([beforePoint, point], beforePoint, offset);
                var p2 = this.getPrepFromLine([beforePoint, point], point, offset);
                lines.push([p1, p2]);
            }
            let res: I_point[] = [];
            length = lines.length;
            for (let i = 0; i < length; i++) {
                let line = lines[i];
                let beforeLine = lines[i - 1];
                if (i === 0) {
                    points.push([line[0][0], line[0][1]]);
                    continue
                }
                let meet = this.getMeet(beforeLine, line);
                if (meet) { res.push(meet); }
                if (i === length - 1) { points.push([line[1][0], line[1][1]]); }
            }
            return res;
        }
        this.getPointsByDivide = (line, divide) => {
            let [p1, p2] = line;
            let deltaX = this.fix(p2[0] - p1[0]), deltaY = this.fix(p2[1] - p1[1]);
            let uX = deltaX / divide, uY = deltaY / divide;
            let points: I_point[] = [];
            for (let i = 1; i < divide; i++) {
                points.push([p1[0] + i * uX, p1[1] + i * uY])
            }
            return points;
        }
        this.fix = (value) => { return parseFloat(value.toFixed(6)) }
        this.setLineByAngle = (line, angle) => {
            let length = this.getLength(line);
            if (!length) { return line }
            angle = angle % 360;
            return this.getLineBySLA([line[0][0], line[0][1]], length, angle);
        }
        this.getNumberByStep = (number, step) => Math.round(number / step) * step
        this.setLineByOrtho = (line, ortho) => this.setLineByAngle(line, this.getNumberByStep(this.getAngle(line), ortho))
        this.rotateSpline = (points, angle, center) => {
            let Points: I_point[] = JSON.parse(JSON.stringify(points));
            for (var i = 0; i < Points.length; i++) {
                let p = Points[i];
                let line: I_line = [[...center], [p[0], p[1]]];
                let lineAngle: number = this.getAngle(line);
                line = this.setLineByAngle(line, angle + lineAngle);
                p[0] = line[1][0];
                p[1] = line[1][1];
            }
            return Points;
        }
        this.isPointInPath = (points, point) => {
            let meets = 0;
            for (let i = 0; i < points.length; i++) {
                let curentPoint = points[i], nextPoint;
                if (i === points.length - 1) { nextPoint = points[0] }
                else { nextPoint = points[i + 1] }
                let meet = this.getInnerMeet([[point[0], point[1]], [9999999999, point[1]]], [[curentPoint[0], curentPoint[1]], [nextPoint[0], nextPoint[1]]]);
                if (meet !== false) { meets++ }
            }
            return meets % 2 !== 0;
        }
        this.smooth = (points, angle) => {
            let p1: I_point | undefined, p2: I_point | undefined, p3: I_point | undefined;
            let res: I_point[] = [];
            let type;
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                if (i === 0) { res.push([point[0], point[1]]); }
                if (!p1) { p1 = [point[0], point[1]]; continue; }
                if (!p2) { p2 = [point[0], point[1]]; continue; }
                if (!p3) { p3 = [point[0], point[1]]; continue; }
                const ang1 = this.getAngle([p1, p2]);
                const ang2 = this.getAngle([p2, p3]);
                const isSmooth: boolean = Math.abs(ang1 - ang2) < angle;
                if (isSmooth) {
                    p2 = [p3[0], p3[1]];
                    p3 = [point[0], point[1]];
                    type = 0
                } else {
                    res.push(p2);
                    p1 = [p2[0], p2[1]];
                    p2 = [p3[0], p3[1]];
                    p3 = [point[0], point[1]];
                    type = 1
                }
                if (i === points.length - 1) {
                    if (type === 1) {
                        res.push([p2[0], p2[1]]);
                    }
                    res.push([point[0], point[1]]);
                }
            }
            return res;
        }
        this.getDXF = (list = []) => {
            var get = {
                line: function (line: I_line) {
                    let [p1, p2] = line;
                    let res = '';
                    res +=
                        "LINE" + "\r\n" +
                        "8" + "\r\n" +
                        "1" + "\r\n" +
                        "62" + "\r\n" +
                        "0" + "\r\n" +
                        "10" + "\r\n" +
                        (p1[0]) + "\r\n" +
                        "20" + "\r\n" +
                        (p1[1]) * -1 + "\r\n" +
                        "30" + "\r\n" +
                        "0.0" + "\r\n" +
                        "11" + "\r\n" +
                        (p2[0]) + "\r\n" +
                        "21" + "\r\n" +
                        (p2[1]) * -1 + "\r\n" +
                        "31" + "\r\n" +
                        "0.0" + "\r\n" +
                        "0" + "\r\n";
                    return res;
                },
                rect: function (rect: I_rect) {
                    let [p1, p2] = rect;
                    var rectangle = '';
                    rectangle += this.line([[p1[0], p1[1]], [p2[0], p2[1]]]);
                    rectangle += this.line([[p2[0], p1[1]], [p2[0], p2[1]]]);
                    rectangle += this.line([[p2[0], p2[1]], [p1[0], p2[1]]]);
                    rectangle += this.line([[p1[0], p2[1]], [p1[0], p1[1]]]);
                    return rectangle;
                },
                arc: function (arc: I_arc) {
                    let { x, y, r, slice = [0, 360] } = arc
                    let res = '';
                    res +=
                        "ARC" + "\r\n" +
                        "8" + "\r\n" +
                        "1" + "\r\n" +
                        "62" + "\r\n" +
                        "0" + "\r\n" +
                        "10" + "\r\n" +
                        (x) + "\r\n" +
                        "20" + "\r\n" +
                        (y) * -1 + "\r\n" +
                        "30" + "\r\n" +
                        "0.0" + "\r\n" +
                        "40" + "\r\n" +
                        (r) + "\r\n" +
                        "50" + "\r\n" +
                        (slice[0]) + "\r\n" +
                        "51" + "\r\n" +
                        (slice[1]) + "\r\n" +
                        "0" + "\r\n";
                    return arc;
                }

            }
            let entities = '';
            for (let i = 0; i < list.length; i++) {
                var { type, obj } = list[i];
                entities += get[type](obj)
            }
            var dxfText =
                "0" + "\r\n" +
                "SECTION" + "\r\n" +
                "2" + "\r\n" +
                "ENTITIES" + "\r\n" +
                "0" + "\r\n";
            dxfText += entities;
            dxfText +=
                "ENDSEC" + "\r\n" +
                "0" + "\r\n" +
                "EOF";
            return dxfText;
        }
    }
}