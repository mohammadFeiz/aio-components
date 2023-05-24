import React,{Component} from "react";
import Code from './../../code/index'; 
import infosrc from './images/info.png';
import successsrc from './images/success.png';
import errorsrc from './images/error.png';
import warningsrc from './images/warning.png';
import AIODoc from './../../npm/aio-documentation/aio-documentation';
export default class DOCAIOService extends Component{
    render(){
        let {goToHome} = this.props;
        let {Code,DescList,Titr,Desc} = AIODoc();
        return (
            <div className='example'>
                <button onClick={()=>goToHome()}>Back To Home</button>
                <h4>
                aio-service is a dependency for handle all apis and server requests in your application
                </h4>
                {Titr('Install')}
                {Code('npm i aio-service')}
                {Titr('Import')}
                {
                    Code(`
import AIOService from 'aio-service';                
                    `)
                }
                {DescList([
                    ['AIOService','is apis component'],
                ])}
                {Titr('Create Instance')}
                {
                    Code(`
let getResponse = function(obj){
    let {getState,helper,baseUrl} = obj;
    //baseUrl is 'https://10.10.10.22:8080'
    let {
        showAlert,//a function for show alert
        getDateAndTime,//a function that get a date as parameter and returns an object contain jalali date and time
        arabicToFarsi,//a function that get an string as parameter and returns converted arabic to farsi
        splitNumber// a function that get an number as parameter and returns splitted string of number
    } = helper;
    return {
        async myWallet(){
            // for example getState is a function that returns app state object contain profile object
            // in this api function we will create body of post request by profile.id
            let {profile} = getState();
            
            let response = await Axios.post(baseUrl + '/api/v1/Wallet',{UserId:profile.id});
            let result = res.data.data;
            return {response,result}
            // if type of result be an strings mean this api is on the error and error messsage is this string 
        },
        getMembers(){
            //for example in this api we will get jalali date and time of registeration
            //for example in this api we will convert member names from arabic to farsi
            let response = Axios.get(baseUrl + '/api/v1/AllMembers');
            let result = res.data.data.map((o)=>{
                let {date,time} = getDateAndTime(o.RegisterDate)
                return {
                    ...o,
                    registerDate:date,
                    registerTime:time,
                    name:arabicToFarsi(o.Name),
                    salary:splitNumber(o.Salary) + ' ریال'
                    //salary example : 123,456,789
                }
            });
            return {response,result}
            // if type of result be an strings mean this api is on the error and error messsage is this string 
        },
        addMember(parameter){
            //for example in this api function we send an object contain id as parameter
            let response = Axios.post(baseUrl + '/api/v1/AddMember',{MemberId:parameter.id});
            let result = res.data.data;
            return {response,result}
        },
        getHistory(){
            //for example in this api function we will show an alert if data is empty
            let response = Axios.get(baseUrl + '/api/v1/History');
            let result = res.data.data
            if(!result.length){
                showAlert({
                    type:'warning',
                    text:'Empty History',
                    subtext:'your history is empty'      
                })
            }
            return {response,result};
        }
        ...
    }
}
function getError(response){ 
    if (!response.data.IsSuccess) { return response.data.Message } 
}
function getState(){
    //return application data required in api function
}
let Services = AIOService({
    getResponse, //function - required - a function that returns an object contain api functions
    getError,//function - optional - this function will check all apis for handle error messages
    getState,//function - optional - use in apis function (access api functions to application data)
    token,//string - required - this token will set in header of all requests
    id,//string - required - you should set an uniq id for this instance(use in cache manager)
    loader,//function - optional - this function should returns customized loading (html),
    baseUrl//string base of all urls
});
//Services is instance of aio-service. Services is a function. for all requests in application we will call Services.
                    `)
                }
                <h3>getResponse</h3>
                {DescList([
                    ['getResponse','is a function that returns an object contains api functions'],
                    ['getResponse','get an object as parameter contain:']
                ])}
                {DescList([
                    ['getState','a function that returns application state for use in api functions, we sent it in create instance'],
                    ['helper','is an object contains functions for help manipulating data'],
                    ['baseUrl','base of all urls'],
                ])} 
                {Titr('helper')}
                {Desc(`
                    is an object contain some functions for manupulating data
                `)}
                {DescList([['helper.splitNumber(number,count)']])}
                {
                    Code(`
let result = helper.splitNumber(12345678,3);
//result is "12,345,678"
                    `)
                }
                {DescList([['helper.getDateAndTime(date)']])}
                {
                    Code(`
let result = helper.getDateAndTime('2015-03-25T12:00:00Z');
let {date,time} = result;
//date is "1394/1/5"
//time is "12:0"
                    `)
                }
                {DescList([['helper.arabicToFarsi(text)']])}
                {
                    Code(`
let result = helper.arabicToFarsi('یك متن تستي');
//result is 'یک متن تستی'
                    `)
                }
                {DescList([['helper.showAlert({type,text,subtext})']])}
                <table>
                    <tr>
                        <td>
                            {Code(`
showAlert({
    type:'info',
    text:'example text',
    subtext:'example subtext'
})
                            `)}
                        </td>
                        <td>
                            <img src={infosrc} height={164}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {Code(`
showAlert({
    type:'success',
    text:'example text',
    subtext:'example subtext'
})
                            `)}
                        </td>
                        <td>
                            <img src={successsrc} height={164}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {Code(`
showAlert({
    type:'error',
    text:'example text',
    subtext:'example subtext'
})
                            `)}
                        </td>
                        <td>
                            <img src={errorsrc} height={164}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {Code(`
showAlert({
    type:'warning',
    text:'example text',
    subtext:'example subtext'
})
                            `)}
                        </td>
                        <td>
                            <img src={warningsrc} height={164}/>
                        </td>
                    </tr>
                </table>        
                {Titr('getError (function) (optional)')}
                {
                    Code(`
function getError(response){ 
    if (!response.data.IsSuccess) { return response.data.Message } 
}
                    `)
                }
                {Desc(`
                    this function will call for all responses to handle api error messages.
                    if this function returns an string , user will see an alert by this string.
                `)}
                        
                {Titr('Use api functions in your application')}
                {DescList([
                    ['Services','function is instance of aio-service that we call it in our application'],
                ])}
                {Desc('for call api functions we call Services by an object')}
                {Desc('this object can have some properties :')}  
                {DescList([
                    ['api','api function name'],
                    ['name','description of api action'],
                    ['parameter','is parameter of api function and it can have any types .'],
                    ['cache','is an number(miliseconds) that cache result of api function for Duration of this number in milliseconds .'],
                    ['cacheName','is an string that define name of result to cache. an api function can cache multi results by different names .'],
                    ['loading','is a boolean (default is true). if true , api function will show loading during the request .'],
                    ['loadingParent','is an string (element selector). we can set parent element of loading by set loadingParent selector string .'],
                    ['def','can have any types. we can set default of api function result by def property and api function will returned it When the api function encountered any errors . '],
                    ['errorMessage','(boolean or string) (default is true) for prevent error alert set it false. for customize error alert set it an string. and if true that will alert by api name'],
                    ['successMessage','if you set successMessage property and api function returns any values exept an string, we will see an alert with this successMessage .'],
                    ['validation','define structure of api function result.'],
                    ['onError','function is will call after error'],
                ])}
                {
                    Code(`
let walletValue = await Services({api:'myWallet'});

let members = await Services({api:'getMembers'});

async function addMember(id){
    return Services({api:'addMember',parameter:{id}});
}
let newMember = await addMember('12343432');

let history = await Services({api:'getHistory'});
                    
                    `)
                }    
                <ul>
                    <li>
                        <mark>Services</mark> is aio-service instance that we create it  
                    </li>
                    <li>
                        <mark>api</mark> is api function name 
                    </li>
                    <li>
                        <mark>parameter</mark> is parameter of api function 
                    </li>
                </ul>
                <h4>Cache api</h4>
                {
                    Code(`
let members = await Services({
    api:'getMembers',
    cache:24 * 60 * 60 * 1000
});
                    `)
                }
                
<h5>
    in this case we will cache result for 24 hours and if this result is exist in cache request will not sent.
    instead result will returned from cache
</h5>
                <h4>Show Error Message</h4>
                {
                    Code(`
let members = await Services({
    api:'getMembers',
    errorMessage:'failed to get members!!!'
});

                    `)
                }
<h5>
    in this case we send error message. if api function returns an string, we will see an alert with this errorMessage as text and returned string as subtext
</h5>
                <h4>Show Success Message</h4>
                {
                    Code(`
let members = await Services({
    api:'addMember',
    parameter:{id:..},
    successMessage:'adding new member was successful'
});
                    `)
                }
                
<h5>
    in this case we send success message. if api function returns any values exept an string, we will see an alert with this successMessage
</h5>
                
                <h4>Prevent Show Loading</h4>
<h5>
    by default each api functions will show loading. for prevent show loading set loading to false.
</h5>                
                {
                    Code(`
let newMembers = await Services({
    api:'addMember',
    parameter:{id:..},
    loading:false
});
                    `)
                }
                <h4>show loading in custom place</h4>
<h5>
    by default loading will show in center of screen. for show loading in custom place set loadingParent selector.
</h5>                
                {
                    Code(`
let members = await Services({
    api:'addMember',
    parameter:{id:..},
    loadingParent:'#my-panel'
});

                    `)
                }
                <h4>validation</h4>
                in this example api function should returns an array contain objects.
                <br/>
                each object should contains:
                <br/>
                <ul>
                    <li>
                        registerDate (string)
                    </li>
                    <li>
                        registerTime (string)
                    </li>
                    <li>
                        name (string)
                    </li>
                    <li>
                        active (boolean or undefined)
                    </li>
                    <li>
                        salary (number)
                    </li>
                    <li>
                        skills (array). each skill should be an string
                    </li>
                    <li>
                        info (object). info should be contain age (number) , phone (string) and address (string or undefined)
                    </li>
                </ul>
                <br/>
                if result of api function does not match with this pattern , api function will show an alert box by automatic error message and if you set def, def will be returned

                {
                    Code(`
let members = await Services({
    api:'getMembers',
    validation:[
        {
            registerDate:'string',
            registerTime:'string',
            name:'string',
            active:'boolean,undefined',
            salary:'number',
            skills:[
                'string'
            ],
            info:{
                age:'number',
                phone:'string',
                address:'string,undefined'
            }
        }
    ]
});

                    `)
                }
                <h4>def</h4>
                <div className='aio-component-splitter'></div>
            </div>
        )
    }
}

