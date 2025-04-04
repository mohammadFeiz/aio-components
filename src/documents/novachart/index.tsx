import { FC } from "react";
import { Chart } from "../../npm/aio-dashboard";


const App:FC = ()=>{
    return (
        <NovaChart

        />
    )
}
export default App
const NovaChart:FC = ()=>{
    return (
        <div className="msf">
            <Chart
                dataOption={({dataIndex})=>{
                    const color = [
                        'lightblue','rgb(47, 253, 157)','rgb(238, 196, 9)','rgb(231, 224, 159)','rgb(221, 119, 119)',
                        'rgb(15, 142, 216)','rgb(67, 170, 238)','rgb(190, 145, 204)','rgb(253, 215, 0)','rgb(148, 100, 61)'
                    ][dataIndex]
                    return {color,title:`طبقه ${dataIndex + 1}`}
                }}
                pointOption={({point,dataIndex})=>{
                    const color = [
                        'lightblue','rgb(47, 253, 157)','rgb(238, 196, 9)','rgb(231, 224, 159)','rgb(221, 119, 119)',
                        'rgb(15, 142, 216)','rgb(67, 170, 238)','rgb(190, 145, 204)','rgb(253, 215, 0)','rgb(148, 100, 61)'
                    ][dataIndex]
                    return {value:point.value,style:{fill:color}}
                }}
                datas={[
                    {
                        type:'bar',
                        points:[
                            {key:'1403/4/1',value:200},
                            {key:'1403/4/2',value:0},
                            {key:'1403/4/3',value:150},
                            {key:'1403/4/4',value:45},
                            {key:'1403/4/5',value:72},
                            {key:'1403/4/6',value:10},
                            {key:'1403/4/7',value:250},
                            {key:'1403/4/8',value:360},
                            {key:'1403/4/9',value:300},
                            {key:'1403/4/10',value:280},
                            {key:'1403/4/11',value:270},
                            {key:'1403/4/12',value:120},
                        ],
                    },
                    {
                        type:'bar',
                        points:[
                            {key:'1403/4/1',value:200},
                            {key:'1403/4/2',value:220},
                            {key:'1403/4/3',value:0},
                            {key:'1403/4/4',value:220},
                            {key:'1403/4/5',value:240},
                            {key:'1403/4/6',value:100},
                            {key:'1403/4/7',value:50},
                            {key:'1403/4/8',value:70},
                            {key:'1403/4/9',value:90},
                            {key:'1403/4/10',value:110},
                            {key:'1403/4/11',value:250},
                            {key:'1403/4/12',value:390},
                        ],
                    },
                    {
                        type:'bar',
                        points:[
                            {key:'1403/4/1',value:300},
                            {key:'1403/4/2',value:240},
                            {key:'1403/4/3',value:110},
                            {key:'1403/4/4',value:0},
                            {key:'1403/4/5',value:110},
                            {key:'1403/4/6',value:180},
                            {key:'1403/4/7',value:0},
                            {key:'1403/4/8',value:110},
                            {key:'1403/4/9',value:240},
                            {key:'1403/4/10',value:270},
                            {key:'1403/4/11',value:0},
                            {key:'1403/4/12',value:110},
                        ],
                    },
                    {
                        type:'bar',
                        points:[
                            {key:'1403/4/1',value:0},
                            {key:'1403/4/2',value:300},
                            {key:'1403/4/3',value:110},
                            {key:'1403/4/4',value:240},
                            {key:'1403/4/5',value:300},
                            {key:'1403/4/6',value:270},
                            {key:'1403/4/7',value:110},
                            {key:'1403/4/8',value:130},
                            {key:'1403/4/9',value:240},
                            {key:'1403/4/10',value:0},
                            {key:'1403/4/11',value:270},
                            {key:'1403/4/12',value:110},
                        ],
                    },
                    {
                        type:'bar',
                        points:[
                            {key:'1403/4/1',value:0},
                            {key:'1403/4/2',value:0},
                            {key:'1403/4/3',value:0},
                            {key:'1403/4/4',value:110},
                            {key:'1403/4/5',value:240},
                            {key:'1403/4/6',value:0},
                            {key:'1403/4/7',value:300},
                            {key:'1403/4/8',value:270},
                            {key:'1403/4/9',value:150},
                            {key:'1403/4/10',value:110},
                            {key:'1403/4/11',value:270},
                            {key:'1403/4/12',value:240},
                        ],
                    },
                    {
                        type:'bar',
                        points:[
                            {key:'1403/4/1',value:110},
                            {key:'1403/4/2',value:0},
                            {key:'1403/4/3',value:240},
                            {key:'1403/4/4',value:110},
                            {key:'1403/4/5',value:0},
                            {key:'1403/4/6',value:270},
                            {key:'1403/4/7',value:360},
                            {key:'1403/4/8',value:240},
                            {key:'1403/4/9',value:0},
                            {key:'1403/4/10',value:110},
                            {key:'1403/4/11',value:270},
                            {key:'1403/4/12',value:180},
                        ],
                    },
                    {
                        type:'bar',
                        points:[
                            {key:'1403/4/1',value:0},
                            {key:'1403/4/2',value:240},
                            {key:'1403/4/3',value:300},
                            {key:'1403/4/4',value:270},
                            {key:'1403/4/5',value:360},
                            {key:'1403/4/6',value:15},
                            {key:'1403/4/7',value:45},
                            {key:'1403/4/8',value:0},
                            {key:'1403/4/9',value:45},
                            {key:'1403/4/10',value:270},
                            {key:'1403/4/11',value:240},
                            {key:'1403/4/12',value:360},
                        ],
                    },
                    {
                        type:'bar',
                        points:[
                            {key:'1403/4/1',value:12},
                            {key:'1403/4/2',value:270},
                            {key:'1403/4/3',value:240},
                            {key:'1403/4/4',value:54},
                            {key:'1403/4/5',value:360},
                            {key:'1403/4/6',value:400},
                            {key:'1403/4/7',value:45},
                            {key:'1403/4/8',value:0},
                            {key:'1403/4/9',value:360},
                            {key:'1403/4/10',value:300},
                            {key:'1403/4/11',value:270},
                            {key:'1403/4/12',value:240},
                        ],
                    },
                    {
                        type:'bar',
                        points:[
                            {key:'1403/4/1',value:240},
                            {key:'1403/4/2',value:45},
                            {key:'1403/4/3',value:100},
                            {key:'1403/4/4',value:270},
                            {key:'1403/4/5',value:300},
                            {key:'1403/4/6',value:240},
                            {key:'1403/4/7',value:50},
                            {key:'1403/4/8',value:60},
                            {key:'1403/4/9',value:0},
                            {key:'1403/4/10',value:300},
                            {key:'1403/4/11',value:0},
                            {key:'1403/4/12',value:360},
                        ],
                    },
                    {
                        type:'bar',
                        points:[
                            {key:'1403/4/1',value:100},
                            {key:'1403/4/2',value:360},
                            {key:'1403/4/3',value:240},
                            {key:'1403/4/4',value:300},
                            {key:'1403/4/5',value:20},
                            {key:'1403/4/6',value:360},
                            {key:'1403/4/7',value:45},
                            {key:'1403/4/8',value:0},
                            {key:'1403/4/9',value:270},
                            {key:'1403/4/10',value:0},
                            {key:'1403/4/11',value:300},
                            {key:'1403/4/12',value:240},
                        ],
                    }
                ]}
                keyAxis={{
                    count:12,
                    size:48,
                    getLabel:(index)=>{
                        return ['1403/4/1','1403/4/2','1403/4/3','1403/4/4','1403/4/5','1403/4/6','1403/4/7','1403/4/8','1403/4/9','1403/4/10','1403/4/11','1403/4/12'][index]
                    },
                    zoom:true,
                    padding:[60,60]
                }}
                valueAxis={{
                    start:0,
                    end:400,
                    size:60,
                    getLabel:(value)=>{
                        return value.toString()
                    },
                    padding:[0,36]
                }}
                
            />
            <Chart
                dataOption={({dataIndex})=>{
                    const color = ['lightblue','rgb(47, 253, 157)','rgb(228, 107, 107)'][dataIndex]
                    return {style:{stroke:color,lineWidth:3},title:`data-${dataIndex + 1}`,color}
                }}
                pointOption={({dataIndex,pointIndex,point})=>{
                    const fill = ['lightblue','rgb(47, 253, 157)','rgb(228, 107, 107)'][dataIndex]
                    return {style:{fill:'#fff',stroke:fill,r:7,lineWidth:5,dash:[3,1]},value:point.value}
                }}
                datas={[
                    {
                        type:'line',
                        points:[
                            {key:'1403/4/1',value:0},
                            {key:'1403/4/2',value:10},
                            {key:'1403/4/3',value:30},
                            {key:'1403/4/4',value:60},
                            {key:'1403/4/5',value:90},
                            {key:'1403/4/6',value:100},
                            {key:'1403/4/7',value:100},
                            {key:'1403/4/8',value:100},
                            {key:'1403/4/9',value:100},
                            {key:'1403/4/10',value:100},
                            {key:'1403/4/11',value:100},
                            {key:'1403/4/12',value:100},
                        ],
                    },
                    {
                        type:'line',
                        points:[
                            {key:'1403/4/1',value:0},
                            {key:'1403/4/2',value:5},
                            {key:'1403/4/3',value:10},
                            {key:'1403/4/4',value:20},
                            {key:'1403/4/5',value:30},
                            {key:'1403/4/6',value:45},
                            {key:'1403/4/7',value:60},
                            {key:'1403/4/8',value:70},
                            {key:'1403/4/9',value:80},
                            {key:'1403/4/10',value:100},
                            {key:'1403/4/11',value:100},
                            {key:'1403/4/12',value:100},
                        ],
                    },
                    {
                        type:'line',
                        points:[
                            {key:'1403/4/1',value:0},
                            {key:'1403/4/2',value:30},
                            {key:'1403/4/3',value:40},
                            {key:'1403/4/4',value:50},
                            {key:'1403/4/5',value:50},
                            {key:'1403/4/6',value:50},
                            {key:'1403/4/7',value:60},
                            {key:'1403/4/8',value:65},
                            {key:'1403/4/9',value:70},
                            {key:'1403/4/10',value:70},
                            {key:'1403/4/11',value:90},
                            {key:'1403/4/12',value:100},
                        ],
                    }
                ]}
                keyAxis={{
                    count:12,
                    size:48,
                    getLabel:(index)=>{
                        return ['1403/4/1','1403/4/2','1403/4/3','1403/4/4','1403/4/5','1403/4/6','1403/4/7','1403/4/8','1403/4/9','1403/4/10','1403/4/11','1403/4/12'][index]
                    },
                    zoom:true,
                    padding:[60,60]
                }}
                valueAxis={{
                    start:0,
                    end:100,
                    size:60,
                    getLabel:(value)=>{
                        return value.toString()
                    },
                    padding:[0,36]
                }}
                
            />
        </div>
    )
}