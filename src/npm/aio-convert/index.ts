import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

type I_key = { fa?: string, en?: string, defaultValue: any, nullValue?: (index: number) => any }
type I_convertJsonParam = { jsonData: any, keys: I_key[], from: 'en' | 'fa', to: 'en' | 'fa', extend?: (row: any, index: number) => any }
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
class AIOConvert {
    excelStyle: ExcelStyle = new ExcelStyle()
    file2workbook = async (file: any): Promise<{ success: boolean, result: any }> => {
        return new Promise<{ success: boolean, result: any }>(async (resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e: any) => {
                try {
                    const data = new Uint8Array(e.target.result), workbook: any = new ExcelJS.Workbook();
                    await workbook.xlsx.load(data);
                    resolve({ success: true, result: workbook });
                }
                catch (error: any) { reject({ success: false, result: `Error processing Excel file: ${error.message || error}` }) }
            };
            reader.onerror = function (error: any) { reject({ success: false, result: `File reading error: ${error.message || error}` }) }
            reader.readAsArrayBuffer(file);
        })
    }
    file2worksheet = async (file: any): Promise<{ success: boolean, result: any }> => {
        const {success,result} = await this.file2workbook(file);
        if(success === false){return {success:false,result}}
        const worksheet = result.getWorksheet(1);
        return {success:true,result:worksheet} 
    }
    getHeaders = (worksheet: ExcelJS.Worksheet):string[] => {
        const headers = worksheet.getRow(1).values;
        if (!Array.isArray(headers)) { return [] }
        return headers.slice(1).map((o: any) => o === undefined ? '' : o.toString()); // حذف index 0
    }
    getJson = (worksheet: ExcelJS.Worksheet): { headers: string[], jsonData: any } => {
        let jsonData: any = [];
        const headers = this.getHeaders(worksheet)
        worksheet.eachRow((row: any, rowIndex: any) => {
            if (rowIndex > 1) {
                const rowData: any = {};
                row.values.forEach((value: any, colIndex: any) => {
                    const header = headers[colIndex];
                    if (header) { rowData[header] = value; }
                });
                jsonData.push(rowData);
            }
        });
        return { headers, jsonData }
    }
    excel2json = async (file: any): Promise<{ success: boolean, result: any }> => {
        const { success, result } = await this.file2worksheet(file)
        if (success === false) { return {success:false,result} }
        const { jsonData } = this.getJson(result)
        return {success:true,result:jsonData}
    }
    validateHeaders = (headers: string[], columns: string[]): string[] => {
        const errors: string[] = [];
        columns.forEach(column => {
            if (!headers.includes(column)) {
                let same = headers.find((ec) => column.replace(/\s+/g, '') === ec.replace(/\s+/g, ''))
                const styleStr = 'style="background: #b7b7b750;padding: 6px;border-radius: 6px;font-size: 10px;margin-bottom:3px;"'
                if (same) {
                    const str1 = 'در فایل اکسل ستون'
                    const str2 = `<highlight style='background:#ff000038;'>"${same}"</highlight>`
                    const str3 = `باید با ستون`
                    const str4 = `<highlight style='background:#00ff5a38;'>"${column}"</highlight>`
                    const str5 = `جایگزین شود`
                    errors.push(`<li ${styleStr}>${str1} ${str2} ${str3} ${str4} ${str5}</li>`)
                }
                else { errors.push(`<li ${styleStr}>ستون "${column}" در فایل اکسل موجود نیست.</li>`); }
            }
        });
        return errors
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
    getTemplateByKeys = async (p: { keys: I_key[], type: 'en' | 'fa'}) => {
        let jsonRow: any = {};
        for (let key of p.keys) {
            const v = key[p.type];
            if (v !== undefined) { jsonRow[v] = key.defaultValue === undefined ? '' : key.defaultValue }
        }
        return await this.json2excel([jsonRow])
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
                const key = keys[j], f = key[from], t = key[to];
                const { nullValue = () => null } = key;
                if (t === undefined || f === undefined) { continue }
                let cellValue = row[f];
                cellValue = cellValue === undefined ? nullValue(i) : cellValue
                res[t] = cellValue
            }
            res = extend(res, i)
            return res
        })
    }
    excel2excel = async (file:any,styleList?:{ rowIndex: number, field: string, style?: I_excelStyle }[]):Promise<{success:boolean,result:any}>=>{
        const {success,result} = await this.file2workbook(file);
        if(success === false){return {success:false,result}}
        const workbook = result;
        const excel = await this.workbook2excel(workbook,styleList)
        return {success:true,result:excel}
    }
    workbook2excel = async (workbook: ExcelJS.Workbook,styleList?:{ rowIndex: number, field: string, style?: I_excelStyle }[]): Promise<{ success: boolean; result: any }> => {
        const worksheet = workbook.getWorksheet(1);
        if(!worksheet){return {success:false,result:'cannot file worksheet'}}
        const headers = this.getHeaders(worksheet);
        const dic:{[key:string]:number} = {};
        for(let i = 0; i < headers.length; i++){dic[headers[i]] = i}
        (styleList || []).forEach(({ rowIndex, field, style }) => {
            const columnIndex = dic[field] + 1;
            const cell = worksheet.getRow(rowIndex + 1).getCell(columnIndex);
            if (style) { this.excelStyle.setCellStyle(cell, style) }
        });
        try {
            const buffer = await workbook.xlsx.writeBuffer();
            return { success: true, result: buffer };
        } 
        catch (err: any) {return { success: false, result: err.message };}
    };
    json2excel = async (jsonData: any, styleList?: { rowIndex: number, field: string, style?: I_excelStyle }[]):Promise<{success:boolean,result:any}> => {
        return new Promise<{success:boolean,result:any}>(async (resolve, reject) => {
            try {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Sheet1');
                const dic: { [key: string]: number } = {};
                worksheet.columns = Object.keys(jsonData[0]).map((key, i) => {
                    dic[key] = i;
                    return { header: key, key }
                });
                jsonData.forEach((row: any) => worksheet.addRow(row));
                const {success,result} = await this.workbook2excel(workbook,styleList);
                if(success === false){reject({success:false,result})}
                else {resolve({success:true,result})}
            }
            catch(err:any){reject({success:false,result:err.message})}
        })
    }
}
export default AIOConvert;


class ExcelStyle {
    private cssToARGB = (cssColor: string) => {
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
    private getExcelBorderStyle = (cssBorder: string): { style: 'thin' | 'medium' | 'thick', color: { argb: string } } => {
        const [borderWidth, borderStyle, borderColor] = cssBorder.split(' ');
        let px = +borderWidth;
        if (px < 1) { px = 1 }
        else if (px > 3) { px = 3 }
        const sizeStr = ['thin', 'medium', 'thick'][px - 1] as 'thin' | 'medium' | 'thick'
        return { style: sizeStr, color: { argb: this.cssToARGB(borderColor) } }
    }
    setCellStyle = (cell: any, style: I_excelStyle) => {
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
}