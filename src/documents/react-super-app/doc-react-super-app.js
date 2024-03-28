import React,{Component} from 'react';
import DOC from '../../resuse-components/doc.tsx';
import Table from '../../npm/aio-table/aio-table';
export default class DOC_AIOForm extends Component{
    render(){
        return (
            <DOC
                {...this.props}
                navId='body'
                nav={{
                    items:[
                        {text:'navs',id:'navs',render:()=><Navs/>},
                        {text:'navId',id:'navId',render:()=><NavId/>},
                        {text:'navHeader',id:'navHeader',render:()=><NavHeader/>},
                        {text:'body',id:'body',render:()=><Body/>},
                    ]
                }}
            />
        )
    }
}


class Navs extends Component{
    render(){
        return (
            <div className='example'>
                <div className='aio-component-label'>navs props:</div>
                <Table
                    model={[
                        {type:'Array Of Objects',required:'yes',description:'main navigation bar options'}
                    ]}
                    columns={[
                        {title:'Type',field:'row.type',width:140},
                        {title:'Required',field:'row.required',width:140},
                        {title:'Description',field:'row.description'}
                    ]}
                />
                <div className='aio-component-label'>each nav object properties:</div>
                <Table
                    model={[
                        {property:'id',type:'string',required:'Yes',description:'navigation option id'},
                        {property:'text',type:'string',required:'No',description:'navigation option text'},
                        {property:'icon',type:'function',required:'No',description:'navigation option icon. (active) => html'},
                        {property:'navs',type:'array of objects',required:'No',description:'navigation option sub navs.'}
                    ]}
                    columns={[
                        {title:'Property',field:'row.property',width:140},
                        {title:'Type',field:'row.type',width:140},
                        {title:'Required',field:'row.required',width:140},
                        {title:'Description',field:'row.description'}
                    ]}
                />
            </div>
        )
    }
}

class NavId extends Component{
    render(){
        return (
            <div className='example'>
                <div className='aio-component-label'>navId props:</div>
                <Table
                    model={[
                        {type:'string',required:'No. default is first nav option id',description:'define active nav option id'}
                    ]}
                    columns={[
                        {title:'Type',field:'row.type',width:140},
                        {title:'Required',field:'row.required',width:140},
                        {title:'Description',field:'row.description'}
                    ]}
                />
            </div>
        )
    }
}

class NavHeader extends Component{
    render(){
        return (
            <div className='example'>
                <div className='aio-component-label'>navHeader props:</div>
                <Table
                    model={[
                        {type:'function',required:'No',description:'returns navigaton bar header html'}
                    ]}
                    columns={[
                        {title:'Type',field:'row.type',width:140},
                        {title:'Required',field:'row.required',width:140},
                        {title:'Description',field:'row.description'}
                    ]}
                />
            </div>
        )
    }
}

class Body extends Component{
    render(){
        return (
            <div className='example'>
                <div className='aio-component-label'>body props:</div>
                <Table
                    model={[
                        {type:'function',required:'Yes',description:'get rsa state contain navId and returns page html. ({navId})=>page html'}
                    ]}
                    columns={[
                        {title:'Type',field:'row.type',width:140},
                        {title:'Required',field:'row.required',width:140},
                        {title:'Description',field:'row.description'}
                    ]}
                />
            </div>
        )
    }
}
