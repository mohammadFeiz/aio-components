export type I_hub = {
    id: number,
    text: string
}
export type I_addEmployeeModel = {
    noeHamkari: number,
    eslahKonandeyeAddress: {
        tab: number,
        ettelaateFardi: {
            name?: string,
            codeMelli?: string,
            mobile?: string,
            namePedar?: string,
            email?: string,
            tarikheTavallod?: string,
            jensiat?: number,
            phone?: string,
            shomareZarori?: string,
            shahr?: string,
            faal?: boolean,
            address?: string,
        },
        shahrHayeMontasab: {
            shahr?: number,
            ostan?: number
        }
    },
    freelancer: {
        tab: number,
        ettelaateFardi: {
            name?: string,
            codeMelli?: string,
            mobile?: string,
            namePedar?: string,
            email?: string,
            tarikheTavallod?: string,
            jensiat?: number,
            telefoneSabet?: string,
            telefoneZaroori?: string,
            shahr?: number,
            hub?: number,
            faal: boolean,
            address?: string,
            shomareGavahiname?: string,
            shomareSheba?: string,
            shomareSafte?: string,
            shomareGharardad?: string
        },
        ettelaateKhodro: {
            noeVasileNaghlie?: number,
            modeleVasileNaghlie?: number,
            pelak?: string,
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
    addEmployeeModel:I_addEmployeeModel,
    changeAddEmployeeModel:(v:I_addEmployeeModel)=>void,
    options: any,
}
export type I_gridFilter = {
    hubId:number,
    noeHamkari?: number,
    name?: string,
    faal?: boolean,
    pageSize:number,
    pageNumber:number,
    rowsLength:number,
    advanced: {
        mobile?: string,
        codeMelli?: string
    }
}
export type I_serverFilter = {
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