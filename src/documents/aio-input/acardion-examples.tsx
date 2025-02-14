import { FC, useState } from "react"
import AIOInput, { AIAcardion } from "../../npm/aio-input"
import {Code} from './../../npm/aio-component-utils';
import {mdiAccount } from "@mdi/js"
import Icon from '@mdi/react';
import Example from "./example.tsx";
const AcardionExamples:FC = ()=>{
    let [examples] = useState<any>([
        ['Basic',()=><Basic/>],
        ['vertical',()=><Vertical/>],
        ['multiple',()=><Multiple/>]
    ])
    return (<Example type='acardion' examples={examples}/>)
}
export default AcardionExamples

function Basic(){
    const [value,setValue] = useState<string>()
    return (
        <div className='example'>
            <AIAcardion 
                value={value}
                onChange={(newValue)=>setValue(newValue)}
                body={(option)=>{
                    const {value} = option
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
                    before:(option,details)=><div className='align-vh- fs-16- bold- w-30- h-30- bg-32- br-6-' style={{color:'dodgerblue'}}>{details.index + 1}</div>,
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
    body={(option)=>{
        const {value} = option
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
        before:(option,details)=><div className='align-vh- fs-16- bold- w-30- h-30- bg-32- br-6-' style={{color:'dodgerblue'}}>{details.index + 1}</div>,
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
                body={(option)=>{
                    const {value} = option
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
                    before:(option,details)=><div className='align-vh- fs-16- bold- w-30- h-30- bg-32- br-6-' style={{color:'dodgerblue'}}>{details.index + 1}</div>,
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
    body={(option)=>{
        const {value} = option
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
        before:(option,details)=><div className='align-vh- fs-16- bold- w-30- h-30- bg-32- br-6-' style={{color:'dodgerblue'}}>{details.index + 1}</div>,
        style:()=>({width:200}),
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
                body={(option)=>{
                    const {value} = option
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
                    before:(option,details)=><div className='align-vh- fs-16- bold- w-30- h-30- bg-32- br-6-' style={{color:'dodgerblue'}}>{details.index + 1}</div>,
                    subtext:()=>'this is my subtext',
                }}
            />
            {
                Code(
`<AIOInput
    type={'acardion'}
    multiple={true}
    body={(option)=>{
        const {value} = option
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
        before:(option,details)=><div className='align-vh- fs-16- bold- w-30- h-30- bg-32- br-6-' style={{color:'dodgerblue'}}>{details.index + 1}</div>,
        subtext:()=>'this is my subtext',
    }}
/>`
                )
            }
        </div>
    )
}