import { FC, useState } from "react";
import {Code} from './../../npm/aio-component-utils';
import { AITextarea } from "../../npm/aio-input";
import { ConvertTextToFilters } from "../../npm/aio-utils";
const columns = [
    { title: 'نام', field: 'firstName' },
    { title: 'نام خانوادگی', field: 'lastName' },
    { title: 'شماره همراه', field: 'mobile' },
    { title: 'شهر', field: 'city' },
    { title: 'سن', field: 'age' },
    { title: 'میانگین کارکرد', field: 'workAverage' },
    { title: 'کارکرد ماه', field: 'workMonth' },
]
const columnsCode = `
const columns = [
    {title:'نام',field:'firstName'},
    {title:'نام خانوادگی',field:'lastName'},
    {title:'شماره همراه',field:'firstName'},
    {title:'شهر',field:'firstName'},
    {title:'سن',field:'firstName'},
    {title:'میانگین کارکرد',field:'workAverage'},
    {title:'کارکرد ماه',field:'workMonth'},
]`
const AIFilter: FC<{goToHome:()=>void}> = ({goToHome}) => {
    const [value, setValue] = useState<string>("کارکرد ماه بیشتر یا برابر (میانگین کارکرد یا '240') باشد")
    const res = ConvertTextToFilters(value, columns);
    const code = JSON.stringify(res, null, 4)
    console.log(code)
    return (
        <div className="example">
            <button type='button' onClick={()=>goToHome()}>Go To Home</button>
            {Code(columnsCode)}
            <AITextarea
                rtl={true}
                value={value}
                onChange={(value) => setValue(value)}
            />
            {
                Code(code)
            }
        </div>

    )
}
export default AIFilter


const samples = [
    [
        "کارکرد ماه بیشتر یا برابر (میانگین کارکرد یا '240') باشد",
        `[
            {
                "operator": "moreequal",
                "field": "workMonth",
                "value": [
                    "field_workAverage",
                    "240"
                ]
            }
        ]`
    ]
]

//پیاده سازی بین between


