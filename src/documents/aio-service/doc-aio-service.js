import React,{Component} from "react";
import Code from './../../code/index'; 
import infosrc from './images/info.png';
import successsrc from './images/success.png';
import errorsrc from './images/error.png';
import warningsrc from './images/warning.png';
export default class DOCAIOService extends Component{
    render(){
        let {goToHome} = this.props;
        return (
            <div className='example'>
                <button onClick={()=>goToHome()}>Back To Home</button>
                <h4>
                aio-service is a dependency for handle all apis and server requests in your application
                </h4>
                <div className='aio-component-label'>Instal</div>
                {Code('npm i aio-service')}
                <div className='aio-component-label'>Import</div>
                {
                    Code(`
import AIOService,{helper} from 'aio-service';                
                    `)
                }
                <ul>
                    <li>
                        <mark>AIOService</mark> is apis component 
                    </li>
                    <li>
                        <mark>helper</mark> is an object contains functions for help manipulating data 
                    </li>
                </ul>
                <div className='aio-component-label'>Create Instance</div>
                
                    {
                    Code(`
let Services = AIOService({
    apis, //function - required - a function that returns an object contain api functions
    token,//string - required - this token will set in header of all requests
    id,//string - required - you should set an uniq id for this instance(use in cache manager)
    getState,//function - optional - use in apis function (access api functions to application data)
    loader,//function - optional - this function should returns customized loading (html)
    checkAll//function - optional - this function will call in all api functions and get result of api function as parameter and you can check results of all api functions
});
                    `)}    
                <h3>apis</h3>
                <h5>
                    <mark>apis</mark> is a function that returns an object contains api functions 
                </h5>
                <h5>
                    <mark>apis</mark> get an object as parameter contain: 
                </h5>
                <ul>
                    <li>
                    <mark>Axios</mark> (axios component)                
                    </li>
                    <li>
                    <mark>getState</mark> (a function that returns application state for use in api functions, we sent it in create instance)
                    </li>
                </ul>
                {
                    Code(`
let apis = function(obj){
    let {
        showAlert,//a function for show alert
        getDateAndTime,//a function that get a date as parameter and returns an object contain jalali date and time
        arabicToFarsi,//a function that get an string as parameter and returns converted arabic to farsi
        splitNumber// a function that get an number as parameter and returns splitted string of number
    } = helper;
    let {Axios,getState} = obj;
    let baseUrl = 'https://10.10.10.22:8080'
    return {
        myWallet(){
            // for example getState is a function that returns app state object contain profile object
            // in this api function we will create body of post request by profile.id
            let {profile} = getState();
            
            let res = Axios.post(baseUrl + '/api/v1/Wallet',{UserId:profile.id});
            if(res.data.IsSuccess){
                return res.data.data;
            }
            else {
                //any returns of strings mean this api is on the error and error messsage is this string 
                return res.data.message
            }
        },
        getMembers(){
            //for example in this api we will get jalali date and time of registeration
            //for example in this api we will convert member names from arabic to farsi
            let res = Axios.get(baseUrl + '/api/v1/AllMembers');
            if(res.data.IsSuccess){
                return res.data.data.map((o)=>{
                    let {date,time} = getDateAndTime(o.RegisterDate)
                    return {
                        ...o,
                        registerDate:date,
                        registerTime:time,
                        name:arabicToFarsi(o.Name),
                        //use splitNumber of helper
                        //example 123,456,789
                        salary:splitNumber(o.Salary) + ' ریال'
                    }
                });
            }
            else {
                //any returns of strings mean this api is on the error and error messsage is this string 
                return res.data.message
            }
        },
        addMember(parameter){
            //for example in this api function we send an object contain id as parameter
            let res = Axios.post(baseUrl + '/api/v1/AddMember',{MemberId:parameter.id});
            if(res.data.IsSuccess){
                return res.data.data;
            }
        },
        getHistory(){
            //for example in this api function we will show an alert if data is empty
            let res = Axios.get(baseUrl + '/api/v1/History');
            if(res.data.IsSuccess){
                if(!res.data.data.length){
                    showAlert({
                        type:'warning',
                        text:'Empty History',
                        subtext:'your history is empty'      
                    })
                }
                else{
                    return res.data.data
                }
            }
        }
        ...
    }
}
                    
                                        `)
                }
                <div className='aio-component-label'>use helper functions in api functions</div>
                <mark>splitNumber</mark>
                {
                    Code(`
let result = helper.splitNumber(12345678,3);
//result is "12,345,678"
                    `)
                }
                <mark>getDateAndTime</mark>
                {
                    Code(`
let result = helper.getDateAndTime('2015-03-25T12:00:00Z');
let {date,time} = result;
//date is "1394/1/5"
//time is "12:0"
                    `)
                }
                <mark>arabicToFarsi</mark>
                {
                    Code(`
let result = helper.arabicToFarsi('یك متن تستي');
//result is 'یک متن تستی'
                    `)
                }
                <mark>showAlert</mark>
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
                <div className='aio-component-label'>Use api functions in your application</div>
                <mark>Services</mark> function is instance of aio-service that we call it in our application
                <br/>
                for call api functions we call Services by an object
                <br/>
                this object can have some properties : 
                <ul>
                    <li>
                        <mark>api</mark> api function name .
                    </li>
                    <li>
                        <mark>parameter</mark>is parameter of api function and it can have any types .
                    </li>
                    <li>
                        <mark>cache</mark> is an number(miliseconds) that cache result of api function for Duration of this number in milliseconds .
                    </li>
                    <li>
                        <mark>cacheName</mark> is an string that define name of result to cache. an api function can cache multi results by different names .
                    </li>
                    <li>
                        <mark>loading</mark> is a boolean (default is true). if true , api function will show loading during the request .
                    </li>
                    <li>
                        <mark>loadingParent</mark> is an string (element selector). we can set parent element of loading by set loadingParent selector string .
                    </li>
                    <li>
                        <mark>def</mark> can have any types. we can set default of api function result by def property and api function will returned it When the api function encountered any errors . 
                    </li>
                    <li>
                        <mark>errorMessage</mark> if you set errorMessage property and if api function returns an string, we will see an alert with this errorMessage as text and returned string as subtext .
                    </li>
                    <li>
                        <mark>successMessage</mark> if you set successMessage property and api function returns any values exept an string, we will see an alert with this successMessage .
                    </li>
                    <li>
                        <mark>validation</mark> define structure of api function result.
                    </li>
                </ul>
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

