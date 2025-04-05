import AIOApis from "./../../npm/aio-apis";
import AIODate from "./../../npm/aio-date";
import { I_addEmployeeModel, I_city, I_gridFilter, I_gridServerFilter, I_serverAdd, I_serverEdit } from "./types";

export default class Apis extends AIOApis {
    base_url: string;
    constructor(p: { base_url: string, token: string }) {
        super({
            id: 'freelancer',
            lang: 'fa',
            token: p.token,
            handleErrorMessage: (error) => {
                return error.response.data.messages[0].message
            },
            headers: {

            }
        })
        this.base_url = p.base_url
    }

    getGridServerFilter = (gridFilter: I_gridFilter): I_gridServerFilter => {
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
        const res: I_gridServerFilter = {
            selectHub: { id: 1 },
            isActive: true
        }
        let types: any = []
        if (gridFilter.noeHamkari === 0) { types = [0] }
        else if (gridFilter.noeHamkari === 1) { types = [1] }
        else { types = [0, 1] }
        res.types = types
        if (gridFilter.name) { res.name = gridFilter.name }
        if (gridFilter.isActive) { res.isActive = gridFilter.isActive }
        if (gridFilter.advanced?.mobile) { res.mobile = gridFilter.advanced.mobile }
        if (gridFilter.advanced?.nationalCode) { res.email = gridFilter.advanced.nationalCode }
        return res
    }
    convertDate = (dateString: string): { year: number, month: number, day: number } => {
        const [year, month, day] = new AIODate().convertToArray(dateString)
        return { year, month, day }
    }
    toIsoDate = (birthDate: string) => {
        const DATE = new AIODate();
        const dd = DATE.toGregorian(birthDate)
        const [y, m, d] = DATE.convertToArray(dd)
        return new Date(y, m - 1, d).toISOString();
    }
    getClientEditObject = (serverModel: I_serverEdit): I_addEmployeeModel => {
        const res: I_addEmployeeModel = {
            eslahKonandeyeAddress: {
                ettelaateFardi: {},
                shahrHayeMontasab: {},
                id: serverModel.id
            },
            freelancer: {
                ettelaateFardi: {},
                numbers: {},
                ettelaateKhodro: {},
                tasvireMadarek: {},
                id: serverModel.id
            },
            noeHamkari: 1
        }
        const birthDate = new AIODate().getDateByPattern(serverModel.birthDate, '{year}/{month}/{day}')
        const ettelaateFardi: any = {}
        ettelaateFardi.hub = serverModel.hubId;
        ettelaateFardi.nationalCode = serverModel.nationalCode;
        ettelaateFardi.name = serverModel.name;
        ettelaateFardi.mobile = serverModel.mobile;
        ettelaateFardi.email = serverModel.email;// null miad
        ettelaateFardi.isActive = serverModel.isActive;
        ettelaateFardi.fatherName = serverModel.fatherName;
        ettelaateFardi.birthDate = birthDate;
        ettelaateFardi.gender = serverModel.gender.id;
        ettelaateFardi.phone = serverModel.phone;
        ettelaateFardi.essentialPhone = serverModel.essentialPhone;
        ettelaateFardi.shahr = serverModel.residentCity.id;
        ettelaateFardi.address = serverModel.residentAddress;
        if (serverModel.type.id === 0) {
            res.noeHamkari = 0;
            res.freelancer.ettelaateFardi = ettelaateFardi
            res.freelancer.ettelaateKhodro.pelak = [
                serverModel.vehicleNumberPart0,
                serverModel.vehicleNumberPart1,
                serverModel.vehicleNumberPart2,
                serverModel.vehicleNumberPart3
            ]
            res.freelancer.ettelaateKhodro.noeVasileNaghlie = serverModel.vehicleType?.id;
            res.freelancer.ettelaateKhodro.modeleVasileNaghlie = serverModel.vehicleMake?.id;
            res.freelancer.ettelaateKhodro.vin = serverModel.vehicleVin;
            try {
                const d = serverModel.vehicleInsuranceExpire as any
                const bimeNameDateString = `${d.year}/${d.month}/${d.day}`
                res.freelancer.ettelaateKhodro.tarikheEtebareBimeName = bimeNameDateString;
            }
            catch {
                debugger
            }
            res.freelancer.numbers = {
                shomareGavahiname: serverModel.drivingLicenceNo,
                shomareGharardad: serverModel.contractNo,
                shomareSafte: serverModel.bankPaperNo,
                shomareSheba: serverModel.iban
            }
        }
        else {
            res.noeHamkari = 1;
            res.eslahKonandeyeAddress.ettelaateFardi = ettelaateFardi
            if (serverModel.accessCities) {
                res.eslahKonandeyeAddress.shahrHayeMontasab.shahr = serverModel.accessCities.map((o) => o.id);
            }
            if (serverModel.accessProvinces) {
                res.eslahKonandeyeAddress.shahrHayeMontasab.ostan = serverModel.accessProvinces.map((o) => o.id);
            }
        }
        return res
    }
    enums = async () => {
        const url = `${this.base_url}/core-api/common/common-objects?includeProvinces=true&includeCities=true&includeHubs=true&includeSexType=true&includeVehicleTypes=true&includeEmployeeTypes=true&includeVehicleVendor=true&includeVehicleMakes=true`
        const { response, success } = await this.request<any>({
            name: 'enums',
            method: 'get',
            description: 'دریافت اطلاعات اولیه',
            url,
            //cache: { name: 'enums', expiredIn: new Date().getTime() + 100000000000 }
        })
        if (success) {
            return response.data.response
        }
        else { return false }
    }
    grid = async (gridFilter: I_gridFilter) => {
        const body = this.getGridServerFilter(gridFilter)
        const { response, success } = await this.request<{ data: { payload: { content: any[], totalElements: number } } }>({
            name: 'grid',
            method: 'post',
            description: 'دریافت اطلاعات جدول پرسنل', loading: true,
            url: `${this.base_url}/resource-api/employee/filter?pageNumber=${gridFilter.pageNumber}&pageSize=${gridFilter.pageSize}`,
            body
        })
        if (success) {
            return {
                rows: response.data.payload.content,
                length: response.data.payload.totalElements
            }
        }
        return false
    }
    add = async (addModel: I_serverAdd) => {
        const { response, success } = await this.request<{ data: { payload: I_serverEdit } }>({
            name: 'grid', method: 'post',
            description: 'افزودن راننده', loading: true,
            url: `${this.base_url}/resource-api/employee`,
            body: addModel
        })
        if (success) { return this.getClientEditObject(response.data.payload) }
        return false
    }
    edit = async (editModel: I_serverEdit, id: number) => {
        const { response, success } = await this.request<any>({
            name: 'grid',
            method: 'put',
            description: 'ویرایش راننده', loading: true,
            url: `${this.base_url}/resource-api/employee`,
            body: { ...editModel, id }
        })
        if (success) { return true }
        return false
    }
    remove = async (id: number) => {
        const { success } = await this.request<any>({
            name: 'grid',
            method: 'delete',
            description: 'حذف راننده', loading: true,
            url: `${this.base_url}/resource-api/employee/${id}`,
        })
        if (success) { return true }
        return false
    }
    initialEdit = async (id: number) => {
        const { response, success } = await this.request<any>({
            name: 'initialEdit',
            method: 'get',
            description: 'دریافت اطلاعات اولیه راننده برای ویرایش',
            loading: true,
            url: `${this.base_url}/resource-api/employee/${id}`
        })
        if (success) {
            const res: I_serverEdit = response.data.payload
            return this.getClientEditObject(res)
        }
        return false
    }
    cities = async () => {
        const { response, success } = await this.request<{
            data: {
                payload: I_city[]
            }
        }>({
            name: 'cities',
            method: 'get',
            url: `${this.base_url}/core-api/countryDevision/findbyCity?filter=`,
            description: 'دریافت لیست شهر ها'
        })
        if (success) {
            return response.data.payload
        }
        return false
    }
}