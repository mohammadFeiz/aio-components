import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
type I_key = { fa?: string, en?: string, defaultValue: any }
type I_convertJsonParam = { jsonData: any, keys: I_key[], from: 'en' | 'fa', to: 'en' | 'fa', nullValue: any, extend?: (row: any, index: number) => any }
type I_excelStyle = {
    background?: string,
    fontWeight?: 'bold',
    fontFamily?: string,
    fontSize?: number,
    color?: string,
    border?: string,
    borderLeft?: string,
    borderRight?: string,
    borderBottom?: string,
    borderTop?: string,
    alignItems?: 'flex-start' | 'center' | 'flex-end',
    justifyContent?: 'flex-start' | 'center' | 'flex-end',
    flexWrap?: 'wrap',
    display?: 'none'
}
export default class AIOConvert {
    excel2json = (file: any, successCallback: (jsonData: any,columns:any[]) => void, errorCallback: (message: string) => void,getColumn?:(field:string)=>any) => {
        const reader = new FileReader();
        reader.onload = async function (e: any) {
            try {
                const data = new Uint8Array(e.target.result), workbook: any = new ExcelJS.Workbook();
                await workbook.xlsx.load(data);
                const worksheet = workbook.getWorksheet(1), jsonData: any = [];
                let headers: any = [];
                let columns:any[] = [];
                worksheet.eachRow((row: any, rowIndex: any) => {
                    if (rowIndex === 1) { 
                        headers = row.values; 
                        if(getColumn){columns = row.values.map((field:string)=>getColumn(field))}
                    }
                    else {
                        const rowData: any = {};
                        row.values.forEach((value: any, colIndex: any) => {
                            const header = headers[colIndex];
                            if (header) { rowData[header] = value; }
                        });
                        jsonData.push(rowData);
                    }
                });
                successCallback(jsonData,columns);
            }
            catch (error: any) { errorCallback(error); }
        };
        reader.onerror = function (error: any) { errorCallback(error); };
        reader.readAsArrayBuffer(file);
    }
    getExcelBorderStyle = (cssBorder: string): { style: 'thin' | 'medium' | 'thick', color: { argb: string } } => {
        const [borderWidth, borderStyle, borderColor] = cssBorder.split(' ');
        let px = +borderWidth;
        if (px < 1) { px = 1 }
        else if (px > 3) { px = 3 }
        const sizeStr = ['thin', 'medium', 'thick'][px - 1] as 'thin' | 'medium' | 'thick'
        return { style: sizeStr, color: { argb: this.cssToARGB(borderColor) } }
    }
    setExcelCellStyle = (cell: any, style: I_excelStyle) => {
        if (style.background) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.cssToARGB(style.background) } };
        }
        let font: { bold?: boolean, name?: string, size?: number, color?: { argb: string } } = {}
        let hasFont = false;
        if (style.fontWeight === 'bold') { font.bold = true; hasFont = true; }
        if (style.fontFamily) { font.name = style.fontFamily; hasFont = true; }
        if (style.fontSize) { font.size = style.fontSize; hasFont = true; }
        if (style.color) { font.color = { argb: this.cssToARGB(style.color) }; hasFont = true; }
        if (hasFont) { cell.font = font }

        let border: {
            top?: { style: string, color: { argb: string } },
            left?: { style: string, color: { argb: string } },
            bottom?: { style: string, color: { argb: string } },
            right?: { style: string, color: { argb: string } },
        } = {}
        let hasBorder = false;
        if (style.borderTop) { border.top = this.getExcelBorderStyle(style.borderTop); hasBorder = true; }
        if (style.borderBottom) { border.bottom = this.getExcelBorderStyle(style.borderBottom); hasBorder = true; }
        if (style.borderLeft) { border.left = this.getExcelBorderStyle(style.borderLeft); hasBorder = true; }
        if (style.borderRight) { border.right = this.getExcelBorderStyle(style.borderRight); hasBorder = true; }
        if (hasBorder) { cell.border = border }

        let align: { horizontal?: 'center' | 'left' | 'right', vertical?: 'middle' | 'top' | 'bottom', wrapText?: boolean } = {}
        let hasAlign = false;
        if (style.alignItems) { align.vertical = { 'center': 'middle', 'flex-start': 'top', 'flex-end': 'bottom' }[style.alignItems] as any; hasAlign = true }
        if (style.justifyContent) { align.vertical = { 'center': 'center', 'flex-start': 'left', 'flex-end': 'right' }[style.justifyContent] as any; hasAlign = true }
        if (style.flexWrap === 'wrap') { align.wrapText = true }
        if (hasAlign) { cell.alignment = align }
        if (style.display === 'none') { cell.hidden = true }

    }
    downloadFile = (file: any, fileName?: string) => {
        const blob = new Blob([file], { type: 'application/octet-stream' });
        if (!fileName) {
            let pr = window.prompt('نام فایل جدید را وارد کنید')
            pr = !pr || pr === null ? 'untitle' : pr
            fileName = pr
        }
        saveAs(blob, `${fileName}.xlsx`);
    }
    cssToARGB = (cssColor: string) => {
        let alpha = 'FF';
        if (cssColor.startsWith('#')) {
            let hex = cssColor.replace('#', '');
            if (hex.length === 3) {
                hex = hex.split('').map(ch => ch + ch).join('');
            }
            return alpha + hex.toUpperCase();
        } else if (cssColor.startsWith('rgb')) {
            const match = cssColor.match(/\d+/g);
            if (match) {
                const [r, g, b] = match.map(num => parseInt(num).toString(16).padStart(2, '0'));
                return alpha + r.toUpperCase() + g.toUpperCase() + b.toUpperCase();
            }
        }
        return ''
    }
    getTemplateByKeys = (p: { keys: I_key[], type: 'en' | 'fa', successCallback?: (file: any) => void }) => {
        let jsonRow: any = {};
        for (let key of p.keys) {
            const v = key[p.type];
            if(v !== undefined){jsonRow[v] = key.defaultValue === undefined ? '' : key.defaultValue}
        }
        this.json2excel({
            jsonData: [jsonRow], successCallback: (file) => {
                if (p.successCallback) { p.successCallback(file) }
                else { this.downloadFile(file) }
            }
        })
    }
    fix = (key: string) => {
        try { key = key.replace(/['"]/g, ''); } catch { }
        try { key = key.trim(); } catch { }
        return key
    }
    fixRowKeys = (row: any) => {
        let res: any = {}
        for (let prop in row) { res[this.fix(prop)] = row[prop] }
        return res
    }
    convertJson = (p: I_convertJsonParam) => {
        const { jsonData, keys, from, to, extend = (row) => row } = p;
        return jsonData.map((row: any, i: number) => {
            row = this.fixRowKeys(row)
            let res: any = {}
            for (let j = 0; j < keys.length; j++) {
                const key = keys[j],f = key[from],t = key[to];
                if(t === undefined || f === undefined){continue}
                let cellValue = row[f];
                cellValue = cellValue === undefined ? p.nullValue : cellValue
                res[t] = cellValue
            }
            res = extend(res, i)
            return res
        })
    }
    json2excel(p: { jsonData: any,trans?:(v:string)=>string, styleList?: { recordIndex: number, field: string, style?: I_excelStyle }[], successCallback: (file: any) => void }) {
        const {trans = (v)=>v} = p;
        function getFieldColumnIndex(jsonRow: any, field: string) { return Object.keys(jsonRow).indexOf(field); }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        worksheet.columns = Object.keys(p.jsonData[0]).map((key) => ({ header: trans(key), key }));
        p.jsonData.forEach((row: any) => worksheet.addRow(row));
        (p.styleList || []).forEach(({ recordIndex, field, style }) => {
            const columnIndex = getFieldColumnIndex(p.jsonData[0], field) + 1;
            const cell = worksheet.getRow(recordIndex + 1).getCell(columnIndex);
            if (style) { this.setExcelCellStyle(cell, style) }
        });
        workbook.xlsx.writeBuffer().then((buffer: any) => {
            p.successCallback(buffer);
        });
    }
}