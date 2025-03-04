import AIOApis from "../../npm/aio-apis";
import { I_filter, I_serverFilter } from "./types";

export default class Apis extends AIOApis {
    base_url: string;
    constructor(p: { base_url: string, token: string }) {
        super({
            id: 'freelancer',
            lang: 'fa',
            token: p.token,
            handleErrorMessage: () => {
                return 'error'
            },
            headers:{

            }
        })
        this.base_url = p.base_url
    }
    getGridServerFilter = (filter: I_filter):I_serverFilter => {
        const a = {
            "name": "string",
            "personelCode": "string",
            "nationalCode": "string",
            "mobile": "string",
            "email": "string",
            "isActive": true,
            "username": "string",
            "selectHub": {
                "id": 0,
                "text": "string"
            },
            "hublist": [
                {
                    "id": 0,
                    "value": "string",
                    "label": "string",
                    "parent": 0
                }
            ],
            "employeeType": "0"
        }
        const res: I_serverFilter = {
            hublist:[
                {id:filter.hubId}
            ]
        }
        if (filter.noeHamkari) {res.employeeType = filter.noeHamkari}
        if (filter.name) {res.name = filter.name}
        if (filter.faal) {res.isActive = filter.faal}
        if (filter.advanced?.mobile) {res.mobile = filter.advanced.mobile}
        if (filter.advanced?.codeMelli) {res.email = filter.advanced.codeMelli}
        return res 
    }
    enums = async () => {
        const url = `${this.base_url}/core-api/common/common-objects?includeProvinces=true&includeCities=true&includeHubs=true&includeSexType=true&includeVehicleTypes=true&includeEmployeeTypes=true&includeVehicleVendor=true&includeVehicleMakes=true`
        const { response, success } = await this.request<any>({
            name: 'enums',
            method: 'get',
            description: 'دریافت اطلاعات اولیه',
            url,
            cache: { name: 'enums', expiredIn: new Date().getTime() + 100000000000 }
        })
        if (success) {
            return response.data.response
        }
        else { return false }
    }
    grid = async (filter:I_filter) => {
        const body = this.getGridServerFilter(filter)
        const { response, success } = await this.request<any>({
            name:'grid',
            method: 'post',
            description: 'دریافت اطلاعات جدول پرسنل',
            url: `${this.base_url}/resource-api/employee/filter?pageNumber=${1}&pageSize=${10}`,
            body
        })
        debugger
    }
}