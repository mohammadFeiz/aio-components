import { FC, useState } from "react"
import AIOInput from "../../npm/aio-input"
import Code from '../../npm/code/index';
import RVD from './../../npm/react-virtual-dom/index.tsx';
import {mdiAccount, mdiMinusThick, mdiPlusThick } from "@mdi/js"
import { Storage } from "../../npm/aio-utils/index.tsx";
import Icon from '@mdi/react';
const AcardionExamples:FC = ()=>{
    let [examples] = useState<any>([
        ['Basic',Basic],
        ['vertical',Vertical],
        ['multiple',Multiple]
    ])
    let [numbers] = useState<number[]>(new Array(examples.length).fill(0).map((o,i)=>i))
    let [setting,SetSetting] = useState<any>(new Storage(`treeexamplessetting`).load('setting',{
        show:0
    }))
    function setSetting(setting:any){
        new Storage('treeexamplessetting').save('setting',setting)
        SetSetting(setting)
    }
    function changeShow(dir: 1 | -1 ){
        let newShow:number = setting.show + dir;
        if(newShow < -1){newShow = examples.length - 1 }
        if(newShow > examples.length - 1){newShow = -1}
        setSetting({...setting,show:newShow})
    }
    function setting_node(){
        let btnstyle = {background:'none',border:'none'}
        return {
            className:'p-12',
            html:(
                <AIOInput
                    type='form'
                    value={{...setting}}
                    onChange={(newSetting)=>setSetting({...newSetting})}
                    node={{
                        dir:'h',
                        childs:[
                            {flex:1},
                            {
                                input:{
                                    type:'select',options:numbers,before:'Show:',
                                    option:{
                                        text:(option:any)=>option === -1?"all":examples[option][0],
                                        value:'option'
                                    },
                                    popover:{
                                        maxHeight:'100vh'
                                    }
                                },
                                field:'value.show'
                            },
                            {className:'align-vh',html:<button type='button' style={btnstyle} onClick={()=>changeShow(-1)}><Icon path={mdiMinusThick} size={1}/></button>},
                            {className:'align-vh',html:<button type='button' style={btnstyle} onClick={()=>changeShow(1)}><Icon path={mdiPlusThick} size={1}/></button>}
                        ]
                    }}
                />
            )
        }
    }
    function render_node(){
        let rows = [
            {name:'mohammad',family:'feiz',age:38,id:0},
            {name:'john',family:'doe',age:30,id:1},
        ]
        let rowsCode = `
let [rows,setRows] = useState([
    {name:'mohammad',family:'feiz',age:38,id:0},
    {name:'john',family:'doe',age:30,id:1},
])
        `
        return {
            key:JSON.stringify(setting),
            className:'ofy-auto flex-1 p-12',
            column:examples.map((o:any,i:number)=>{
                let [title,COMP,cond] = o;
                if(cond === false){return {}}
                if(setting.show !== -1 && setting.show !== i){return {}}
                return {
                    html:(
                        <div className='w-100'>
                            <h3>{`${i} - ${title}`}</h3>
                            <COMP rows={rows} rowsCode={rowsCode}/>
                        </div>
                    )
                }
            })
        }
    }
    return (<RVD rootNode={{className:'h-100',column:[setting_node(),render_node()]}}/>)   
}
export default AcardionExamples

