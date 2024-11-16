import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
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
    excel2json = (file: any, successCallback: (jsonData: any) => void, errorCallback: (message: string) => void) => {
        const reader = new FileReader();
        reader.onload = async function (e: any) {
            try {
                const data = new Uint8Array(e.target.result), workbook: any = new ExcelJS.Workbook();
                await workbook.xlsx.load(data);
                const worksheet = workbook.getWorksheet(1), jsonData: any = [];
                let headers: any = [];
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
                successCallback(jsonData);
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
        return { style: sizeStr, color: { argb: borderColor } }
    }
    setExcelCellStyle = (cell: any, style: I_excelStyle) => {
        if (style.background) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: style.background } };
        }
        let font: { bold?: boolean, name?: string, size?: number, color?: { argb: string } } = {}
        let hasFont = false;
        if (style.fontWeight === 'bold') { font.bold = true; hasFont = true; }
        if (style.fontFamily) { font.name = style.fontFamily; hasFont = true; }
        if (style.fontSize) { font.size = style.fontSize; hasFont = true; }
        if (style.color) { font.color = { argb: style.color }; hasFont = true; }
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
    downloadFile = (file: any,fileName?:string) => {
        const blob = new Blob([file], { type: 'application/octet-stream' });
        if(!fileName){
            let pr = window.prompt('نام فایل جدید را وارد کنید')
            pr = !pr || pr === null?'untitle':pr
            fileName = pr    
        }
        saveAs(blob, `${fileName}.xlsx`);
    }
    json2excel(p: { jsonData: any, styleList?: { rowIndex: number, field: string,style?:I_excelStyle }[], successCallback: (file:any) => void }) {
        function getFieldColumnIndex(jsonRow: any, field: string) { return Object.keys(jsonRow).indexOf(field); }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        worksheet.columns = Object.keys(p.jsonData[0]).map((key) => ({ header: key, key }));
        p.jsonData.forEach((row: any) => worksheet.addRow(row));
        (p.styleList || []).forEach(({ rowIndex, field,style }) => {
            const columnIndex = getFieldColumnIndex(p.jsonData[0], field) + 1;
            const cell = worksheet.getRow(rowIndex + 1).getCell(columnIndex);
            if (style) {this.setExcelCellStyle(cell,style)}
        });
        workbook.xlsx.writeBuffer().then((buffer: any) => {
            p.successCallback(buffer);
        });
    }
}