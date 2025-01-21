const data = [
    {
        'تعداد مرسولات': 3,
        'فرستنده': 'نیما شریفی',
        'کد ملی فرستنده': '0386481784',
        'کد پستی فرستنده': '1992683913',
        'تلفن ثابت فرستنده': '88050006',
        'تلفن همراه فرستنده': '09123534314',
        'آدرس فرستنده': 'تهران شیخ بهایی شمالی نوربخش پلاک 30 ئاحد 4'
    },
    {
        'قبول از مقر فرستنده': 'بله',
        'نوع مرسوله': 'بسته زیر 1 کیلو',
        'کارتن': 'کارتن سایز 3',
        'وزن': '250',
        'نحوه پرداخت وجه': 'نسیه',
        'نوع مشتری': 'حقوقی',
        'نوع بسته': 'قابل تفکیک',
        'گیرنده': 'امیر حسنی',
        'کد ملی گیرنده': '',
        'کد پستی گیرنده': '',
        'تلفن ثابت گیرنده': '',
        'تلفن همراه گیرنده': '09308605917',
        'آدرس گیرنده': 'آدرس بر روی مرسوله درج شده است - کلانتری',
        'کد تخفیف': '',
        'کد قرارداد': '',
        'نوع قرارداد': '',
        'آگهی تحویل فیزیکی': '',
        'آگهی تحویل الکترونیک': '',
        'اشیا شکستنی': '',
        'خارج از اندازه': '',
        'حاوی مایعات': '',
        'تحویل در مقابل بها': '',
        'شناسه الکترونیک': '',
        'سرویس SMS': '',
        'نوع بیمه': '',
        'مبلغ اظهار شده': '2500000',
        'محتویات مرسوله': '',
        'ارزش محتوی به SDR': '',
        'نوع مقصد': 'شهری(F10)',
        'کد مقصد': '',
        'استان مقصد': '',
        'شهر مقصد': 'حاجی آباد',
        'کشور مقصد': ''
    }
]

