import RVD from 'react-virtual-dom';
export default function Versions({goToHome}){
    const components = {
        'aio-input':{
            version:'8.0.2',
            "dependencies": {
                "@mdi/js": "7.0.96",
                "@mdi/react": "1.6.1",
                "jquery": "3.6.1",
                "react": "18.2.0",
                "react-dom": "18.2.0",
                "react-scripts": "5.0.1",
                "react-virtual-dom": "4.0.1",
                "aio-date": "4.0.0",
                "axios": "1.2.1",
                "aio-swip": "2.0.0",
                "aio-popup": "3.0.5"
            }
        },
        'aio-login':{
            version:'6.0.2',
            "dependencies": {
                "@mdi/js": "7.0.96",
                "@mdi/react": "1.6.1",
                "react": "18.2.0",
                "react-dom": "18.2.0",
                "react-scripts": "5.0.1",
                "react-virtual-dom": "4.0.1",
                "aio-popup": "3.0.5",
                "aio-storage": "4.0.1",
                "aio-input": "8.0.2"
            }
        },
        'react-super-app':{
            version:'4.0.3',
            "dependencies": {
                "@mdi/js": "7.0.96",
                "@mdi/react": "1.6.1",
                "react": "18.2.0",
                "react-dom": "18.2.0",
                "react-scripts": "5.0.1",
                "aio-popup": "3.0.5",
                "aio-storage": "4.0.1",
                "react-virtual-dom": "4.0.1"
            }            
        },
        'aio-service':{
            version:'6.1.2',
            "dependencies": {
                "jquery": "3.6.1",
                "aio-date": "4.0.0",
                "aio-storage": "4.0.1",
                "axios": "1.2.1"
            }
        },
        'aio-popup':{
            version:'3.0.5',
            "dependencies": {
                "@mdi/js": "7.0.96",
                "@mdi/react": "1.6.1",
                "jquery": "3.6.1",
                "react": "18.2.0",
                "react-dom": "18.2.0",
                "react-scripts": "5.0.1",
                "react-virtual-dom": "4.0.1"
            }            
        },
        'react-virtual-dom':{
            version:'4.0.1',
            "dependencies": {
                "jquery": "3.6.0",
                "react": "17.0.0",
                "react-dom": "17.0.0"
            }
        },
        'aio-content-slider':{
            version:'1.0.0',
            "dependencies": {
                "jquery": "3.6.1",
                "react": "18.2.0",
                "react-dom": "18.2.0",
                "react-scripts": "5.0.1"
            }
        },
        'aio-swip':{
            version:'2.0.0',
            "dependencies": {
                "jquery": "3.6.1"
            }
        },
        'aio-date':{
            version:'4.0.0',
            dependencies:{}
        },
        'aio-storage':{
            version:'4.0.1',
            dependencies:{}
        },
        
    }
    let componentsList = Object.keys(components);
    return (
        <RVD
            layout={{
                style:{fontSize:12},
                column:[
                    {size:36,html:<button onClick={()=>goToHome()}>Go To Home</button>,align:'v',className:'p-h-12'},
                    {
                        column:componentsList.map((key)=>{
                            let {version,dependencies} = components[key];
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
                                        style:{background:'dodgerblue',color:'#fff',padding:6},
                                        row:[{html:key,flex:1},{html:version}]
                                    },
                                    {
                                        show:!!dependenciesList.length,
                                        column:[
                                            {
                                                style:{padding:6,paddingBottom:0,background:'#f7f7f7',color:'dodgerblue',fontWeight:'bold',fontSize:12},
                                                html:'Dependencies'  
                                            },
                                            {
                                                style:{padding:12,background:'#f7f7f7'},gap:2,
                                                column:dependenciesList.map((key)=>{
                                                    let version = dependencies[key];
                                                    let isUpToDate = !components[key]?true:(version === components[key].version);
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
                                        show:!!dependedTo.length,
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