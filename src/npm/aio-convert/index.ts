import ExcelJS, { CellValue } from 'exceljs';
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
    worksheet2json = (worksheet: ExcelJS.Worksheet): { [key: string]: any } => {
        let headers: any = [];
        const jsonData:{[key:string]:any} = []
        worksheet.eachRow((row: any, rowIndex: any) => {
            if (rowIndex === 1) { headers = row.values; }
            else {
                const rowData: any = {};
                row.values.forEach((value: any, colIndex: any) => {
                    const header = headers[colIndex];
                    if (header) { rowData[header] = value; }
                });
                jsonData.push(rowData);
            }
        });
        return jsonData
    }
    excel2workbook = async (file: any): Promise<ExcelJS.Workbook | string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e: any) => {
                try {
                    const data = new Uint8Array(e.target.result)
                    const workbook: any = new ExcelJS.Workbook();
                    await workbook.xlsx.load(data);
                    resolve(workbook)
                }
                catch (err:any) { reject(err.message) }
            };
            reader.onerror = function (error: ProgressEvent<FileReader>) { reject({ success: false, result: error.target?.error?.message }) };
            reader.readAsArrayBuffer(file);
        })
    }
    excel2json = async (file: any): Promise<{ [key: string]: any } | string> => {
        const workbook = await this.excel2workbook(file);
        if (typeof workbook === 'string') { return workbook }
        const worksheet = workbook.getWorksheet(1)
        if(!worksheet){return 'worksheet not found'}
        const json = this.worksheet2json(worksheet)
        return json
    }
    workbook2worksheet = (workbook: ExcelJS.Workbook, sheetName?: string) => {
        if (sheetName) { return workbook.addWorksheet(sheetName); }
        else { return workbook.getWorksheet(1) }
    }
    traceWorksheetRows = (worksheet: ExcelJS.Worksheet, fn: (p: { row: any, values: any[], rowIndex: number }) => void) => {
        worksheet.eachRow((row: any, rowIndex: any) => fn({ row, values: row.values, rowIndex }));
    }
    json2workbook(jsonData: any): ExcelJS.Workbook {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        worksheet.columns = Object.keys(jsonData[0]).map((key) => ({ header: key, key }));
        jsonData.forEach((row: any) => worksheet.addRow(row));
        return workbook
    }
    getRowByIndex = (worksheet: ExcelJS.Worksheet, rowIndex: number) => {
        return worksheet.getRow(rowIndex + 1)
    }
    getCell = (p: { worksheet: ExcelJS.Worksheet, rowIndex: number, colIndex?: number, field?: string }) => {
        const row = this.getRowByIndex(p.worksheet, p.rowIndex);
        if (p.colIndex !== undefined) { return row.getCell(p.colIndex); }
        if (p.field) {
            const colIndex = Object.keys(row.values).indexOf(p.field);
            return row.getCell(colIndex);
        }
    }
    setCellStyle = (cell: any, style: I_excelStyle) => {
        this.excelStyle.setStyle(cell, style);
        return cell
    }
    workbook2excel = (workbook: ExcelJS.Workbook) => {
        return new Promise((resolve, reject) => {
            workbook.xlsx.writeBuffer()
                .then((buffer: any) => {
                    resolve(buffer);
                })
                .catch((err) => {
                    reject(err.message);
                });
        });
    };
    getExcelColumns = async (file: any):Promise<CellValue[] | string> => {
        const workbook = await this.excel2workbook(file);
        if (typeof workbook === 'string') { return workbook }
        const worksheet = this.workbook2worksheet(workbook);
        if (!worksheet) { return 'worksheet not found' }
        const row = this.getRowByIndex(worksheet, 1)
        if(Array.isArray(row.values)){return row.values}
        return Object.keys(row.values)
    }
    checkExcelColumns = (file: any, columns: (string | undefined)[], successCallback: (errors: string[]) => void, errorCallback: (message: string) => void) => {
        const reader = new FileReader();
        reader.onload = async function (e: any) {
            try {
                const data = new Uint8Array(e.target.result), workbook: any = new ExcelJS.Workbook();
                await workbook.xlsx.load(data);
                const worksheet = workbook.getWorksheet(1), jsonData: any = [];
                const existingColumns: string[] = [];
                worksheet.eachRow((row: any, rowIndex: any) => {
                    if (rowIndex === 1) {
                        row.values.forEach((key: any) => {
                            if (key) {
                                existingColumns.push(key);
                            }
                        });
                    }
                });
                const errors: string[] = [];
                columns.forEach(column => {
                    if (!!column && !existingColumns.includes(column)) {
                        let same = existingColumns.find((ec) => {
                            return column.replace(/\s+/g, '') === ec.replace(/\s+/g, '')
                        })
                        const styleStr = 'style="background: #b7b7b750;padding: 6px;border-radius: 6px;font-size: 10px;margin-bottom:3px;"'
                        if (same) {
                            errors.push(`
                                <li ${styleStr}>در فایل اکسل ستون <highlight style='background:#ff000038;'>"${same}"</highlight> باید با ستون <highlight style='background:#00ff5a38;'>"${column}"</highlight> جایگزین شود</li>
                            `)
                        }
                        else {
                            errors.push(`<li ${styleStr}>ستون "${column}" در فایل اکسل موجود نیست.</li>`);
                        }
                    }
                });
                successCallback(errors)
            }
            catch (error: any) { errorCallback(error); }
        };
        reader.onerror = function (error: any) { errorCallback(error); };
        reader.readAsArrayBuffer(file);
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
    // getTemplateByKeys = (p: { keys: I_key[], type: 'en' | 'fa', successCallback?: (file: any) => void }) => {
    //     let jsonRow: any = {};
    //     for (let key of p.keys) {
    //         const v = key[p.type];
    //         if (v !== undefined) { jsonRow[v] = key.defaultValue === undefined ? '' : key.defaultValue }
    //     }
    //     this.json2excel({
    //         jsonData: [jsonRow], successCallback: (file) => {
    //             if (p.successCallback) { p.successCallback(file) }
    //             else { this.downloadFile(file) }
    //         }
    //     })
    // }
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
    setStyle = (cell: any, style: I_excelStyle) => {
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