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
    hub?: number,
    gender?: number,
    phone?: string,
    essentialPhone?: string,
    shahr?: number,
    isActive?: boolean,
    address?: string,

}
export type I_freelancer_numbers = {
    shomareGavahiname?: string,
    shomareSheba?: string,
    shomareSafte?: string,
    shomareGharardad?: string
}
export type I_tasvireMadarek = {
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
export type I_ettelaateKhodro = {
    noeVasileNaghlie?: number,
    modeleVasileNaghlie?: number,
    pelak?: string[],
    vin?: string,
    tarikheEtebareBimeName?: string
}
export type I_shahrHayeMontasab = {
    shahr?: number[],
    ostan?: number[]
}
export type I_freelancer = {
    ettelaateFardi: I_ettelaateFardi,
    numbers: I_freelancer_numbers,
    ettelaateKhodro: I_ettelaateKhodro,
    tasvireMadarek: I_tasvireMadarek,
    id?:number
}
export type I_eslahKonandeyeAddress = {
    ettelaateFardi: I_ettelaateFardi,
    shahrHayeMontasab: I_shahrHayeMontasab,
    id?:number
}
export type I_addEmployeeModel = {
    noeHamkari: 0 | 1,
    eslahKonandeyeAddress: I_eslahKonandeyeAddress,
    freelancer: I_freelancer,
}
export type I_gridFilter = {
    hubId: number,
    noeHamkari?: number,
    name?: string,
    isActive?: boolean,
    pageSize: number,
    pageNumber: number,
    rowsLength: number,
    advanced: {
        mobile?: string,
        nationalCode?: string
    }
}
export type I_gridServerFilter = {
    types?: { id: number }[],
    name?: string,
    isActive?: boolean,
    mobile?: string,
    email?: string,
    selectHub: { id: number }
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
    isActive: boolean,
    id:number
}

export type I_city = {
    boxitSupport: boolean,
    id: number,
    latitude: number,
    longtitude: number,
    text: string
}

export type I_serverAdd = {
    nationalCode: string,
    name: string,
    mobile: string,
    email: string,
    isActive: boolean,
    fatherName: string,
    birthDate: string,
    gender: { id: 0 | 1 },
    phone: string,
    essentialPhone: string,
    residentCity: { id: number },
    residentAddress: string,
    type: { id: 0 | 1 },
    username: string,
    hubId: number,
    drivingLicenceNo?: string,
    contractNo?: string,
    bankPaperNo?: string,
    iban?: string
}

export type I_serverEdit = I_serverAdd & {
    vehicleInsuranceExpire?: { year: number, month: number, day: number },
    vehicleType: { id: number },
    vehicleVin: string;
    vehicleMake?: { id: number },
    vehicleNumberPart0: string,
    vehicleNumberPart1: string,
    vehicleNumberPart2: string,
    vehicleNumberPart3: string,
    accessProvinces?: { id: number }[],
    accessCities?: { id: number }[],
    id:number
}