class AS {
    fixedFields = ['تعداد مرسولات', 'فرستنده', 'کد ملی فرستنده', 'کد پستی فرستنده', 'تلفن ثابت فرستنده', 'تلفن همراه فرستنده', 'آدرس فرستنده']
    fields = [
        'قبول از مقر فرستنده',
        'نوع مرسوله',
        'کارتن',
        'وزن',
        'نحوه پرداخت وجه',
        'نوع مشتری',
        'نوع بسته',
        'گیرنده',
        'کد ملی گیرنده',
        'کد پستی گیرنده',
        'تلفن ثابت گیرنده',
        'تلفن همراه گیرنده',
        'آدرس گیرنده', 'کد تخفیف',
        'کد قرارداد', 'نوع قرارداد', 'آگهی تحویل فیزیکی', 'آگهی تحویل الکترونیک', 'اشیا شکستنی', 'خارج از اندازه', 'حاوی مایعات', 'تحویل در مقابل بها', 'شناسه الکترونیک',
        'سرویس SMS', 'نوع بیمه', 'مبلغ اظهار شده', 'محتویات مرسوله', 'ارزش محتوی به SDR', 'نوع مقصد', 'کد مقصد', 'استان مقصد', 'شهر مقصد', 'کشور مقصد'
    ]
    data = []
    collections = []
    collectionIndex = 0;
    executedIndexes = [];
    maxCredit = Infinity;
    remainCredit = Infinity;
    timer = 0;
    token = '';
    //loginUrl = 'http://192.168.88.39:7990/api/extension/client-validation';
    loginUrl = 'https://extension.boxisoft.ir/api/extension/client-validation';
    submitUrl = `https://extension.boxisoft.ir/api/extension/client-submission-status`
    constructor() {
        setTimeout(() => this.init(), this.timer)
    }
    init = async () => {
        this.login() 
    }
    login = () => {
        const userName = window.prompt('نام کاربری را وارد کنید')
        if (!userName || userName === null) { this.login() }
        else { this.loginReq(userName) }
    }
    loginReq = (userName) => {
        const data = { "clientId": userName }
        fetch(this.loginUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
            .then((response) => {
                if (response.ok !== true) { throw new Error(`HTTP error! Status: ${response.status}`) }
                else { return response.json(); }
            })
            .then((result) => {
                if (result.status === 200) {
                    const { maxCredit, remainCredit, token } = result.data
                    this.maxCredit = maxCredit;
                    this.remainCredit = remainCredit;
                    this.token = token;
                    this.startApp()
                }
                else { alert(result.message) }
            })
            .catch((error) => { alert('Error:', error) });
    }
    startApp = () => {
        const html = (`
            <div class="msf-upload">
                <label class="msf-button-3" for="msf-file">
                    بارگزاری فایل اکسل
                    <input type="file" id="msf-file" />
                </label>
            </div>    
        `)
        document.getElementById("msf-upload-container").innerHTML = html;
        setTimeout(() => {
            this.load()
            this.inputFileEvent(); this.exitEvent(); this.tableNumberEvents(); this.startEvent(); this.settingEvents()
        }, 5)
    }
    getAppData = () => {
        return {
            collections: this.collections,
            collectionIndex: this.collectionIndex,
            executedIndexes: this.executedIndexes
        }
    }
    setAppData = (appdata, reRender) => {
        this.collections = appdata.collections;
        this.collectionIndex = appdata.collectionIndex;
        this.executedIndexes = appdata.executedIndexes;
        if (reRender) (this.reRender())
    }
    load = () => {
        chrome.storage.local.get(['appdata'], (result) => {
            if (result.appdata) { this.setAppData(result.appdata, true) }
            else { this.save() }
        });
    }
    save = () => {
        const appdata = this.getAppData();
        chrome.storage.local.set({ appdata }, (result) => {
            console.log('Data saved');
        });
    }
    reset = () => {
        if (this.collectionIndex === 0 && !this.collections.length && !this.executedIndexes.length) { return }
        const approve = window.confirm('از حذف جدول های موجود در حافظه اطمینان دارید ؟')
        if (approve === true) {
            const def = {
                collections: [],
                collectionIndex: 0,
                executedIndexes: []
            }
            chrome.storage.local.set({ appdata: def });
            this.setAppData(def, true)
        }
    }
    openModal = () => {
        alert('opne modal')
    }
    closeModal = () => {

    }
    start = () => {
        const { fixedRow, rows } = this.collections[this.collectionIndex];
        if (rows.length > this.remainCredit) {
            alert('شما اعتبار کافی برای انجام این عملیات ندارید')
            return
        }
        chrome.runtime.sendMessage({ action: "fillForm", data: { fixedRow, rows, token: this.token, submitUrl: this.submitUrl } });
        this.setExe()
    }
    setExe = () => {
        this.executedIndexes.push(this.collectionIndex);
        this.reRender();
    }
    workbook2excel = async (workbook, styleList) => {
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) { return { success: false, result: 'cannot file worksheet' } }
        // const headers = this.getHeaders(worksheet);
        // const dic = {};
        // for(let i = 0; i < headers.length; i++){dic[headers[i]] = i}
        // (styleList || []).forEach(({ rowIndex, field, style }) => {
        //     const columnIndex = dic[field] + 1;
        //     const cell = worksheet.getRow(rowIndex + 1).getCell(columnIndex);
        //     if (style) { this.excelStyle.setCellStyle(cell, style) }
        // });
        try {
            const buffer = await workbook.xlsx.writeBuffer();
            return { success: true, result: buffer };
        }
        catch (err) { return { success: false, result: err.message }; }
    }
    setCellErrorStyle = (row, cellIndex) => {
        const cell = row.getCell(cellIndex);
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF0000' },
        };
    }
    checkIsNaN = (v) => {
        return isNaN(+v) || !(+v)
    }
    checkFixedRow = (addedRow, row) => {
        const dic = {
            'تعداد مرسولات': () => {
                const key = 'تعداد مرسولات'
                const v = row[key];
                if (this.checkIsNaN(v)) { this.setCellErrorStyle(row, 1); return true }
            },
            'کد ملی فرستنده': () => {
                const key = 'کد ملی فرستنده'
                const v = row[key];
                if (!v || v.length !== 10) { this.setCellErrorStyle(addedRow, 3); return true }
            },
            'کد پستی فرستنده': () => {
                const key = 'کد پستی فرستنده'
                const v = row[key];
                if (!v || v.length !== 10) { this.setCellErrorStyle(addedRow, 4); return true }
            },
            'تلفن همراه فرستنده': () => {
                const key = 'تلفن همراه فرستنده'
                const v = row[key];
                if (!v || v.length !== 11 || v.indexOf('09') !== 0) { this.setCellErrorStyle(addedRow, 6); return true }
            },
            'آدرس فرستنده': () => {
                const key = 'آدرس فرستنده'
                const v = row[key];
                if (!v) { this.setCellErrorStyle(addedRow, 7); return true }
            }
        }
        let hasError = false
        for (let i = 0; i < this.fixedFields.length; i++) {
            const field = this.fixedFields[i];
            if (dic[field]) {
                const res = dic[field]()
                if (res === true) { hasError = true }
            }
        }
        return hasError
    }
    checkRow = (addedRow, row) => {
        const dic = {
            'نوع مرسوله': () => {
                const key = 'نوع مرسوله'
                const v = row[key];
                const dic = { 'نامه': true, 'پاکت جوف': true, 'بسته زیر 1 کیلو': true, 'بسته بالای 1 کیلو': true }
                if (dic[v] !== true) { this.setCellErrorStyle(addedRow, 2); return true }
            },
            'کارتن': () => {
                const key = 'کارتن'
                const v = row[key];
                const noeMarsoole = row['نوع مرسوله']
                const dic = { 'بسته زیر 1 کیلو': true, 'بسته بالای 1 کیلو': true }
                if (dic[noeMarsoole] === true) {
                    const dic1 = {
                        'کارتن سایز 1': true, 'کارتن سایز 2': true, 'کارتن سایز 3': true, 'کارتن سایز 4': true, 'کارتن سایز 5': true, 'کارتن سایز 6': true,
                        'کارتن سایز 7': true, 'کارتن سایز 8': true, 'کارتن سایز 9': true, 'کارتن بالاتر از سایز 9': true, 'لفاف غیرمتعارف': true
                    }
                    if (dic1[v] !== true) { this.setCellErrorStyle(addedRow, 3); return true }
                }
            },
            'وزن': () => {
                const key = 'وزن'
                const v = row[key];
                if (this.checkIsNaN(v)) { this.setCellErrorStyle(addedRow, 4); return true }
            },
            'نحوه پرداخت وجه': () => {
                const key = 'نحوه پرداخت وجه'
                const v = row[key];
                // const dic = { 'نسیه': true, 'پوز': true, 'فیش پیگیری پوز': true, 'نقدی': true }
                // if (dic[v] !== true) { this.setCellErrorStyle(addedRow, 5); return true }
                if (v !== 'نقدی') { this.setCellErrorStyle(addedRow, 5); return true }
            },
            'نوع مشتری': () => {
                const key = 'نوع مشتری'
                const v = row[key];
                const dic = { 'حقیقی(ایرانی)': true, 'حقوقی': true, 'حقیقی(اتباع خارجی)': true }
                if (!!v && dic[v] !== true) { this.setCellErrorStyle(addedRow, 6); return true }
            },
            'کد ملی گیرنده': () => {
                const key = 'کد ملی گیرنده'
                const v = row[key];
                if (v) {
                    if (v.length !== 10) { this.setCellErrorStyle(addedRow, 9); return true }
                }

            },
            'کد پستی گیرنده': () => {
                const key = 'کد پستی گیرنده'
                const v = row[key];
                if (v) {
                    if (v.length !== 10) { this.setCellErrorStyle(addedRow, 10); return true }
                }

            },
            'تلفن همراه گیرنده': () => {
                const key = 'تلفن همراه گیرنده'
                const v = row[key];
                if (!v || v.length !== 11 || v.indexOf('09') !== 0) { this.setCellErrorStyle(addedRow, 12); return true }
            }
        }
        let hasError = false
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            if (dic[field]) { if (dic[field]() === true) { hasError = true } }
        }
        return hasError
    }
    validateCollections = async (collections) => {
        // type I_collection = {
        //     fixedRow:{[key:I_fixedRowKey]:string | number},
        //     rows:{[key:I_rowKey]:string | number}[]
        // }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        let hasError = false
        for (let i = 0; i < collections.length; i++) {
            const { fixedRow, rows } = collections[i];
            worksheet.addRow(this.fixedFields);
            const fixedRowValues = this.fixedFields.map((o) => fixedRow[o])
            const addedFixedRow = worksheet.addRow(fixedRowValues);
            const checkResult = this.checkFixedRow(addedFixedRow, fixedRow)
            if (checkResult) { hasError = true }
            worksheet.addRow(this.fields);
            for (let j = 0; j < rows.length; j++) {
                let row = rows[j]
                const addedRow = worksheet.addRow(this.fields.map((o) => row[o]));
                const checkResult = this.checkRow(addedRow, row)
                if (checkResult) { hasError = true }
            }
        }
        if (hasError) {
            const { result } = await this.workbook2excel(workbook)
            return { excel: result, hasError: true }
        }
        else {
            return { excel: undefined, hasError: false }
        }

    }
    downloadFile = (file, fileName) => {
        const blob = new Blob([file], { type: 'application/octet-stream' });
        if (!fileName) {
            let pr = window.prompt('نام فایل جدید را وارد کنید')
            pr = !pr || pr === null ? 'untitle' : pr
            fileName = pr
        }
        saveAs(blob, `${fileName}.xlsx`);
    }
    loadData = async (data) => {
        const collections = this.getCollections(data);
        const { excel, hasError } = await this.validateCollections(collections)
        if (hasError) {
            alert('در فایل اکسل خطا دیده شد. فایل اکسل با خطا های مشخص شده دانلود شد. آن را بررسی کنید و سلول های قرمز رنگ رو بررسی کنید')
            this.downloadFile(excel)
        }
        else {
            this.collections = collections;
            this.reRender();
        }
    }
    settingEvents = () => {
        // document.getElementById("msf-setting").addEventListener('click', async (e) => {
        //     this.openModal()
        // })
        // document.getElementById("msf-setting-close").addEventListener('click', async (e) => {
        //     this.closeModal()
        // })
    }
    inputFileEvent = (e) => {
        document.getElementById("msf-file").addEventListener('change', async (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = async (event) => {
                const ab = event.target.result;
                const wb = new ExcelJS.Workbook();
                await wb.xlsx.load(ab);
                let sheetName = window.prompt('نام شیت اکسل را وارد کنید')
                if (typeof sheetName !== 'string' || !sheetName) { sheetName = 'Sheet1' }
                const ws = wb.getWorksheet(sheetName);
                if (!ws) {
                    alert('در فایل اکسل آپلود شده شیت با این نام موجود نیست');
                    window.location.reload();
                    return
                }
                const data = [];
                ws.eachRow((row, rowIndex) => data.push(row.values.slice(1)));
                await this.loadData(data)
            };
            reader.readAsArrayBuffer(file);
        })
    }
    startEvent = () => document.getElementById("msf-start").addEventListener('click', async (e) => this.start())
    exitEvent = () => document.getElementById("msf-exit").addEventListener('click', async (e) => this.reset())
    tableNumberEvents = () => {
        document.getElementById("msf-next").addEventListener('click', async (e) => {
            if (!this.collections.length) { return }
            const newIndex = this.collectionIndex + 1;
            if (newIndex > this.collections.length - 1) { return }
            this.collectionIndex = newIndex;
            this.reRender();
        })
        document.getElementById("msf-prev").addEventListener('click', async (e) => {
            if (!this.collections.length) { return }
            const newIndex = this.collectionIndex - 1;
            if (newIndex < 0) { return }
            this.collectionIndex = newIndex;
            this.reRender();
        })
    }
    getCollections = (data) => {
        const collections = [];
        let fixedRowTitles;
        let rowsTitles;
        for (const row of data) {
            if (row.includes('تعداد مرسولات')) {
                fixedRowTitles = row;
                rowsTitles = undefined
            }
            else if (!!fixedRowTitles) {
                collections.push({ fixedRow: {}, rows: [] })
                for (let i = 0; i < fixedRowTitles.length; i++) {
                    const key = fixedRowTitles[i], value = row[i];
                    const lc = collections.at(-1);
                    lc.fixedRow[key] = value;
                }
                fixedRowTitles = undefined;
            }
            else if (row.includes('وزن')) { rowsTitles = row; }
            else if (!!rowsTitles) {
                const lc = collections.at(-1);
                lc.rows.push({})
                for (let i = 0; i < rowsTitles.length; i++) {
                    lc.rows.at(-1)[rowsTitles[i]] = row[i];
                }
            }
        }
        return collections
    }
    readClipBoard = async () => await navigator.clipboard.readText()
    isExe = () => this.executedIndexes.includes(this.collectionIndex)
    reRender = () => {
        let fixedRowTable, rowsTable, isExe, tableNumber;
        const collection = this.collections[this.collectionIndex]
        if (collection) {
            const { fixedRow, rows } = collection;
            fixedRowTable = this.getFixedRowTable(fixedRow);
            rowsTable = this.getRowsTable(rows);
            isExe = this.executedIndexes.includes(this.collectionIndex)
            tableNumber = `جدول شماره ${this.collectionIndex + 1}`
            document.getElementById("msf-container-footer").style.display = 'flex';
            document.getElementById("msf-exit").style.display = 'block';
            document.getElementById("msf-upload-container").style.display = 'none';
        }
        else {
            fixedRowTable = '';
            rowsTable = '';
            isExe = false;
            tableNumber = '';
            document.getElementById("msf-container-footer").style.display = 'none';
            document.getElementById("msf-exit").style.display = 'none';
            document.getElementById("msf-upload-container").style.display = 'flex';
        }
        this.save();
        document.getElementById("msf-subtitle").innerHTML = `اعتبار باقیمانده ${this.remainCredit} ثبت اتوماتیک از ${this.maxCredit} تا`;
        document.getElementById("msf-is-exe").innerHTML = isExe ? 'این عملیات انجام شده است' : '';
        document.getElementById("msf-start").innerHTML = isExe ? 'انجام مجدد عملیات' : 'شروع عملیات';
        document.getElementById("msf-container-body").innerHTML = fixedRowTable + rowsTable;
        document.getElementById("msf-table-number").innerHTML = tableNumber;
    }
    getFixedRowTable = () => {
        const collection = this.collections[this.collectionIndex];
        if (!collection) { return '' }
        const { fixedRow } = collection;
        const table = (`
            <table id="msf-fixed-table" style="border-collapse: collapse;">
                <thead><tr>${this.fixedFields.map((field) => `<th class="msf-table-title">${field}</th>`).join("")}</tr></thead>
                <tbody>${this.renderFixedRow(fixedRow)}</tbody>
            </table>    
        `)
        return table
    }
    getRowsTable = () => {
        const { rows } = this.collections[this.collectionIndex];
        const table = (`
            <div class="rows-table-container">
                <table style="border-collapse: collapse;">
                    <thead><tr>${this.fields.map((field) => `<th class="msf-table-title">${field}</th>`).join("")}</tr></thead>
                    <tbody>${rows.map((row) => this.renderRow(row)).join("")}</tbody>
                </table>    
            </div>
        `)
        return table
    }
    maxLength = (v, l) => {
        if (typeof v === 'string' && l && v.length > l) {
            v = v.slice(0, l)
        }
        return v
    }
    renderFixedRow = (fixedRow) => `<tr>${this.fixedFields.map((field) => `<td class="msf-table-title">${fixedRow[field] === undefined ? '---' : this.maxLength(fixedRow[field], 15)}</td>`).join("")}</tr>`
    renderRow = (row) => `<tr>${this.fields.map((field) => `<td>${row[field] === undefined ? '---' : row[field]}</td>`).join("")}</tr>`
}
new AS()