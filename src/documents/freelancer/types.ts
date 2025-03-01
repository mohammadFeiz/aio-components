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
export type I_CTX = {
    openAddModal:()=>void,
    filter: I_filter,
    changeFilter: (v: I_filter) => void,
    data:I_row[]
}
export type I_AddEmployeeContext = {
    addEmployeeModel:I_addEmployeeModel,
    changeAddEmployeeModel:(v:I_addEmployeeModel)=>void,
    options: any,
}
export type I_filter = {
    noeHamkari?: string,
    name?: string,
    faal?: boolean,
    advanced: {
        mobile?: string,
        codeMelli?: string
    }
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