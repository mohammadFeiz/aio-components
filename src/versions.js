import { useState } from 'react';
import RVD from './npm/react-virtual-dom/react-virtual-dom';
import Icon from '@mdi/react';
import { mdiChevronDown, mdiChevronRight } from '@mdi/js';
export default function Versions({goToHome}){
    let [components,setComponents] = useState({
        'aio-input':{
            open:false,
            version:'8.3.3',
            "dependencies": {
                "@mdi/js": "7.0.96",
                "@mdi/react": "1.6.1",
                "jquery": "3.6.1",
                "react-virtual-dom": "latest",
                "aio-date": "latest",
                "axios": "1.2.1",
                "aio-popup": "latest",
                "aio-storage":"latest"
            }
        },
        'aio-login':{
            open:false,
            version:'7.1.0',
            "dependencies": {
                "@mdi/js": "7.0.96",
                "@mdi/react": "1.6.1",
                "react-virtual-dom": "latest",
                "aio-popup": "latest",
                "aio-storage": "latest",
                "aio-input": "latest"
            }
        },
        'react-super-app':{
            open:false,
            version:'4.0.22',
            "dependencies": {
                "@mdi/js": "7.0.96",
                "@mdi/react": "1.6.1",
                "aio-popup": "latest",
                "aio-storage": "latest",
                "react-virtual-dom": "latest"
              },            
        },
        'aio-service':{
            open:false,
            version:'6.2.0',
            "dependencies": {
                "jquery": "3.6.1",
                "aio-date": "latest",
                "aio-storage": "latest",
                "axios": "1.2.1"
            }
        },
        'aio-popup':{
            open:false,
            version:'3.2.1',
            "dependencies": {
                "@mdi/js": "7.0.96",
                "@mdi/react": "1.6.1",
                "jquery": "3.6.1",
                "react-virtual-dom": "latest"
            }             
        },
        'react-virtual-dom':{
            open:false,
            version:'4.0.7',
            "dependencies": {
                "jquery": "3.6.0"
            }
        },
        'aio-content-slider':{
            open:false,
            version:'1.0.0',
            "dependencies": {
                "jquery": "3.6.1",
                "react": "18.2.0",
                "react-dom": "18.2.0",
                "react-scripts": "5.0.1"
            }
        },
        'aio-utils':{
            open:false,
            version:'2.1.0',
            "dependencies": {
                "jquery": "^3.6.1",
                "react-dom/server":"latest"
            },
        },
        'aio-date':{
            open:false,
            version:'4.1.0',
            dependencies:{}
        },
        'aio-storage':{
            open:false,
            version:'4.0.1',
            dependencies:{}
        }
    })
    let componentsList = Object.keys(components);
    return (
        <RVD
            layout={{
                style:{fontSize:12},
                column:[
                    {size:36,html:<button onClick={()=>goToHome()}>Go To Home</button>,align:'v',className:'p-h-12'},
                    {
                        column:componentsList.map((key)=>{
                            let {version,dependencies,open} = components[key];
                            let dependenciesList = Object.keys(dependencies);
                            let dependedTo = [];
                            for(let i = 0; i < componentsList.length; i++){
                                let name = componentsList[i];
                                if(name === key){continue}
                                let dependencies = components[name].dependencies;
                                if(dependencies[key]){dependedTo.push(name)}
                            }
                            return {
                                style:{border:'1px solid dodgerblue',marginBottom:3},
                                column:[
                                    {
                                        style:{background:'dodgerblue',color:'#fff',padding:6},align:'v',
                                        row:[
                                            {
                                                html:<Icon path={open?mdiChevronDown:mdiChevronRight} size={1}/>,size:36,align:'vh',
                                                onClick:()=>setComponents({...components,[key]:{...components[key],open:!open}})
                                            },
                                            {html:key,flex:1},
                                            {html:version}
                                        ]
                                    },
                                    {
                                        show:!!dependenciesList.length && !!open,
                                        column:[
                                            {
                                                style:{padding:6,paddingBottom:0,background:'#f7f7f7',color:'dodgerblue',fontWeight:'bold',fontSize:12},
                                                html:'Dependencies'  
                                            },
                                            {
                                                style:{padding:12,background:'#f7f7f7'},gap:2,
                                                column:dependenciesList.map((key)=>{
                                                    let version = dependencies[key];
                                                    let isUpToDate = !components[key] || version === 'latest'?true:(version === components[key].version);
                                                    let background = isUpToDate?'green':'red';
                                                    return {
                                                        style:{background:'#fff',padding:6},
                                                        row:[
                                                            {html:key,flex:1},
                                                            {html:version,style:{background,color:'#fff',padding:'0 3px'}}
                                                        ]
                                                    }
                                                })
                                            }
                                        ]
                                    },
                                    {
                                        show:!!dependedTo.length && !!open,
                                        column:[
                                            {
                                                style:{padding:6,paddingBottom:0,background:'#f7f7f7',color:'dodgerblue',fontWeight:'bold',fontSize:12},
                                                html:'Depended To'  
                                            },
                                            {
                                                style:{padding:12,background:'#f7f7f7'},gap:2,
                                                column:dependedTo.map((key)=>{
                                                    return {
                                                        style:{background:'#fff',padding:6},
                                                        row:[
                                                            {html:key,flex:1},
                                                        ]
                                                    }
                                                })
                                            }
                                        ]
                                    }
                                ]
                            }
                        })
                    }
                ]
            }}
        />
    )   
}