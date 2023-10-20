import Axios from "axios";
import AIODate from "./../../npm/aio-date/aio-date";
import AIOStorage from './../../npm/aio-storage/aio-storage';
import AIOPopup from "../aio-popup/aio-popup";
import './index.css';
import $ from "jquery";
export let helper = {
  showAlert(obj = {}){
    let inst = new AIOPopup();
    inst.addAlert(obj)
  },
  getDateAndTime(value){
    try{
      let res = AIODate().toJalali({date:value});
      let miliseconds = AIODate().getTime({date:value})
      let [year,month,day,hour,minute] = res;
      let date = `${year}/${month}/${day}`;
      let time = `${hour}:${minute}`;
      let delta = AIODate().getDelta({date:value});
      let remainingTime = delta.type === 'passed'?{day:0,hour:0,minute:0,second:0}:delta;
      let passedTime = delta.type === 'remaining'?{day:0,hour:0,minute:0,second:0}:delta;
      return {date,time,dateAndTime:`${date} ${time}`,remainingTime,passedTime,miliseconds}
    }
    catch{
      return {date:'',time:'',dateAndTime:'',remainingTime:0,passedTime:0,miliseconds:0}
    }
  },
  arabicToFarsi(value){
    try{return value.replace(/ك/g, "ک").replace(/ي/g, "ی");}
    catch{return value}
  }
}
export default class AIOservice{
  constructor(props){
    AIOServiceValidate(props);
    let {id,loader,getState,token,getApiFunctions = ()=>{return {}},getMockFunction = ()=> {return {}},onCatch = ()=>{},baseUrl,getError = ()=>{}} = props;
    this.id = id;
    this.storage = AIOStorage(this.id);
    this.loader = loader;
    this.getState = getState;
    this.token = token;
    this.apiFunctions = getApiFunctions({getState,token,helper,baseUrl,Axios,storage:this.storage});
    this.mockFunctions = getMockFunction({getState,token,helper,baseUrl,Axios,storage:this.storage}); 
    this.onCatch = onCatch;
    this.getError = getError;
  }
  removeCache = (name) => this.storage.remove({name});
  getCache = () => this.storage.getModel();
  getLoading = (id) => {
    return (`
      <div class="aio-service-loading" id="${id}">
        <div class="aio-service-loading-0">
          <div class="aio-service-loading-1">
            <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.0s infinite normal none running aioserviceloading;"></div>
            <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.1s infinite normal none running aioserviceloading;"></div>
            <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.2s infinite normal none running aioserviceloading;"></div>
            <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.3s infinite normal none running aioserviceloading;"></div>
            <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.4s infinite normal none running aioserviceloading;"></div>
          </div>
        </div>
      </div>
    `)
  }
  handleLoading = (service,state) => {
    let {loading = true,loadingParent = 'body',api} = service;
    if(!loading){return}
    if(state){$(loadingParent).append(typeof this.loader === 'function'?this.loader():this.getLoading(api));}
    else{
      let loadingDom = $('#' + api);
      if(!loadingDom.length){loadingDom = $('.aio-service-loading')}
      loadingDom.remove()
    }
  }
  getFromCache = (service) => {
    let {cache} = service;
    if(!cache){return}
    return this.storage.load({name:cache.name,time:cache.time})
  }
  handleError = (type,p) => {
    if(type === 'request'){
      let properties = [
        'token','api','def','description','message','cache','onError','onSuccess',
        'onCatch','getError','apiFunction','mockFunction','parameter','loading','loadingParent'
      ]
      for(let prop in p){
        if(properties.indexOf(prop) === -1){
          let error = `aio-service error => ${prop} is not a valid property for request object. valid proprties for request object is ${properties.split(' | ')}`
          helper.showAlert({type:'error',text:error});
          return error
        }
      }
      let error;
      if(!p.api){
        error = `aio-service error => missing api property in call request. request object is ${p}`
      }
      else if(p.cache && (typeof p.cache !== 'object' || typeof p.cache.name !== 'string' || typeof p.cache.time !== 'number')){
        error = `
          aio-service error => cache property request parameter object should be an object contain name:string and time:number.
          api is ${p.api}
        `
      }
      if(error){
        helper.showAlert({type:'error',text:error});
        return error
      }
    }
    if(type === 'apiFunction'){
      let error = `aio-service error => cannot find apiFunction. apiFunction should define in getApiFunctions result  or request object`
      helper.showAlert({type:'error',text:error});
      return error;
    }
    if(type === 'apiFunctionReturn'){
      let {res,service} = p;
      if((Array.isArray(res) || typeof res !== 'object') || (res.response === undefined && res.result === undefined)){
        let error = `
          aio-service error => apiFunction should return an object contain response and result.
          apiFunction name is ${service.api}
        `
        helper.showAlert({type:'error',text:error});
        return error;
      }
      for(let prop in res){
        if(['response','result'].indexOf(prop) === -1){
          let error = `
            aio-service error => apiFunction returned an object contain invalid property. 
            invalid property is : ${prop}
            apiFunction name is ${service.api}
          `
          helper.showAlert({type:'error',text:error});
          return error;
        }
      }
    }
    if(type === 'mockFunction'){
      let error = `aio-service error => apiFunction returns an object contain mock:true, but cannot find mockFunction. mockFunction should define in getMockFunctions props or request object`
      helper.showAlert({type:'error',text:error});
      return error;
    }
  }
  setToken = (token)=>{
    let res = token || this.token;
    if(res){Axios.defaults.headers.common['Authorization'] = `Bearer ${typeof res === 'function'?res():res}`;}
  }
  getResult = async (service) => {//return undefined(apiFunction not set) or string(error) or response
    let {
      api,parameter,
      onCatch = this.onCatch,
      getError = this.getError,
      apiFunction = this.apiFunctions[api],
      mockFunction = this.mockFunctions[api]
    } = service;
    try{
        if(!apiFunction){return this.handleError('apiFunction');}
        let res = await apiFunction(parameter);
        let resError = this.handleError('apiFunctionReturn',{res,service})
        if(resError){return resError;}
        let {response,result,mock} = res;
        if(mock){
          if(mockFunction){return mockFunction(parameter);}
          else {this.handleError('mockFunction',service)}
        }
        if(response){
          let error = getError(response,service);
          if(typeof error === 'string'){return error}
        }
        return result
    }
    catch(err){
      let catchResult = onCatch(err,service);
      if(typeof catchResult === 'string'){return catchResult}
      else{return err.message}  
    }
  }
  fetchData = async (service) => {
    let cacheResult = this.getFromCache(service); if(cacheResult !== undefined){return cacheResult}
    this.handleLoading(service,true);
    this.setToken(service.token);
    let res;
    try{res = await this.getResult(service);}
    catch(err){res = err.message;}
    this.handleLoading(service,false);
    return res;
  }
  
