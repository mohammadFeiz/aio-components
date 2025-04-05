import { FC, useEffect, useState } from "react";
import { AITabs } from "./../../../npm/aio-input";
import { I_eslahKonandeyeAddress } from "../types";
import EttelaateFardi from "./ettelaateFardi";
import AIODate from "./../../../npm/aio-date";
import Apis from "../apis";
import ShahrHayeMontasab from "./shahr-haye-montasab";
import Footer from "./footer";
import { useFreelancer } from "../context";
type I_tab = 0 | 1
const EslahKonandeyeAddress: FC<{ id?: number }> = ({ id }) => {
    const {apis,gridHook,popup} = useFreelancer()
    const [tab, setTab] = useState<I_tab>(0)
    const [type, setType] = useState<'add' | 'edit'>(id === undefined ? 'add' : 'edit')
    const [ettelaateFardiDisabled, setEttelaateFardiDisabled] = useState<boolean>(true)
    const [shahrHayeMontasabDisabled, setShahrHayeMontasabDisabled] = useState<boolean>(true)
    const [data, setData] = useState<I_eslahKonandeyeAddress>()
    const getData = async () => {
        if (id === undefined) {
            setData({
                ettelaateFardi: {},
                shahrHayeMontasab: {}
            })
        }
        else {
            const res = await apis.initialEdit(id);
            if (res) { setData(res.eslahKonandeyeAddress) }
        }
    }
    useEffect(() => {
        getData()
    }, [])
    const isDisabled = () => {
        if (tab === 0) { return !!ettelaateFardiDisabled }
        if (tab === 1) { return !!shahrHayeMontasabDisabled }
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
            type: { id: 1 },
            username: mobile,
            hubId: hub
        }
        if (type === 'add') {
            const res = await apis.add(obj)
            if (res) {
                gridHook.updateGrid()
                setTab(1);
                setType('edit');
                setData(res.eslahKonandeyeAddress)
            }
        }
        if(type === 'edit') {
            const id = data.id as number
            const shahrHayeMontasab = data.shahrHayeMontasab || { shahr: [], ostan: [] }
            const shahr = shahrHayeMontasab.shahr || []
            const ostan = shahrHayeMontasab.ostan || []
            obj.accessProvinces = shahr.map((id) => ({ id }))
            obj.accessCities = ostan.map((id) => ({ id }))
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
                    { text: 'شهر های منتسب', value: 1, disabled: type === 'add' }
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
                tab === 1 &&
                <ShahrHayeMontasab
                    data={data.shahrHayeMontasab}
                    onChange={(shahrHayeMontasab) => setData({ ...data, shahrHayeMontasab })}
                    setDisabled={(v) => {
                        if (shahrHayeMontasabDisabled !== v) { setShahrHayeMontasabDisabled(v) }
                    }}
                />
            }
            <Footer onSubmit={submit} onClose={()=>popup.removeModal()} isDisabled={isDisabled} />
        </div>
    )
}
export default EslahKonandeyeAddress
const toIsoDate = (birthDate: string) => {
    const DATE = new AIODate();
    const dd = DATE.toGregorian(birthDate)
    const [y, m, d] = DATE.convertToArray(dd)
    return new Date(y, m - 1, d).toISOString();
}