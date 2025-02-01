import { FC, ReactNode, useEffect, useRef, useState } from "react";
import AIOInput, { AITYPE } from "../aio-input";
import { AddToAttrs, getValueByField, IsValidEmail, IsValidIrNationalCode, setValueByField, ValidateIrMobile } from "../aio-utils";
import './index.css';
export type I_validateType = 'email' | 'irMobile' | 'irNationalCode'
export type I_formInput<T> = AITYPE & { label: string, required?: boolean, validateType?: I_validateType, field: I_formField<T>, 
    validate?: (p:{data: T, value: any, input: I_formInput<T>}) => string | undefined }
type I_useFormProps<T> = {
    initData: T;
    onSubmit?: (data: T) => void;
    fa?: boolean;
    getLayout?:(data:T)=>I_formNode<T>
};
export type I_formField<T> = NestedKeys<T>
type NestedKeys<T> = {
    [K in keyof T]: T[K] extends object
    ? `${K & string}` | `${K & string}.${NestedKeys<T[K]>}`
    : `${K & string}`;
}[keyof T];

type I_formTag = 'fieldset' | 'section' | 'div' | 'p';
export type I_formNode<T> = {
    v?: I_formNode<T>[], h?: I_formNode<T>[], html?: ReactNode, input?: I_formInput<T>, attrs?: any, className?: string, style?: any, show?: boolean,
    flex?: number, size?: number, scroll?: boolean, tag?: I_formTag, legend?: ReactNode, submit?: { text: string, attrs?: any }, required?: boolean,
    reset?: { text: string, attrs?: any }
}
export type I_formHook<T> = {
    data: T,
    render: ReactNode,
    changeData: (data: T) => void,
    changeByField:(field:I_formField<T>,value:any)=>void,
    getErrorsDic:()=>{[key in I_formField<T>]?: string | undefined},
    getErrorsList:()=>string[],
    reset:()=>void
}
type I_formContext<T> = {
    getData: () => T,
    changeData: (data: T) => void,
    changeByField: (field: I_formField<T>, value: any) => void,
    isDataChanged: () => boolean,
    rootProps: I_useFormProps<T>,
    isFieldChanged: (field: I_formField<T>) => boolean,
    getValueAndErrorByInput: (input: I_formInput<T>) => { value: any, error: string | undefined },
    hasError:()=>boolean,
    getErrorsList:()=>string[],
    reset:()=>void
}

