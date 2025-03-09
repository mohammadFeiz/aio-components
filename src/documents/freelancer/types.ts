export type I_hub = {
    id: number,
    text: string
}
export type I_ettelaateFardi = {
    name?: string,
    nationalCode?: string,
    mobile?: string,
    fatherName?: string,
    email?: string,
    birthDate?: string,
    hub?:number,
    gender?: number,
    phone?: string,
    essentialPhone?: string,
    shahr?: number,
    isActive?: boolean,
    address?: string,
            
}
export type I_addEmployeeModel = {
    noeHamkari: number,
    eslahKonandeyeAddress: {
        tab: number,
        ettelaateFardi: I_ettelaateFardi,
        shahrHayeMontasab: {
            shahr?: number[],
            ostan?: number[]
        }
    },
    freelancer: {
        tab: number,
        ettelaateFardi: {
            shomareGavahiname?: string,
            shomareSheba?: string,
            shomareSafte?: string,
            shomareGharardad?: string
        } & I_ettelaateFardi,
        ettelaateKhodro: {
            noeVasileNaghlie?: number,
            modeleVasileNaghlie?: number,
            pelak?: string[],
            vin?: string,
            tarikheEtebareBimeName?: string
        },
        tasvireMadarek: {
            rooyeCarteMelli?: any,
            poshteCarteMelli?: any,
            rooyeGavahiname?: any,
            poshteGavahiname?: any,
            rooyeCarteVasileNaghlie?: any,
            poshteCarteVasileNaghlie?: any,
            bimename?: any,
            safte?: any,
            gharardad?: any,
        }
    }
}
export type I_AddEmployeeContext = {
    setAddEmployeeModel:(v:I_addEmployeeModel)=>void,
    getAddEmployeeModel:()=>I_addEmployeeModel,
    resetEmployeeModel:()=>void,
    submit:()=>void
}
export type I_gridFilter = {
    hubId:number,
    noeHamkari?: number,
    name?: string,
    isActive?: boolean,
    pageSize:number,
    pageNumber:number,
    rowsLength:number,
    advanced: {
        mobile?: string,
        nationalCode?: string
    }
}
export type I_gridServerFilter = {
    employeeType?:number,
    name?:string,
    isActive?:boolean,
    mobile?:string,
    email?:string,
    selectHub:{id:number}
}
export type I_row = {
    selectRoles: { id: number, text: string }[]
    name: string,
    nationalCode: string,
    mobile: string,
    email: string,
    createDate: {
        day: number,
        month: number,
        year: number,
        hour: string,
        minute: string
    },
    username: string,
    isActive: boolean
}