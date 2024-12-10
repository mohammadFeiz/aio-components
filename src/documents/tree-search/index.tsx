import { FC } from "react";
import { FilterTree, GenerateComponsition } from "../../npm/aio-utils";
const TreeSearch: FC = () => {
    const rootChilds = GenerateComponsition({ level: 4, length: 4, childsField: 'childs', fields: { name: 'name' } })
    const data = {
        name: 'name',
        childs: rootChilds
    }
    const filteredData = FilterTree({data,checkNode:(node)=>node.name.indexOf('-0-3-0-0') !== -1,childsField:'childs'})
    return (
        <pre>
            <code>
                {JSON.stringify(filteredData, null, 4)}
            </code>
        </pre>

    )
}
export default TreeSearch