function Basic(){
    const [value,setValue] = useState<string>()
    return (
        <div className='example'>
            <AIOInput 
                type='acardion'
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                body={(value:string)=>{
                    if(value === '0'){
                        return {
                            html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia rem expedita aut, nam provident facere illo voluptatum iusto quibusdam quas obcaecati neque necessitatibus veniam, aperiam tempora nesciunt. Hic, temporibus assumenda!'
                        }
                    }
                    if(value === '1'){
                        return {
                            html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum excepturi ea sunt, officiis fugiat ut qui quis quisquam! Molestias, laborum deserunt aliquam nemo recusandae laboriosam. Magnam unde officia neque magni animi quaerat pariatur accusamus sed laborum vero error, nemo molestiae.'
                        }
                    }
                    if(value === '2'){
                        return {
                            html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt unde, molestiae magnam, eaque ducimus vitae quidem accusamus veritatis adipisci est laborum corrupti cumque ab explicabo, maxime odit atque blanditiis modi mollitia! Deserunt laudantium quo minima dolores sequi magni neque nostrum dolore asperiores qui assumenda fugiat labore, quae natus voluptatem facere.'
                        }
                    }
                    if(value === '3'){
                        return {
                            html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, praesentium. Est architecto magni minima impedit cum odit in expedita molestias rerum! Consectetur aliquam enim placeat iste fuga nisi aliquid nobis obcaecati dolorem, culpa non quo vel harum ducimus corporis aut rem iusto? Corporis, delectus? Minima, repellendus ut. Quis ullam aliquid temporibus rerum voluptatum, officia, perspiciatis quos iure voluptate, dolorum velit.'
                        }
                    }
                    return {html:''}
                }}
                options={[
                    {text:'acardion1',value:'0'},
                    {text:'acardion2',value:'1'},
                    {text:'acardion3',value:'2'},
                    {text:'acardion4',value:'3'}
                ]}
                option={{
                    after:()=><Icon path={mdiAccount} size={0.7}/>,
                    before:(option,details)=><div className='align-vh fs-16 bold w-30 h-30 bg-32 br-6' style={{color:'dodgerblue'}}>{details.index + 1}</div>,
                    subtext:()=>'this is my subtext'
                }}
            />
            {
                Code(
`const [value,setValue] = useState<string>()
<AIOInput 
    type='acardion'
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    body={(value)=>{
        if(value === '0'){
            return {
                html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia rem expedita aut, nam provident facere illo voluptatum iusto quibusdam quas obcaecati neque necessitatibus veniam, aperiam tempora nesciunt. Hic, temporibus assumenda!'
            }
        }
        if(value === '1'){
            return {
                html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum excepturi ea sunt, officiis fugiat ut qui quis quisquam! Molestias, laborum deserunt aliquam nemo recusandae laboriosam. Magnam unde officia neque magni animi quaerat pariatur accusamus sed laborum vero error, nemo molestiae.'
            }
        }
        if(value === '2'){
            return {
                html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt unde, molestiae magnam, eaque ducimus vitae quidem accusamus veritatis adipisci est laborum corrupti cumque ab explicabo, maxime odit atque blanditiis modi mollitia! Deserunt laudantium quo minima dolores sequi magni neque nostrum dolore asperiores qui assumenda fugiat labore, quae natus voluptatem facere.'
            }
        }
        if(value === '3'){
            return {
                html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, praesentium. Est architecto magni minima impedit cum odit in expedita molestias rerum! Consectetur aliquam enim placeat iste fuga nisi aliquid nobis obcaecati dolorem, culpa non quo vel harum ducimus corporis aut rem iusto? Corporis, delectus? Minima, repellendus ut. Quis ullam aliquid temporibus rerum voluptatum, officia, perspiciatis quos iure voluptate, dolorum velit.'
            }
        }
        return {html:''}
    }}
    options={[
        {text:'acardion1',value:'0'},
        {text:'acardion2',value:'1'},
        {text:'acardion3',value:'2'},
        {text:'acardion4',value:'3'}
    ]}
    option={{
        after:()=><Icon path={mdiAccount} size={0.7}/>,
        before:(option,details)=><div className='align-vh fs-16 bold w-30 h-30 bg-32 br-6' style={{color:'dodgerblue'}}>{details.index + 1}</div>,
        subtext:()=>'this is my subtext'
    }}
/>`
                )
            }
            {
                Code(
`.badge{
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:16px;
    font-weight:bold;
    width:30px;
    height:30px;
    background-color:#fff;
    border-radius:6px;
}`
                )
            }
        </div>
    )
}
function Vertical(){
    const [value,setValue] = useState<string>()
    return (
        <div className='example'>
            <AIOInput 
                type='acardion'
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                vertical={false}
                body={(value:string)=>{
                    let attrs = {style:{width:200}}
                    if(value === '0'){
                        return {
                            attrs,
                            html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia rem expedita aut, nam provident facere illo voluptatum iusto quibusdam quas obcaecati neque necessitatibus veniam, aperiam tempora nesciunt. Hic, temporibus assumenda!'
                        }
                    }
                    if(value === '1'){
                        return {
                            attrs,
                            html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum excepturi ea sunt, officiis fugiat ut qui quis quisquam! Molestias, laborum deserunt aliquam nemo recusandae laboriosam. Magnam unde officia neque magni animi quaerat pariatur accusamus sed laborum vero error, nemo molestiae.'
                        }
                    }
                    if(value === '2'){
                        return {
                            attrs,
                            html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt unde, molestiae magnam, eaque ducimus vitae quidem accusamus veritatis adipisci est laborum corrupti cumque ab explicabo, maxime odit atque blanditiis modi mollitia! Deserunt laudantium quo minima dolores sequi magni neque nostrum dolore asperiores qui assumenda fugiat labore, quae natus voluptatem facere.'
                        }
                    }
                    if(value === '3'){
                        return {
                            attrs,
                            html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, praesentium. Est architecto magni minima impedit cum odit in expedita molestias rerum! Consectetur aliquam enim placeat iste fuga nisi aliquid nobis obcaecati dolorem, culpa non quo vel harum ducimus corporis aut rem iusto? Corporis, delectus? Minima, repellendus ut. Quis ullam aliquid temporibus rerum voluptatum, officia, perspiciatis quos iure voluptate, dolorum velit.'
                        }
                    }
                    return {html:''}
                }}
                options={[
                    {text:'acardion1',value:'0'},
                    {text:'acardion2',value:'1'},
                    {text:'acardion3',value:'2'},
                    {text:'acardion4',value:'3'}
                ]}
                option={{
                    after:()=><Icon path={mdiAccount} size={0.7}/>,
                    before:(option:any,details:any)=><div className='align-vh fs-16 bold w-30 h-30 bg-32 br-6' style={{color:'dodgerblue'}}>{details.index + 1}</div>,
                    style:()=>({width:200}),
                    subtext:()=>'this is my subtext',
                }}
            />
            {
                Code(
`const [value,setValue] = useState()
<AIOInput 
    type='acardion'
    value={value}
    onChange={(newValue)=>setValue(newValue)}
    vertical={false}
    body={(value:string)=>{
        let attrs = {style:{width:200}}
        if(value === '0'){
            return {
                attrs,
                html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia rem expedita aut, nam provident facere illo voluptatum iusto quibusdam quas obcaecati neque necessitatibus veniam, aperiam tempora nesciunt. Hic, temporibus assumenda!'
            }
        }
        if(value === '1'){
            return {
                attrs,
                html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum excepturi ea sunt, officiis fugiat ut qui quis quisquam! Molestias, laborum deserunt aliquam nemo recusandae laboriosam. Magnam unde officia neque magni animi quaerat pariatur accusamus sed laborum vero error, nemo molestiae.'
            }
        }
        if(value === '2'){
            return {
                attrs,
                html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt unde, molestiae magnam, eaque ducimus vitae quidem accusamus veritatis adipisci est laborum corrupti cumque ab explicabo, maxime odit atque blanditiis modi mollitia! Deserunt laudantium quo minima dolores sequi magni neque nostrum dolore asperiores qui assumenda fugiat labore, quae natus voluptatem facere.'
            }
        }
        if(value === '3'){
            return {
                attrs,
                html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, praesentium. Est architecto magni minima impedit cum odit in expedita molestias rerum! Consectetur aliquam enim placeat iste fuga nisi aliquid nobis obcaecati dolorem, culpa non quo vel harum ducimus corporis aut rem iusto? Corporis, delectus? Minima, repellendus ut. Quis ullam aliquid temporibus rerum voluptatum, officia, perspiciatis quos iure voluptate, dolorum velit.'
            }
        }
        return {html:''}
    }}
    options={[
        {text:'acardion1',value:'0'},
        {text:'acardion2',value:'1'},
        {text:'acardion3',value:'2'},
        {text:'acardion4',value:'3'}
    ]}
    option={{
        after:()=><Icon path={mdiAccount} size={0.7}/>,
        before:(option:any,details:any)=><div className='align-vh fs-16 bold w-30 h-30 bg-32 br-6' style={{color:'dodgerblue'}}>{details.index + 1}</div>,
        subtext:()=>'this is my subtext',
    }}
/>`
                )
            }
        </div>
    )
}
function Multiple(){
    const [value,setValue] = useState<string[]>([])
    return (
        <div className='example'>
            <AIOInput
                type={'acardion'}
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                multiple={true}
                body={(value:string)=>{
                    if(value === '0'){
                        return {
                            html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia rem expedita aut, nam provident facere illo voluptatum iusto quibusdam quas obcaecati neque necessitatibus veniam, aperiam tempora nesciunt. Hic, temporibus assumenda!'
                        }
                    }
                    if(value === '1'){
                        return {
                            html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum excepturi ea sunt, officiis fugiat ut qui quis quisquam! Molestias, laborum deserunt aliquam nemo recusandae laboriosam. Magnam unde officia neque magni animi quaerat pariatur accusamus sed laborum vero error, nemo molestiae.'
                        }
                    }
                    if(value === '2'){
                        return {
                            html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt unde, molestiae magnam, eaque ducimus vitae quidem accusamus veritatis adipisci est laborum corrupti cumque ab explicabo, maxime odit atque blanditiis modi mollitia! Deserunt laudantium quo minima dolores sequi magni neque nostrum dolore asperiores qui assumenda fugiat labore, quae natus voluptatem facere.'
                        }
                    }
                    if(value === '3'){
                        return {
                            html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, praesentium. Est architecto magni minima impedit cum odit in expedita molestias rerum! Consectetur aliquam enim placeat iste fuga nisi aliquid nobis obcaecati dolorem, culpa non quo vel harum ducimus corporis aut rem iusto? Corporis, delectus? Minima, repellendus ut. Quis ullam aliquid temporibus rerum voluptatum, officia, perspiciatis quos iure voluptate, dolorum velit.'
                        }
                    }
                    return {html:''}
                }}
                options={[
                    {text:'acardion1',value:'0'},
                    {text:'acardion2',value:'1'},
                    {text:'acardion3',value:'2'},
                    {text:'acardion4',value:'3'}
                ]}
                option={{
                    after:()=><Icon path={mdiAccount} size={0.7}/>,
                    before:(option:any,details:any)=><div className='align-vh fs-16 bold w-30 h-30 bg-32 br-6' style={{color:'dodgerblue'}}>{details.index + 1}</div>,
                    subtext:()=>'this is my subtext',
                }}
            />
            {
                Code(
`<AIOInput
    type={'acardion'}
    multiple={true}
    body={(value)=>{
        if(value === '0'){
            return {
                html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia rem expedita aut, nam provident facere illo voluptatum iusto quibusdam quas obcaecati neque necessitatibus veniam, aperiam tempora nesciunt. Hic, temporibus assumenda!'
            }
        }
        if(value === '1'){
            return {
                html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum excepturi ea sunt, officiis fugiat ut qui quis quisquam! Molestias, laborum deserunt aliquam nemo recusandae laboriosam. Magnam unde officia neque magni animi quaerat pariatur accusamus sed laborum vero error, nemo molestiae.'
            }
        }
        if(value === '2'){
            return {
                html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt unde, molestiae magnam, eaque ducimus vitae quidem accusamus veritatis adipisci est laborum corrupti cumque ab explicabo, maxime odit atque blanditiis modi mollitia! Deserunt laudantium quo minima dolores sequi magni neque nostrum dolore asperiores qui assumenda fugiat labore, quae natus voluptatem facere.'
            }
        }
        if(value === '3'){
            return {
                html:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, praesentium. Est architecto magni minima impedit cum odit in expedita molestias rerum! Consectetur aliquam enim placeat iste fuga nisi aliquid nobis obcaecati dolorem, culpa non quo vel harum ducimus corporis aut rem iusto? Corporis, delectus? Minima, repellendus ut. Quis ullam aliquid temporibus rerum voluptatum, officia, perspiciatis quos iure voluptate, dolorum velit.'
            }
        }
        return {html:''}
    }}
    options={[
        {text:'acardion1',value:'0'},
        {text:'acardion2',value:'1'},
        {text:'acardion3',value:'2'},
        {text:'acardion4',value:'3'}
    ]}
    option={{
        after:()=><Icon path={mdiAccount} size={0.7}/>,
        before:(option)=><div className='align-vh fs-16 bold w-30 h-30 bg-32 br-6' style={{color:'dodgerblue'}}>{option.renderIndex + 1}</div>,
        subtext:()=>'this is my subtext',
    }}
/>`
                )
            }
        </div>
    )
}