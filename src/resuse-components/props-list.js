import React ,{Component} from 'react';
import RVD from './../npm/react-virtual-dom/react-virtual-dom';
export default class PropsList extends Component{
    render(){
        let {props} = this.props;
        return (
            <RVD
                layout={{
                    style:{padding:12},
                    column:props.map((o)=>{
                        return (
                            {html:<PropsListItem {...o}/>,style:{borderBottom:'1px solid #ddd'}}
                        )
                    })
                }}
            />
        )
    }
}


class PropsListItem extends Component{
    render(){
        let {props,type,description} = this.props;
        return (
            <RVD
                layout={{
                    column:[
                        {
                            align:'v',
                            row:[
                                {size:100,html:'Props',className:'bold size14'},
                                {size:12},
                                {html:props,className:'size12 bold'},
                                {size:6},
                                {html:`(${type})`,className:'size12'}
                            ]
                        },
                        {
                            align:'v',
                            row:[
                                {size:100,html:'Description',className:'bold size14'},
                                {size:12},
                                {html:description,className:'size12'}
                            ]
                        }
                    ]
                }}
            />
        )
    }
}