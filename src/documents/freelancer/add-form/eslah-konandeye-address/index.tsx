import { FC, useContext } from "react";
import { AITabs } from "../../../../npm/aio-input";
import { I_AddEmployeeContext } from "../../types";
import EslahKonadeyeAddress_EttelaateFardi from "./ettelaate-fardi";
import EslahKonadeyeAddress_ShahrHayeMontasab from "./shahr-haye-montakhab";
import { AddEmployeeContext } from "../../context";

const EslahKonandeyeAddress: FC = () => {
    const {addEmployeeModel,options,changeAddEmployeeModel}:I_AddEmployeeContext = useContext(AddEmployeeContext)
    return (
        <div className="flex-col- gap-16-">
            <AITabs
                style={{ height: 36 }} options={options.eslahKonandeyeAddressTab} value={addEmployeeModel.eslahKonandeyeAddress.tab}
                option={{ justify: () => true, style: () => ({ flex: 1 }) }}
                onChange={(tab) => changeAddEmployeeModel({ ...addEmployeeModel, eslahKonandeyeAddress: { ...addEmployeeModel.eslahKonandeyeAddress, tab } })}
            />
            {addEmployeeModel.eslahKonandeyeAddress.tab === 0 && <EslahKonadeyeAddress_EttelaateFardi />}
            {addEmployeeModel.eslahKonandeyeAddress.tab === 1 && <EslahKonadeyeAddress_ShahrHayeMontasab />}
        </div>
    )
}
export default EslahKonandeyeAddress