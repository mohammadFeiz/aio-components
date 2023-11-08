import React,{Component} from "react";
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
                {Titr('Create Instance')}
                {
                    Code(`
import myApiFunctions from './my-api-function';

let apis = new AIOService({
    id:'my app',
    getApiFunctions:myApiFunctions,
    token:'......',
    baseUrl:'https://my-route/api/v1', 
    onCatch:(error)=>{
        if(error.response){
            return error.response.data.Message
        }
    }, 
    getError:(response)=>{
        if(!response.data.isSuccess){return response.data.message}
    },
    loader:<Loading/>,
})

this.setState({apis});
                    `)
                }
                {DescList([
                    ['id','required - string - should set a uniq id'],
                    ['getApiFunctions','required - function - returns an object contain api functions'],
                    ['token','optional - string - this token will set on all requests'],
                    ['baseUrl','optional - string - set base url'],
                    ['onCatch','optional - function - get catched requests response and should returns an string as error message'],
                    ['getError','optional - function - get each requests response and if is there any error should returns an string as error message'],
                    ['loader','optional - html/jsx - set custom loader']
                ])}
                {Titr('getApiFunctions property')}
                <p>you should write a function as getApiFunctions that returns an object contain api functions.</p>
                <p>in your project you can write all requests in this function and you can call them in all over your app.</p>
                <p>getApiFunctions get an object as parameter contain:</p>
                {DescList([
                    ['Axios','Axios dependecy for requests , use this for prevent import it'],
                    ['baseUrl','base url (in creation of instance).']
                ])}
                <p>each functin take 2 parameters(parameter and appState)</p>
                {DescList([
                    ['parameter','is parameter of function that you can call api function by it'],
                    ['appState','is return result of getState function. this is for read app information in all api functions for prevent send any thing to these functions']
                ])}
                <p>each functin each function should returns an object contain response and result</p>
                {DescList([
                    ['response','return response for error handling'],
                    ['result','return result of request to your app']
                ])}
                {Desc(
                        
                )}
                
                {
                    Code(`
function myApiFunctions({Axios,baseUrl}){
    return {
        async getUserInfo(parameter,appState){
            let url = \`${'${baseUrl}/GetUserInfo'}\`;
            let response = await Axios.get(url);
            let result = response.data.UserInfo;
            return {response,result}
        },
        async getMyOrders(parameter,appState){
            let url = \`${'${baseUrl}/GetOrders'}\`;
            let body = {
                userId:appState.userInfo.id,
                orderType:parameter
            }
            let response = await Axios.post(url,body);
            let result = response.data.data;
            return {response,result}
        }
    }
}
                    `)
                }
                {Titr('1 - instance methods(request)')}
                {DescList([
                    ['apis.request','in all over of your app wherever you have access to instance of AIOService class, you can call api functions by call instance.request method']   
                ])}
                {
                    Code(`
const apis = new AIOService({...});
let res = await apis.request({
    api:'getMyOrders',
    parameter:0,
    description:'get user info',
    onSuccess:(result)=>{
        //for example this.setState({users:result})
    },
    onError:()=>{//optional
        //for example this.close()
    },
    def:[],
    message:{
        error:'my custom error message',
        success:true
    },
    cache:{
        name:'cache name',
        time:24 * 60 * 60 * 1000
    },
    loading:false,
    loadingParent:'.my-box',
    token:'....',
    getError:(response)=>!response.data.isSuccess?response.data.message
})
                    `)
                }
                {DescList([
                    ['api','required - name of api function that writed in getMyApiFunction return object'],
                    ['parameter','value that api function will take as parameter (in this example 0)'],
                    ['description','description of action. use in generate alert messages'],
                    ['onSuccess','optional - A function that is called with the result if the request is successful. dont need async and await'],
                    ['onError','optional - A function that is called in case of an error in the request'],
                    ['def','optional - any types - In case of error, this value will be returned as a result'],
                    ['message','optional - handle alert messages of request'],
                    ['message.error','set false for prevent show error alert, set string for show custom message as alert'],
                    ['message.success','set true for alert success message automatically. set string for alert custom success message. if not set , success message will not show '],
                    ['cache','optional - you can set cache for api function result and next time result will read from cache storage'],
                    ['cache.name','name of cache for isolate cache results'],
                    ['cache.time','set a number to set time of caching. for example if you set 24 * 60 * 60 * 1000 , api function result will cache for 24 hours'],
                    ['loading','for prevent show loader set loading false. default is true,'],
                    ['loadingParent','optional - you can set container selector of loading, by default will render in center of screen'],
                    ['token','optional - If you have set the token in the instance creation, you dont need to set the token here'],
                    ['getError','optional - If you have set the getError in the instance creation, you dont need to set it here']
                ])}
                {Titr('2 - instance methods ( setToken )')}
                {DescList([
                    ['apis.setToken','change token of instance by call instance.setToken(token)']   
                ])}
                {
                    Code(`
apis.setToken(token);
                    `)
                }
                {Titr('3 - instance methods ( getCache )')}
                {DescList([
                    ['apis.getCache','get chached object that is contain of all cached api functions result']   
                ])}
                {
                    Code(`
let cacheModel = apis.getCache();
                    `)
                }
                {Titr('4 - instance methods ( setCache )')}
                {DescList([
                    ['apis.setCache','change a cached value']   
                ])}
                {
                    Code(`
// first parameter is cache name and second parameter is value to change
apis.setCache('orders',[]);
                    `)
                }
                {Titr('5 - instance methods ( removeCache )')}
                {DescList([
                    ['apis.removeCache','remove a cached value']   
                ])}
                {
                    Code(`
// parameter is name of cached value to remove
apis.removeCache('orders');
                    `)
                }
                {Titr('6 - instance methods ( setProperty )')}
                {DescList([
                    ['apis.setProperty','change properties of instance']   
                ])}
                {
                    Code(`
apis.setProperty('getState',()=>this.state);
apis.setProperty('loader',<Loading/>);
apis.setProperty('baseUrl','https://apis/v1');
                    `)
                }
                {Titr('manage api functions')}
                {DescList([['get-api-functions.js']])}
                {
                    Code(`

import userApiFunctions from './user-api-functions';
import orderApiFunctions from './order-api-functions';

export default function getApiFunctions({Axios,baseUrl}){
    return {
        user:userApiFunctions({Axios,baseUrl}),
        orders:orderApiFunctions({Axios,baseUrl})
    }
}
                    `)
                }
                {DescList([['user-api-functions.js']])} 
                {
                    Code(`

export default function userApiFunctions({Axios,baseUrl}){
    return {
        async getUserInfo(parameter,appState){
            let url = \`${'${baseUrl}/GetUserInfo'}\`;
            let response = await Axios.get(url);
            let result = response.data.UserInfo;
            return {response,result}
        },
        ....
    }
}
                    `)
                }
                {DescList([['order-api-functions.js']])}
                {
                    Code(`

export default function orderApiFunctions({Axios,baseUrl}){
    return {
        async getMyOrders(parameter,appState){
            let url = \`${'${baseUrl}/GetOrders'}\`;
            let body = {
                userId:appState.userInfo.id,
                orderType:parameter
            }
            let response = await Axios.post(url,body);
            let result = response.data.data;
            return {response,result}
        },
        ....
    }
}
                    `)
                }
                {DescList([['call nested api functions']])}
                {
                    Code(`

let res = await apis.request({
    api:'orders.getMyOrders',
    parameter:0,
    description:'get user info',
    def:[],
    onSuccess:(orders)=>this.setState({orders})
})
                    `)
                }

                <div className='aio-component-splitter'></div>
            </div>
        )
    }
}

