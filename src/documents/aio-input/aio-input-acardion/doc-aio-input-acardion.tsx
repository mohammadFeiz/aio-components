import React from "react"
import DOC from "../../../resuse-components/doc"
import AIOInput from "../../../npm/aio-input"
import { AI } from "../../../npm/aio-input/types"
import { mdiAccount } from "@mdi/js"
import AIODoc from './../../../npm/aio-documentation/aio-documentation.js';
import Icon from '@mdi/react';
export default function DOC_Acardion(props) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items:()=>[
                    { text: 'Basic', id: 'basic', render: () => <Basic /> },
                    { text: 'vertical', id: 'vertical', render: () => <Vertical /> },
                    { text: 'multiple', id: 'multiple', render: () => <Multiple /> },
                ]
            }}
        />
    )
}

function Basic(){
    return (
        <div className='example'>
            <AIOInput 
                type='acardion'
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
                    subtext:()=>'this is my subtext'
                }}
            />
            {
                AIODoc().Code(
`<AIOInput 
    type='acardion'
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
    }}
    options={[
        {text:'acardion1',value:'0'},
        {text:'acardion2',value:'1'},
        {text:'acardion3',value:'2'},
        {text:'acardion4',value:'3'}
    ]}
    option={{
        after:()=><Icon path={mdiAccount} size={0.7}/>,
        before:(option)=><div className='badge' style={{color:'dodgerblue'}}>{option.renderIndex + 1}</div>,
        subtext:()=>'this is my subtext'
    }}
/>`
                )
            }
            {
                AIODoc().Code(
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
    return (
        <div className='example'>
            <AIOInput 
                type='acardion'
                vertical={false}
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
            />
            {
                AIODoc().Code(
`<AIOInput 
    type='acardion'
    vertical={false}
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
function Multiple(){
    return (
        <div className='example'>
            <AIOInput
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
            />
            {
                AIODoc().Code(
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