export const useForm = <T extends Record<string, any>>(p: I_useFormProps<T>): I_formHook<T> => {
    function getInitData() { return JSON.parse(JSON.stringify(p.initData)) }
    const [initData] = useState<T>(getInitData);
    const fieldChangesRef = useRef<{ [key in I_formField<T>]?: boolean }>({})
    const errorsRef = useRef<{ [key in I_formField<T>]?: string | undefined }>({})
    const hasError = ()=>{
        const keys = Object.keys(errorsRef.current) as any
        return !!keys.filter((o:I_formField<T>)=>!!errorsRef.current[o]).length
    }
    const isFieldChanged = (field: I_formField<T>) => !!fieldChangesRef.current[field]
    const [data, setData] = useState<T>(getInitData);
    const [dom,setDom] = useState<ReactNode>(null)
    function getData() { return dataRef.current }
    const changeData = (data: T) => { dataRef.current = data; setData(data) }
    const changeByField = (field: I_formField<T>, value: any) => {
        let newData = { ...dataRef.current }; 
        fieldChangesRef.current = { ...fieldChangesRef.current, [field]: true }
        setValueByField(newData, field, value); 
        changeData(newData)
    }
    const dataRef = useRef(data); dataRef.current = data;
    function getValueAndErrorByInput(input: I_formInput<T>) {
        const {required = true,label,field} = input;
        const value = getValueByField(dataRef.current, field)
        let error;
        if(required && value === undefined || value === '' || value === null){
            error = p.fa?`${label} ضروری است`:`${label} is required`
        }
        else if(input.validate){
            error = input.validate({ data: dataRef.current, value, input })
        }
        errorsRef.current = {...errorsRef.current,[field]:error}
        return { value, error }
    }
    const reset = ()=>{
        const newData = getInitData();
        dataRef.current = newData
        errorsRef.current = {}
        setData(newData);
    }
    const getErrorsDic = ()=>errorsRef.current
    const getErrorsList = ():string[]=>{
        const errors = errorsRef.current as any;
        const keys = Object.keys(errors) as any;
        const strs = keys.filter((o:any)=>!!errors[o]) as any
        return strs.map((o:any)=>errors[o])
    }
    const isDataChanged = () => JSON.stringify(initData) !== JSON.stringify(dataRef.current);
    useEffect(()=>{
        setDom(getDom())
    },[data])
    const getDom = () => {
        if(!p.getLayout){return null}
        const node = p.getLayout(dataRef.current)
        const context: I_formContext<T> = { rootProps: p, getData, isDataChanged, isFieldChanged, getValueAndErrorByInput,changeData,changeByField,hasError,getErrorsList,reset }
        //@ts-ignore
        return <FormRender node={node} context={context}/>
    };
    return { data, changeData,getErrorsDic,getErrorsList,changeByField, render:<>{dom}</>,reset }
}
const FormRender:FC<{context:I_formContext<any>,node:I_formNode<any>}> = ({context,node})=>{
    const [dom,setDom] = useState<ReactNode>(null)
    const {getData} = context
    const data = getData();
    useEffect(()=>{
        setDom(<AIFormNode node={node} context={context} level={0} index={0} />)
    },[data])
    return <>{dom}</>
}
const AIFormNode: FC<{
    node: I_formNode<any>,
    context: I_formContext<any>,
    level: number,
    index: number
}> = ({ node, context, level, index }) => {
    let { show = true } = node;
    if (!show) { return null }
    if (node.html !== undefined) { return <>{node.html}</> }
    if (node.submit) { return <FormSubmitButton node={node} context={context} /> }
    if (node.reset) { return <FormResetButton node={node} context={context} /> }
    if (node.input) { return <AIFormInput key={node.input.field} node={node} context={context} /> }
    if (Array.isArray(node.h) || Array.isArray(node.v)) {
        return <AIFormGroup node={node} context={context} level={level} index={index} />
    }
    return null
}
const AIFormGroup: FC<{
    node: I_formNode<any>,
    context: I_formContext<any>,
    level: number,
    index: number
}> = ({ node, context, level }) => {
    let { tag = 'div', legend, flex, size, scroll } = node;
    const dir = node.v ? 'v' : 'h'
    const scrollClass = scroll ? `ai-form-scroll-${dir}` : undefined
    const html = <>{(node as any)[dir].map((o: I_formNode<any>, i: number) => <AIFormNode key={`level-${level + 1}-index-${i}`} node={o} context={context} level={level + 1} index={i} />)}</>
    const content = (<>{!!legend && tag === 'fieldset' && <legend>{legend}</legend>}{html}</>)
    const attrs = AddToAttrs(node.attrs, { className: [`ai-form-${dir}`, node.className, scrollClass, level === 0 ? 'ai-form' : ''], style: { flex, [dir === 'v' ? 'height' : 'width']: size, ...node.style } })
    if (level === 0) { return (<form {...attrs}>{content}</form>) }
    if (tag === 'section') { return (<section {...attrs}>{content}</section>) }
    if (tag === 'fieldset') { return (<fieldset {...attrs}>{content}</fieldset>) }
    if (tag === 'p') { return (<p {...attrs}>{content}</p>) }
    return (<div {...attrs}>{content}</div>)
}
const AIFormInput: FC<{
    node: I_formNode<any>,
    context: I_formContext<any>
}> = ({ node, context }) => {
    const { getValueAndErrorByInput,changeByField } = context;
    const {input} = node;
    if(!input){return null}
    const {inputAttrs,field} = input;
    const { value, error } = getValueAndErrorByInput(input);
    const props:any = {...input,inputAttrs:{ ...inputAttrs, 'aria-label': field },value,onChange:(v: any) => changeByField(field, v)}
    return <RenderInput value={value} error={error} input={input} node={node} context={context} props={props}/>;
}
const RenderInput:FC<{value:any,error?:string,input:I_formInput<any>,node:I_formNode<any>,context:I_formContext<any>,props:any}> = ({value,error,input,node,context,props})=>{
    const { isFieldChanged } = context;
    const [dom, setDom] = useState<ReactNode>(null)
    useEffect(() => {
        const {field,label} = input;
        let { size, flex } = node
        const attrs = AddToAttrs(node.attrs, { className: ["ai-form-input-container", node.className], style: { flex, width: size, ...node.style } })        
        setDom(
            <FormItem key={field} required={input.required}
                input={<AIOInput {...props}/>}
                label={label} error={isFieldChanged(field) ? error : undefined} attrs={attrs}
            />
        )
    }, [props, error])
    console.log('input render')
    return <>{dom}</>;
}
const FormSubmitButton: FC<{
    node: I_formNode<any>,
    context: I_formContext<any>
}> = ({ node, context }) => {
    const {rootProps, getData,hasError,isDataChanged} = context;
    const [timerDisabled, setTimerDisabled] = useState(false)
    const {  } = context;
    const { onSubmit } = rootProps; if (!onSubmit) { return null }
    const dataChanged = isDataChanged()
    const disabled = !dataChanged || hasError() || !!timerDisabled
    if (!node.submit) { return null }
    const { text, attrs } = node.submit
    const allAttrs = {
        type: 'button',...attrs, disabled, 
        onClick: () => {
            setTimerDisabled(true); onSubmit(getData());
            setTimeout(() => setTimerDisabled(false), 3000)
        }
    }
    return <button {...allAttrs}>{text}</button>
}
const FormResetButton: FC<{
    node: I_formNode<any>,
    context: I_formContext<any>
}> = ({ node, context }) => {
    const {reset} = context;
    if (!node.reset) { return null }
    const { text, attrs } = node.reset
    const allAttrs = {
        type: 'button',...attrs, 
        onClick: () => {
            reset();
        }
    }
    return <button {...allAttrs}>{text}</button>
}
export const FormItem: FC<{
    label?: string,
    input: ReactNode,
    attrs?: any,
    action?: { text: ReactNode, fn?: () => void },
    error?: string,
    id?: string,
    required?: boolean
}> = (props) => {
    const { label, input, action, error, attrs, id, required = true } = props;
    const hasHeader = !!label || !!action
    const Attrs = AddToAttrs(attrs, { className: "ai-form-item" })
    return (
        <div {...Attrs}>
            {
                hasHeader === true &&
                <label className="ai-form-item-header" htmlFor={id}>
                    {!!label && <div className="ai-form-item-label">{required ? <div className="ai-form-required">*</div> : null}{label}</div>}
                    {!!action && <div className="ai-form-item-action" onClick={action.fn ? () => (action.fn as any)() : (() => { })}>{action.text}</div>}
                </label>
            }
            <div className="ai-form-item-body">{input}</div>
            {!!error && <div className="ai-form-item-error">{error}</div>}
        </div>
    )
}


