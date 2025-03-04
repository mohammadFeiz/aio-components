import { FC, useContext } from "react";
import { AITabs } from "../../../../npm/aio-input";
import { I_AddEmployeeContext } from "../../types";
import { AddEmployeeContext } from "../../context";
import Freelancer_EttelaateFardi from "./ettelaate-fardi";
import Freelancer_EttelaateKhodro from "./ettelaate-khodro";
import Freelancer_TasvireMadarek from "./tasvire-madarek";

const Freelancer: FC = () => {
    const {options,addEmployeeModel,changeAddEmployeeModel}:I_AddEmployeeContext = useContext(AddEmployeeContext)
    return (
        <div className="flex-col- gap-16-">
            <AITabs
                style={{ height: 36 }} options={options.freelancerTab} value={addEmployeeModel.freelancer.tab}
                option={{ justify: () => true, style: () => ({ flex: 1 }) }}
                onChange={(tab) => changeAddEmployeeModel({ ...addEmployeeModel, freelancer: { ...addEmployeeModel.freelancer, tab } })}
            />
            {addEmployeeModel.freelancer.tab === 0 && <Freelancer_EttelaateFardi />}
            {addEmployeeModel.freelancer.tab === 1 && <Freelancer_EttelaateKhodro />}
            {addEmployeeModel.freelancer.tab === 2 && <Freelancer_TasvireMadarek />}
        </div>
    )
}
export default Freelancer