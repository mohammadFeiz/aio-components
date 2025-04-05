import { FC, useEffect, useState } from "react";
import { AITabs } from "./../../../npm/aio-input";
import { I_freelancer } from "../types";
import EttelaateFardi from "./ettelaateFardi";
import EttelaateKhodro from "./ettelaateKhodro";
import FreelancerNumbers from "./numbers";
import TasvireMadarek from "./tasvireMadarek";
import AIODate from "./../../../npm/aio-date";
import Footer from "./footer";
import { useFreelancer } from "../context";
type I_tab = 0 | 1 | 2
const Freelancer: FC<{ id?: number }> = ({ id }) => {
    const { apis, gridHook, popup } = useFreelancer()
    const [tab, setTab] = useState<I_tab>(0)
    const [type, setType] = useState<'add' | 'edit'>(id === undefined ? 'add' : 'edit')
    const [ettelaateFardiDisabled, setEttelaateFardiDisabled] = useState<boolean>(true)
    const [freelancerNumbersDisabled, setFreelancerNumbersDisabled] = useState<boolean>(true)
    const [ettelaateKhodroDisabled, setEttelaateKhodroDisabled] = useState<boolean>(true)
    const [data, setData] = useState<I_freelancer>()
    const getData = async () => {
        if (id === undefined) {
            setData({
                ettelaateFardi: {
                    phone:'02188050006',
                    birthDate:'1364/4/4',
                    essentialPhone:'09123457767',
                    fatherName:'علی رحمتی',
                    gender:1,
                    hub:2,
                    isActive:true,
                    address:'asdsfsd sdf sfsdfsdf',
                    shahr:811
                },
                numbers: {
                    shomareGavahiname:'54345653',
                    shomareSafte:'547685y54',
                    shomareGharardad:'54353645',
                    shomareSheba:'345656789876567834567567'
                },
                ettelaateKhodro: {},
                tasvireMadarek: {}
            })
        }
        else {
            const res = await apis.initialEdit(id);
            if (res) { setData(res.freelancer) }
        }
    }
    useEffect(() => {
        getData()
    }, [])
    const isDisabled = () => {
        if (tab === 0) { return !!ettelaateFardiDisabled || !!freelancerNumbersDisabled }
        if (tab === 1) { return !!ettelaateKhodroDisabled }
        return false
    }
    const submit = async () => {
        if(!data){return}
        const {
            nationalCode, name, mobile, email, isActive, fatherName, birthDate, gender, phone, essentialPhone, shahr, address, hub
        } = data.ettelaateFardi
        const obj: any = {
            nationalCode, name, mobile, email, isActive, fatherName, phone, essentialPhone,//
            birthDate: toIsoDate(birthDate || '1403/4/5'),//notice iso date???//
            gender: { id: gender },
            residentCity: { id: shahr },
            residentAddress: address,
            type: { id: 0 },
            username: mobile,
            hubId: hub
        }
        debugger
                
        obj.drivingLicenceNo = data.numbers.shomareGavahiname;
        obj.contractNo = data.numbers.shomareGharardad;
        obj.bankPaperNo = data.numbers.shomareSafte
        obj.iban = data.numbers.shomareSheba;
        if (type === 'add') {
            const res = await apis.add(obj)
            debugger
            if (res) {
                gridHook.updateGrid()
                setTab(1);
                setType('edit');
                setData(res.freelancer)
            }
        }

        if (type === 'edit') {
            const id = data.id as number;
            if (data.ettelaateKhodro.tarikheEtebareBimeName) { obj.vehicleInsuranceExpire = convertDate(data.ettelaateKhodro.tarikheEtebareBimeName) }
            obj.vehicleType = { id: data.ettelaateKhodro.noeVasileNaghlie }
            obj.vehicleVin = data.ettelaateKhodro.vin;
            if (data.ettelaateKhodro.modeleVasileNaghlie) {
                obj.vehicleMake = { id: data.ettelaateKhodro.modeleVasileNaghlie }
            }
            const pelak = data.ettelaateKhodro.pelak || []
            obj.vehicleNumberPart0 = pelak[0]
            obj.vehicleNumberPart1 = pelak[1]
            obj.vehicleNumberPart2 = pelak[2]
            obj.vehicleNumberPart3 = pelak[3]
            const res = await apis.edit(obj, id)
            if (res) {
                gridHook.updateGrid()
                popup.removeModal()
            }
        }
    }
    if (!data) { return null }
    return (
        <div className="flex-col- gap-16-">
            <AITabs
                style={{ height: 36 }}
                options={[
                    { text: 'اطلاعات فردی', value: 0 },
                    { text: 'اطلاعات خودرو', value: 1, disabled: type === 'add' },
                    { text: 'تصویر مدارک', value: 2, disabled: type === 'add' }
                ]}
                value={tab}
                option={{ justify: () => true, style: () => ({ flex: 1 }) }}
                onChange={(tab) => setTab(tab)}
            />
            {
                tab === 0 &&
                <EttelaateFardi
                    data={data.ettelaateFardi}
                    onChange={(ettelaateFardi) => setData({ ...data, ettelaateFardi })}
                    setDisabled={(v) => {
                        if (ettelaateFardiDisabled !== v) { setEttelaateFardiDisabled(v) }
                    }}
                />
            }
            {
                tab === 0 &&
                <FreelancerNumbers
                    data={data.numbers}
                    onChange={(numbers) => setData({ ...data, numbers })}
                    setDisabled={(v) => {
                        if (freelancerNumbersDisabled !== v) { setFreelancerNumbersDisabled(v) }
                    }}
                />
            }
            {
                tab === 1 &&
                <EttelaateKhodro
                    data={data.ettelaateKhodro}
                    onChange={(ettelaateKhodro) => setData({ ...data, ettelaateKhodro })}
                    setDisabled={(v) => {
                        if (ettelaateKhodroDisabled !== v) { setEttelaateKhodroDisabled(v) }
                    }}
                />
            }
            {
                tab === 2 &&
                <TasvireMadarek
                    data={data.tasvireMadarek}
                    onChange={(tasvireMadarek) => setData({ ...data, tasvireMadarek })}
                />
            }
            <Footer onSubmit={submit} onClose={() => popup.removeModal()} isDisabled={isDisabled} />
        </div>
    )
}
export default Freelancer
const convertDate = (dateString: string): { year: number, month: number, day: number } => {
    const [year, month, day] = new AIODate().convertToArray(dateString)
    return { year, month, day }
}
const toIsoDate = (birthDate: string) => {
    const DATE = new AIODate();
    const dd = DATE.toGregorian(birthDate)
    const [y, m, d] = DATE.convertToArray(dd)
    return new Date(y, m - 1, d).toISOString();
}