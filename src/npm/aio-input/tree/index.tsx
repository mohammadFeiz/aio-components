import { createContext, FC, ReactNode, useContext } from "react";
import { AddToAttrs, GetArray } from "../../aio-utils";
const TreeContext = createContext({} as any)
type I_TreeContext = {
    rootProps: I_Tree
}
type I_treeParam = {
    parent: any,
    level: number,
    index: number,
    open?: boolean,
    isLastChild: boolean
}
type I_treeOption = {
    attrs: any,
    value: string,
    text: ReactNode,
    subtext?: ReactNode | undefined,
    before?: ReactNode,
    after?: ReactNode | undefined,
    toggleIcon?: ReactNode | undefined,
    index: number,
    level: number,
    parent: any,
    open?: boolean,
    childs?: any[]
}
type I_Tree = {
    value: any[],
    rtl?:boolean,
    indent?: number,
    size?: 36,
    option: {
        value: (p: I_treeParam) => any,
        text: (p: I_treeParam) => ReactNode,
        subtext?: (p: I_treeParam) => ReactNode | undefined,
        before?: (p: I_treeParam) => ReactNode | undefined,
        after?: (p: I_treeParam) => ReactNode | undefined,
        className?: (p: I_treeParam) => string | undefined,
        style?: (p: I_treeParam) => any,
        attrs?: (p: I_treeParam) => any,
        checked?: (p: I_treeParam) => boolean | undefined,
        onClick?: (p: I_treeParam) => (() => undefined) | undefined,
        childs: (p: I_treeParam) => (any[]) | undefined,
        toggleIcon?: (p: I_treeParam) => ReactNode | undefined
    }
}
const getTreeOption = (row: any, option: I_Tree["option"], param: I_treeParam): I_treeOption => {
    const { index, level, parent, open } = param;
    const {
        value: Value,
        text: Text,
        subtext: Subtext = () => { return undefined },
        before: Before = () => { return undefined },
        after: After = () => { return undefined },
        toggleIcon: ToggleIcon = () => { return undefined },
        className: ClassName = () => { },
        style: Style = () => { },
        attrs: Attrs = () => { },
        onClick: OnClick = () => { },
        childs: Childs = () => { return undefined },
    } = option
    const value = Value(param);
    const text = Text(param);
    const subtext: ReactNode | undefined = Subtext(param);
    const before = Before(param);
    const after = After(param);
    const toggleIcon = ToggleIcon(param);
    const childs = Childs(param)
    const className = ClassName(param);
    const style = Style(param);
    const attrs = Attrs(param);
    const onClick = OnClick(param)
    const finalAttrs = AddToAttrs(attrs, { className: [className, 'aio-input-tree-option'], style, attrs: { onClick } });
    return { attrs: finalAttrs, value, text, subtext, before, after, childs, index, level, parent, open, toggleIcon }
}
const Tree: FC<I_Tree> = (props) => {
    const getContext = (): I_TreeContext => {
        return {
            rootProps: props
        }
    }
    return (
        <TreeContext.Provider value={getContext()}>
            {
                props.value.map((row, i) => {
                    return (
                        <TreeBody
                            row={row}
                            param={{ level: 0, index: i, isLastChild: i === props.value.length - 1, parent: undefined, open: true }}
                            parentParam={undefined}
                            parentOption={undefined}
                        />
                    )
                })
            }
        </TreeContext.Provider>
    )
}
const TreeBody: FC<{ row: any, param: I_treeParam, parentOption?: I_treeOption, parentParam?: I_treeParam }> = ({ row, param, parentOption, parentParam }) => {
    const { rootProps }: I_TreeContext = useContext(TreeContext)
    const rowOption: I_treeOption = getTreeOption(row, rootProps.option, param)
    const { childs = [] } = rowOption;
    return (
        <div className="msf">
            <TreeRow row={row} rowOption={rowOption} param={param} parentOption={parentOption} />
            {childs.map((o, i) => <TreeBody row={o} param={{ index: 1, level: param.level + 1, isLastChild: i === childs.length - 1, parent: row }} parentOption={rowOption} parentParam={param} />)}
        </div>
    )
}

const TreeRow: FC<{ row: any, rowOption: I_treeOption, param: I_treeParam, parentOption?: I_treeOption,parentParam?:I_treeParam }> = ({ row, rowOption, param, parentOption,parentParam }) => {
    return (
        <div className="msf">
            <TreeIndent param={param} rowOption={rowOption} parentParam={parentParam}/>
            <div className="msf"></div>
        </div>
    )
}
const IndentIcon: FC<{ param: I_treeParam, parentParam?: I_treeParam, order: number }> = ({ param, parentParam, order }) => {
    const { rootProps }: I_TreeContext = useContext(TreeContext);
    const { size = 36, indent = 12 } = rootProps;
    if (!param.level) { return null }
    let x0 = indent / 2, x1 = indent, y0 = 0, y1 = size / 2, y2 = size, pathes = [];
    if (order === param.level - 1) {
        //horizontal line
        pathes.push(<path key={'hl' + order} d={`M${x0} ${y1} L${x1 * (rootProps.rtl ? -1 : 1)} ${y1} Z`}></path>)
        //vertical direct line
        pathes.push(<path key={'vdl' + order} d={`M${x0} ${y0} L${x0} ${param.isLastChild ? y1 : y2} Z`}></path>)
    }
    else {
        //vertical connet line
        if (!parentParam || !parentParam.isLastChild) {
            pathes.push(<path key={'vl' + order} d={`M${x0} ${y0} L${x0} ${y2} Z`}></path>)
        }
    }
    return (<svg className='aio-input-indent-line'>{pathes}</svg>)
}
const TreeIndent: FC<{ param: I_treeParam,rowOption:I_treeOption,parentParam?: I_treeParam }> = ({ param, parentParam,rowOption }) => {
    return (
        <div className="aio-input-indents">
            {GetArray(param.level, (i) => <div key={i} className={`aio-input-indent`}><IndentIcon param={param} parentParam={parentParam} order={i} /></div>)}
            <ToggleIconContainer onClick={()=>{}} param={param} rowOption={rowOption}/>
        </div>
    )
}
const ToggleIcon:FC<{option:I_treeOption}> = ({option}) => {
    const {rootProps}:I_TreeContext = useContext(TreeContext)
    return (
        <div style={{ transform: rootProps.rtl ? `scaleX(-1)` : undefined }}>
            {option.toggleIcon}
        </div>
    )
}
const ToggleIconContainer:FC<{onClick:()=>void,param:I_treeParam,rowOption:I_treeOption}> = ({onClick,param,rowOption}) => {
    const {rootProps}:I_TreeContext = useContext(TreeContext);
    const {indent = 12,size = 36} = rootProps;
    return (<div className="aio-input-toggle" onClick={(e) => { e.stopPropagation(); onClick() }}>
        <div className='aio-input-toggle-icon'><ToggleIcon option={rowOption}/></div>
        {
            param.open === true &&
            <svg className='aio-input-toggle-line aio-input-indent-line'>
                <path d={`M${indent / 2} ${0} L${indent / 2} ${size / 2 - 12} Z`}></path>
            </svg>
        }
    </div>)
}