import AIOInput,{
    AIOValidation as _AIOValidation,
    getFormInputs as _getFormInputs,
    getFormInput as _getFormInput
} from './index';
export default AIOInput;
export function AIOValidation(props){return _AIOValidation(props)}
export function getFormInputs(fields,path){return _getFormInputs(fields,path)}
export function getFormInput(field,path){return _getFormInput(field,path)}