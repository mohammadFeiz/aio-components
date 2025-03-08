import AIOApis from "../../npm/aio-apis";
import AIODate from "../../npm/aio-date";
import { I_addEmployeeModel, I_gridFilter, I_gridServerFilter } from "./types";

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
            selectHub: { id: gridFilter.hubId }
        }
        if (gridFilter.noeHamkari) { res.employeeType = gridFilter.noeHamkari }
        if (gridFilter.name) { res.name = gridFilter.name }
        if (gridFilter.isActive) { res.isActive = gridFilter.isActive }
        if (gridFilter.advanced?.mobile) { res.mobile = gridFilter.advanced.mobile }
        if (gridFilter.advanced?.nationalCode) { res.email = gridFilter.advanced.nationalCode }
        return res
    }
    convertDate = (dateString:string):{year:number,month:number,day:number}=>{
        const [year,month,day] = new AIODate().convertToArray(dateString)
        return {year,month,day}
    }
    getServerAddObject = (addEmployeeModel: I_addEmployeeModel) => {
        const {noeHamkari,freelancer,eslahKonandeyeAddress} = addEmployeeModel;
        const {ettelaateFardi} = noeHamkari === 0?freelancer:eslahKonandeyeAddress
        const {
            nationalCode,name,mobile,email,isActive,fatherName,birthDate,gender,phone,essentialPhone,shahr,address,
        } = ettelaateFardi
        const hub = noeHamkari === 0?freelancer.ettelaateFardi.hub:undefined
        const obj:any = {
            //"id": 0,
            //"personelCode": "string",
            // "username": "string",
            // "password": "string",
            // "isSuperAdmin": true,
            
            nationalCode,name,mobile,email,isActive,fatherName,phone,essentialPhone,
            birthDate: birthDate,//notice iso date???
            gender: {id: gender},
            residentCity: {id: shahr},
            residentAddress:address,
            "selectRoles": [{"id": 0,"text": "string"}],
            "hubCodes": ["string"],
            "hubcode": "string",
            "createDate": {
                "day": 0,
                "month": 0,
                "year": 0,
                "hour": "string",
                "minute": "string"
            },
            "creator": "string",
            "modifierDate": {
                "day": 0,
                "month": 0,
                "year": 0,
                "hour": "string",
                "minute": "string"
            },
            "modifier": "string",
            "hubId": 0,
            "type": {"id": 0,"text": "string"},
            "vehicleHub": {"id": 0,"text": "string"},
            "vehicleNumberPart0": "string",
            "vehicleNumberPart1": "string",
            "vehicleNumberPart2": "string",
            "vehicleNumberPart3": "string",
            "accessProvinces": [
                {
                    "id": 0,
                    "text": "string"
                }
            ],
            "accessCities": [
                {
                    "id": 0,
                    "text": "string"
                }
            ],
            "nationalIdFrontDocId": "string",
            "nationalIdBackDocId": "string",
            "drivingLicenceFrondDocId": "string",
            "drivingLicenceBackDocId": "string",
            "vehicleIdFrontDocId": "string",
            "vehicleIdBackDocId": "string",
            "vehicleInsurancePaperDocId": "string",
            "bankPaperDocId": "string",
            "contractPaperDocId": "string"
        }
        if(hub !== undefined){obj.selectHubs = [{id: hub}]}
        if(noeHamkari === 0){
            obj.drivingLicenceNo = freelancer.ettelaateFardi.shomareGavahiname;
            obj.contractNo = freelancer.ettelaateFardi.shomareGharardad;
            obj.bankPaperNo = freelancer.ettelaateFardi.shomareSafte
            
            //sheba //notice
            
            if(freelancer.ettelaateKhodro.tarikheEtebareBimeName){
                obj.vehicleInsuranceExpire = this.convertDate(freelancer.ettelaateKhodro.tarikheEtebareBimeName)
            }
            obj.vehicleType = {id:freelancer.ettelaateKhodro.noeVasileNaghlie }
            obj.vehicleVin = freelancer.ettelaateKhodro.vin;
            obj.iban = freelancer.ettelaateFardi.shomareSheba;
            if(freelancer.ettelaateKhodro.modeleVasileNaghlie){
                obj.vehicleMake = {id: freelancer.ettelaateKhodro.modeleVasileNaghlie}
            }
            
            
            

        }
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
}