  validate = (result,service)=>{
    let {api,def,description,message = {}} = service
    description = (typeof description === 'function'?description():description) || api;
    if(typeof result === 'string'){
      if(message.error !== false){
        let text = message.error;
        if(text === undefined){text = `${description} با خطا روبرو شد`}
        helper.showAlert({type:'error',text,subtext:result});
      }
      return def === undefined?result:def;
    }
    else{
      if(message.success){
        let subtext = typeof message.success === 'function'?message.success(result):message.success;
        if(subtext === true){subtext = ''}
        helper.showAlert({type:'success',text:`${description} با موفقیت انجام شد`,subtext,time:message.time});
      }
    }
    return result;
  } 
  request = async (service)=> {
    let { onSuccess,cache,onError} = service;
    if(this.handleError('request',service)){return}
    let result = await this.fetchData(service);
    result = this.validate(result,service);
    if(cache){this.storage.save({name:cache.name,value:result})}
    if(onSuccess && typeof result !== 'string'){onSuccess(result);}
    if(onError && typeof result === 'string'){onError(result);}
    return result;
  }
}


function AIOServiceValidate({id,loader,getState,getApiFunctions}){
  let error;
  if(typeof getApiFunctions !== 'function'){
    error = `
      aio-service error => missing getApiFunctions props. getAPiFunctions is a function that returns an object contain apiFunctions.
    `
  }
  if(typeof id !== 'string'){
    error = `
      aio-service error => id props should be an string
    `
  }
  if(loader && typeof loader !== 'function'){
    error = `
      aio-service error => loader props should be a function
    `
  }
  if(getState && typeof getState !== 'function'){
    error = `
      aio-service error => getState props should be a function
    `
  }
  if(error){alert(error); console.log(error)}
}