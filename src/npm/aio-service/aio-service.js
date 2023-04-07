import Axios from "axios";
import AIODate from "./../../npm/aio-date/aio-date";
import AIOStorage from './../../npm/aio-storage/aio-storage';
import './index.css';
import $ from "jquery";
export let helper = {
  showAlert(obj = {}){
    let {type = '',text = '',subtext = '',icon} = obj;
    let svg = icon || {
        error:(`<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" style="fill: red;"></path></svg>`),
        warning:(`<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" style="fill: orange;"></path></svg>`),
        info:(`<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" style="fill: dodgerblue;"></path></svg>`),
        success:(`<svg viewBox="0 0 24 24" role="presentation" style="width: 4.5rem; height: 4.5rem;"><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" style="fill: green;"></path></svg>`)
    }[type] || ''
    let dui = 'aa' + Math.round((Math.random() * 100000000))
    let str = `
      <div class='aio-service-alert-container ${dui}'>
        <div class='aio-service-alert'>
          <div class='aio-service-alert-header'>${svg}</div>
          <div class='aio-service-alert-body'>
            <div class='aio-service-alert-text'>${text}</div>
            <div class='aio-service-alert-subtext'>${subtext}</div>
          </div>
          <div class='aio-service-alert-footer'>
            <button class='aio-service-alert-close ${dui}'>بستن</button>    
          </div>    
        </div>    
      </div>
    `
    $('body').append(str);
    $('.' + dui).on({click:function(){
        $('.' + dui).remove()
    }})
  },
  getDateAndTime(value){
    let res = AIODate().toJalali({date:value});
    let [year,month,day,hour,minute] = res;
    let date = `${year}/${month}/${day}`;
    let time = `${hour}:${minute}`;
    let delta = AIODate().getDelta({date:value});
    let remainingTime = delta.type === 'passed'?{day:0,hour:0,minute:0,second:0}:delta;
    let passedTime = delta.type === 'remaining'?{day:0,hour:0,minute:0,second:0}:delta;
    return {date,time,dateAndTime:`${date} ${time}`,remainingTime,passedTime}
  },
  arabicToFarsi(value){
    try{return value.replace(/ك/g, "ک").replace(/ي/g, "ی");}
    catch{return value}
  }
}
export default function services({getState,apis,token,loader,id,getResponses = ()=>{return {}},getError = ()=>{}}) {
  if(typeof id !== 'string'){console.error('aio-storage => id should be an string, but id is:',id); return;}
  if(token){Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;}
  return Service(apis({Axios,getState,token}),loader,id,getResponses(),getError)
}



function AIOServiceLoading(id){
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

function Service(services,loader,id,getResponses,getError) {
  function validate(result,{validation,api,def,errorMessage,name,successMessage}){
    if(validation){
      let message = JSONValidator(result,validation);
      if(typeof message === 'string'){
        helper.showAlert({type:'error',text:`apis().${api}`,subtext:message});
        return def === undefined?result:def;
      }
    }
    if(typeof result === 'string'){
      if(name){
        helper.showAlert({type:'error',text:`${name} با خطا روبرو شد`,subtext:result});
      }
      return def === undefined?result:def;
    }
    else{
      if(successMessage){
        successMessage = typeof successMessage === 'function'?successMessage():successMessage
        if(successMessage === true){successMessage = ''}
        helper.showAlert({type:'success',text:`${name} با موفقیت انجام شد`,subtext:successMessage});
      }
    }
    return result;
  }
  
  async function fetchData(obj){
    let {api,parameter,cache,loading,loadingParent,cacheName,def,getResult} = obj;
    let result;
    if (cache) {
      if(isNaN(cache)){console.error('aio-storage => cache should be a number, but cache is:',cache); return;}
      let storage = AIOStorage(id);
      let result = storage.load({name:cacheName ? 'storage-' + cacheName : 'storage-' + api,time:cache})
      if(result !== undefined){return result}
    }
    if(loading){$(loadingParent).append(typeof loader === 'function'?loader():AIOServiceLoading(api));}  
    try{
      let response;
      if(getResponses[api]){
        response = await getResponses[api](parameter);
        try{
          response = getError(response,api) || response;
        }
        catch(err){
          response = err.message
        }
      }
      if(typeof response === 'string'){result = response;}
      else{
        if(getResult){result = await getResult(response)}
        else if(services[api]){result = await services[api](parameter,response);}  
      }
    }
    catch(err){
      helper.showAlert({type:'error',text:`apis().${api}`,subtext:err.message});
      result = err.message;
    }
    if(loading){
      let loadingDom = $('#' + api);
      if(!loading.length){loadingDom = $('.aio-service-loading')}
      loadingDom.remove()
    }
    return result;
  }
  return async (obj) => {
    let { callback,cache,cacheName,api} = obj;
    let result = await fetchData(obj);
    result = validate(result,obj);
    if (cache) {AIOStorage(id).save({name:cacheName ? 'storage-' + cacheName : 'storage-' + api,value:result})}
    if(callback){
      if(typeof result !== 'string'){callback(result);}
    }
    return result;
  }
}

function JSONValidator(json,config){
  let obj = {
    getType(value){
        let type = typeof value;
        if(Array.isArray(value)){type = 'array'}
        return type
    },
    checkType_req(config,res,resultText,shouldBe){
      if(typeof config === 'function'){config = config(res)}
      if(Array.isArray(config)){
        if(this.getType(res) !== 'array'){
          return `${resultText} is ${this.getType(res)} ${shouldBe !== undefined?` but should be ${JSON.stringify(shouldBe)}`:''}`
        }
        for(let i = 0; i < res.length; i++){
          let o = res[i];
          let result = this.checkType(config[0],o,`${resultText}[${i}]`,config[0])
          if(result){
              return result
          }
        }
      }
      else if(typeof config === 'object'){
        if(this.getType(res) !== 'object'){
          return `${resultText} is ${this.getType(res)} ${shouldBe !== undefined?` but should be ${JSON.stringify(shouldBe)}`:''}`
        }
        for(let prop in config){
          let result = this.checkType(config[prop],res[prop],prop,config[prop])
          if(result){
            return result
          }
        }
      }
      else if(config !== this.getType(res)){
        return `${resultText} is ${JSON.stringify(res)} ${shouldBe !== undefined?` but should be ${JSON.stringify(shouldBe)}`:''}`
      }
    },
    checkType(config,res,resultText = 'result'){
      if(typeof config === 'string' && config.indexOf(',') !== -1){
        config = config.split(',');
        let finalResult;
        let isThereError = true;
        for(let i = 0; i < config.length; i++){
          let result = this.checkType_req(config[i],res,resultText,config)
          if(result){finalResult = result}
          else{isThereError = false}
        }
        if(isThereError){return finalResult}
      }
      else{
        return this.checkType_req(config,res,resultText,config)
      }
    }
  }
  return obj.checkType(config,json)
}