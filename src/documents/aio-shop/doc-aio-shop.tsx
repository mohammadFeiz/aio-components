import React, { Component,Fragment,useState } from 'react';
import DOC from '../../resuse-components/doc.js';
import AIODoc from '../../npm/aio-documentation/aio-documentation.js';
import RVD from '../../npm/react-virtual-dom/react-virtual-dom.js';
import products from './products.tsx';
import AIOShop from '../../npm/aio-shop/aio-shop.js';
import './index.css';
import { I_AIOShop, I_AIOShop_props } from '../../npm/aio-shop/types.js';
export default function DOC_AIOShop(props){
    return (
        <DOC
            {...props}
            nav={{
                items:[
                    { text: 'renderProductCard', id: 'renderProductCard', render: () => <RenderProductCard /> },
                    { text: 'productCardContent', id: 'productCardContent', render: () => <ProductCardContent /> },
                    { text: 'productCardImageContent', id: 'productCardImageContent', render: () => <ProductCardImageContent /> },
                    { text: 'renderProductPage', id: 'renderProductPage', render: () => <RenderProductPage /> },
                    { text: 'productPageContent', id: 'productPageContent', render: () => <ProductPageContent /> },
                    { text: 'discountPercent', id: 'discountPercent', render: () => <DiscountPercent /> },
                    { text: 'cartInfo', id: 'cartinfo', render: () => <CartInfo /> },
                ]
            }}
        />
    )
}
function RenderProductCard(){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = {
        id:'123432',rate:3.6,name:'تیشرت مردانه پوما',
        rates:[['قیمت',4],['دوام',3],['زیبایی',4],['دوخت',2]],
        images:[
            'https://dkstatics-public.digikala.com/digikala-products/117515968.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiHYrCjdeeYgHM1wi7zosta473Ilv3d63FYmNhB6nRDA&s'
        ],
        description:'تیشرت مردانه پوما تهیه شده از بهتری نوع نخ یکی از محصولات جدید شرکت میباشد که سالها به عنوان یکی از محصولات پر فروش در دسته پوشاک آقایان قرار دارد. خاصیت حفظ رنگ و عدم پرز دهی از ویژگی های منحصر به فرد این محصول می باشد.',
        details:[['جنس','نخی'],['یقه','گرد'],['آستین','کوتاه']],
        defaultVariantId: '165',
        variants: [
            {
                id: '165',price:280000,
                cartInfo:{inStock: 25, max: 10, min: 5, step: 5},
                discountPercent: [{text:'تخفیف شب یلدا',value:12}], 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'سفید',id:'white'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'S',id:'s'}}
                ]
            },
            {
                id: '166',price:295000, 
                cartInfo:{inStock: 12}, 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'سفید',id:'white'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'M',id:'m'}}
                ]
            },
            { 
                id: '167',price:280000, 
                cartInfo:{inStock: 1,max:2},
                discountPercent: [{text:'تخفیف شب یلدا',value:15}], 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'خاکستری',id:'grey'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'L',id:'l'}}
                ]
            }
        ]
    }
    function part(content?:React.ReactNode,code?:string){
        if(!content){return null}
        return (
            <>
                <div style={{maxWidth:400}}>{content}</div>
                {AIODoc().Code(code)}
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </>
        )
    }
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            {
                part(Shop.renderProductCard({product,type:'h',cartButton:false}),
`Shop.renderProductCard({product,type:'h',cartButton:false})`
                )
            }
            {
                part(Shop.renderProductCard({product,type:'h',cartButton:false,title:'فروش ویژه'}),
`Shop.renderProductCard({product,type:'h',cartButton:false,title:'فروش ویژه'})`
                )
            }
            {
                part(Shop.renderProductCard({product,type:'h',cartButton:false,variantId:'167'}),
`Shop.renderProductCard({product,type:'h',cartButton:true,variantId:'167'})`
                )
            }
            {
                part(
                    Shop.renderProductCard({product,type:'hs',cartButton:false}),
`Shop.renderProductCard({product,type:'hs',cartButton:false})`
                )
            }
            {
                part(
                    Shop.renderProductCard({product,type:'hs',cartButton:false,title:'فروش ویژه'}),
`Shop.renderProductCard({product,type:'hs',cartButton:false,title:'فروش ویژه'})`
                )
            }
            {
                part(
                    Shop.renderProductCard({product,type:'hs',cartButton:false,variantId:'167'}),
`Shop.renderProductCard({product,type:'hs',cartButton:false,variantId:'167'})`
                )
            }
            {
                part(
                    Shop.renderProductCard({product,type:'v',cartButton:false}),
`Shop.renderProductCard({product,type:'v',cartButton:false})`
                )
            }
            {
                part(
                    Shop.renderProductCard({product,type:'v',cartButton:false,title:'فروش ویژه'}),
`Shop.renderProductCard({product,type:'v',cartButton:false,title:'فروش ویژه'})`
                )
            }
            {
                part(
                    Shop.renderProductCard({product,type:'v',cartButton:false,variantId:'167'}),
`Shop.renderProductCard({product,type:'v',cartButton:false,variantId:'167'})`
                )
            }
            {Shop.renderPopup()}
        </div>
    )
}
function RenderProductPage(){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = {
        id:'123432',rate:3.6,name:'تیشرت مردانه پوما',
        rates:[['قیمت',4],['دوام',3],['زیبایی',4],['دوخت',2]],
        images:['https://dkstatics-public.digikala.com/digikala-products/117515968.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80'],
        description:'تیشرت مردانه پوما تهیه شده از بهتری نوع نخ یکی از محصولات جدید شرکت میباشد که سالها به عنوان یکی از محصولات پر فروش در دسته پوشاک آقایان قرار دارد. خاصیت حفظ رنگ و عدم پرز دهی از ویژگی های منحصر به فرد این محصول می باشد.',
        details:[['جنس','نخی'],['یقه','گرد'],['آستین','کوتاه']],
        defaultVariantId: '165',
        variants: [
            {
                id: '165',price:280000,
                cartInfo:{inStock: 25, max: 10, min: 5, step: 5},
                discountPercent: [{text:'تخفیف شب یلدا',value:12,attrs:{style:{background:'green'}}}], 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'سفید',id:'white'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'S',id:'s'}}
                ]
            },
            {
                id: '166',price:295000, 
                cartInfo:{inStock: 12}, 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'سفید',id:'white'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'M',id:'m'}}
                ]
            },
            { 
                id: '167',price:280000, 
                cartInfo:{inStock: 1,max:2},
                discountPercent: [{text:'تخفیف شب یلدا',value:15,attrs:{style:{background:'green'}}}], 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'خاکستری',id:'grey'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'L',id:'l'}}
                ]
            }
        ]
    }
    function part(content?:React.ReactNode,code?:string){
        if(!content){return null}
        return (
            <>
                <div style={{width:400}}>{content}</div>
                {AIODoc().Code(code)}
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </>
        )
    }
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            {
                part(Shop.renderProductPage({product}),
`
...
Shop.renderProductPage({product})
...
`
                )
            }
            
            
            {Shop.renderPopup()}
        </div>
    )
}
function ProductPageContent(){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        productPageContent:async (product,variantId)=>{
            return (
                <div style={{color:'orange'}} className='align-vh p-24 w-100'>با خرید این محصول 100 امتیاز دریافت کنید</div>
            )
        }
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = {
        id:'123432',rate:3.6,name:'تیشرت مردانه پوما',
        rates:[['قیمت',4],['دوام',3],['زیبایی',4],['دوخت',2]],
        images:['https://dkstatics-public.digikala.com/digikala-products/117515968.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80'],
        description:'تیشرت مردانه پوما تهیه شده از بهتری نوع نخ یکی از محصولات جدید شرکت میباشد که سالها به عنوان یکی از محصولات پر فروش در دسته پوشاک آقایان قرار دارد. خاصیت حفظ رنگ و عدم پرز دهی از ویژگی های منحصر به فرد این محصول می باشد.',
        details:[['جنس','نخی'],['یقه','گرد'],['آستین','کوتاه']],
        defaultVariantId: '165',
        variants: [
            {
                id: '165',price:280000,
                cartInfo:{inStock: 25, max: 10, min: 5, step: 5},
                discountPercent: [{text:'تخفیف شب یلدا',value:12,attrs:{style:{background:'green'}}}], 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'سفید',id:'white'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'S',id:'s'}}
                ]
            },
            {
                id: '166',price:295000, 
                cartInfo:{inStock: 12}, 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'سفید',id:'white'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'M',id:'m'}}
                ]
            },
            { 
                id: '167',price:280000, 
                cartInfo:{inStock: 1,max:2},
                discountPercent: [{text:'تخفیف شب یلدا',value:15,attrs:{style:{background:'green'}}}], 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'خاکستری',id:'grey'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'L',id:'l'}}
                ]
            }
        ]
    }
    function part(content?:React.ReactNode,code?:string){
        if(!content){return null}
        return (
            <>
                <div style={{width:400}}>{content}</div>
                {AIODoc().Code(code)}
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </>
        )
    }
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            {
                part(Shop.renderProductPage({product}),
`
...
let Shop = new AIOShop({
    ...
    productPageContent:async (product)=>{
        return (
            <div 
                style={{color:'orange'}} 
                className='align-vh p-24 w-100'
            >با خرید این محصول 100 امتیاز دریافت کنید</div>
        )
    }
    ...
})
...
`
                )
            }
            
            
            {Shop.renderPopup()}
        </div>
    )
}
function ProductCardContent(){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        productCardContent:async (product,variantId)=>{
            return (
                <div style={{color:'red'}} className='w-100 fs-10'>با خرید این محصول 100 امتیاز دریافت کنید</div>
            )
        }
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = {
        id:'123432',rate:3.6,name:'تیشرت مردانه پوما',
        rates:[['قیمت',4],['دوام',3],['زیبایی',4],['دوخت',2]],
        images:['https://dkstatics-public.digikala.com/digikala-products/117515968.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80'],
        description:'تیشرت مردانه پوما تهیه شده از بهتری نوع نخ یکی از محصولات جدید شرکت میباشد که سالها به عنوان یکی از محصولات پر فروش در دسته پوشاک آقایان قرار دارد. خاصیت حفظ رنگ و عدم پرز دهی از ویژگی های منحصر به فرد این محصول می باشد.',
        details:[['جنس','نخی'],['یقه','گرد'],['آستین','کوتاه']],
        defaultVariantId: '165',
        variants: [
            {
                id: '165',price:280000,
                cartInfo:{inStock: 25, max: 10, min: 5, step: 5},
                discountPercent: [{text:'تخفیف شب یلدا',value:12}], 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'سفید',id:'white'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'S',id:'s'}}
                ]
            },
            {
                id: '166',price:295000, 
                cartInfo:{inStock: 12}, 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'سفید',id:'white'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'M',id:'m'}}
                ]
            },
            { 
                id: '167',price:280000, 
                cartInfo:{inStock: 1,max:2},
                discountPercent: [{text:'تخفیف شب یلدا',value:15}], 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'خاکستری',id:'grey'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'L',id:'l'}}
                ]
            }
        ]
    }
    function part(content?:React.ReactNode,code?:string){
        if(!content){return null}
        return (
            <>
                <div style={{width:400}}>{content}</div>
                {AIODoc().Code(code)}
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </>
        )
    }
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            {
                part(Shop.renderProductCard({product,type:'h',cartButton:false}),
`
...
let Shop = new AIOShop({
    ...
    productCardContent:async (product,variantId)=>{
        return (
            <div 
                style={{color:'red'}} 
                className='w-100 fs-10'
            >با خرید این محصول 100 امتیاز دریافت کنید</div>
        )
    }
    ...
})
...
`
                )
            }
            
            
            {Shop.renderPopup()}
        </div>
    )
}
function ProductCardImageContent(){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        productCardImageContent:async (product,variantId)=>{
            return (
                <div className='p-6 absolute r-0 t-0'>
                    <div 
                        style={{background:'orange',color:'#fff'}} 
                        className='br-4 p-h-3'
                    >{product.variants[0].discountPercent[0].value + '%'}</div>
                </div>
            )
        }
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = {
        id:'123432',rate:3.6,name:'تیشرت مردانه پوما',
        rates:[['قیمت',4],['دوام',3],['زیبایی',4],['دوخت',2]],
        images:['https://dkstatics-public.digikala.com/digikala-products/117515968.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80'],
        description:'تیشرت مردانه پوما تهیه شده از بهتری نوع نخ یکی از محصولات جدید شرکت میباشد که سالها به عنوان یکی از محصولات پر فروش در دسته پوشاک آقایان قرار دارد. خاصیت حفظ رنگ و عدم پرز دهی از ویژگی های منحصر به فرد این محصول می باشد.',
        details:[['جنس','نخی'],['یقه','گرد'],['آستین','کوتاه']],
        defaultVariantId: '165',
        variants: [
            {
                id: '165',price:280000,
                cartInfo:{inStock: 25, max: 10, min: 5, step: 5},
                discountPercent: [{text:'تخفیف شب یلدا',value:12}], 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'سفید',id:'white'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'S',id:'s'}}
                ]
            },
            {
                id: '166',price:295000, 
                cartInfo:{inStock: 12}, 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'سفید',id:'white'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'M',id:'m'}}
                ]
            },
            { 
                id: '167',price:280000, 
                cartInfo:{inStock: 1,max:2},
                discountPercent: [{text:'تخفیف شب یلدا',value:15}], 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'خاکستری',id:'grey'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'L',id:'l'}}
                ]
            }
        ]
    }
    function part(content?:React.ReactNode,code?:string){
        if(!content){return null}
        return (
            <>
                <div style={{width:400}}>{content}</div>
                {AIODoc().Code(code)}
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </>
        )
    }
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            {
                part(Shop.renderProductCard({product,type:'h',cartButton:false}),
`
...
let Shop = new AIOShop({
    ...
    productCardImageContent:async (product,variantId)=>{
        let dsc = product.variants[0].discountPercent[0].value;
        return (
            <div className='p-6 absolute r-0 t-0'>
                <div 
                    style={{background:'orange',color:'#fff'}} 
                    className='br-4 p-h-3'
                >{dsc + '%'}</div>
            </div>
        )
    }
    ...
})
...
`
                )
            }
            
            
            {Shop.renderPopup()}
        </div>
    )
}
function DiscountPercent(){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product1 = {
        id:'123432',rate:3.6,name:'تیشرت مردانه پوما',
        rates:[['قیمت',4],['دوام',3],['زیبایی',4],['دوخت',2]],
        images:['https://dkstatics-public.digikala.com/digikala-products/117515968.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80'],
        description:'تیشرت مردانه پوما تهیه شده از بهتری نوع نخ یکی از محصولات جدید شرکت میباشد که سالها به عنوان یکی از محصولات پر فروش در دسته پوشاک آقایان قرار دارد. خاصیت حفظ رنگ و عدم پرز دهی از ویژگی های منحصر به فرد این محصول می باشد.',
        details:[['جنس','نخی'],['یقه','گرد'],['آستین','کوتاه']],
        defaultVariantId: '165',
        variants: [
            {
                id: '165',price:280000,
                cartInfo:{inStock: 25, max: 10, min: 5, step: 5},
                discountPercent: [{text:'تخفیف شب یلدا',value:12}], 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'سفید',id:'white'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'S',id:'s'}}
                ]
            }
        ]
    }
    let product2 = {
        ...product1,
        variants:[{
            ...product1.variants[0],
            discountPercent: [{text:'تخفیف شب یلدا',value:12,attrs:{style:{background:'green'}}}], 
        }]
    }
    let product3 = {
        ...product1,
        variants:[{
            ...product1.variants[0],
            discountPercent: [
                {text:'تخفیف شب یلدا',value:12,attrs:{style:{background:'green'}}},
                {text:'تخفیف مشتری خوش حساب',value:10,attrs:{style:{background:'orange'}}}
            ], 
        }]
    }
    function part(content?:React.ReactNode,code?:string){
        if(!content){return null}
        return (
            <>
                <div style={{width:400}}>{content}</div>
                {AIODoc().Code(code)}
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </>
        )
    }
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            {
                part(Shop.renderProductCard({product:product1,type:'h',cartButton:false}),
`
let product = {
    ...
    defaultVariantId:'165',
    variants: [
        ...
        {
            ...
            id:'165',
            discountPercent: [
                {
                    text:'تخفیف شب یلدا',
                    value:12
                }
            ], 
            ...
        }
        ...
    ]
    ...
}
Shop.renderProductCard({product,type:'h',cartButton:false})

`
                )
            }
            {
                part(Shop.renderProductCard({product:product2,type:'h',cartButton:false}),
`
let product = {
    ...
    defaultVariantId:'165',
    variants: [
        ...
        {
            ...
            id:'165',
            discountPercent: [
                {
                    text:'تخفیف شب یلدا',
                    value:12,
                    attrs:{style:{background:'green'}}
                }
            ], 
            ...
        }
        ...
    ]
    ...
}
Shop.renderProductCard({product,type:'h',cartButton:false})

`
                )
            }
            {
                part(Shop.renderProductCard({product:product3,type:'h',cartButton:false}),
`
let product = {
    ...
    defaultVariantId:'165',
    variants: [
        ...
        {
            ...
            id:'165',
            discountPercent: [
                {
                    text:'تخفیف شب یلدا',
                    value:12,
                    attrs:{style:{background:'green'}}
                },
                {
                    text:'تخفیف مشتری خوش حساب',
                    value:10,
                    attrs:{style:{background:'orange'}}
                }
            ], 
            ...
        }
        ...
    ]
    ...
}
Shop.renderProductCard({product,type:'h',cartButton:false})

`
                )
            }
            
            {Shop.renderPopup()}
        </div>
    )
}

function CartInfo(){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = {
        id:'123432',rate:3.6,name:'تیشرت مردانه پوما',
        rates:[['قیمت',4],['دوام',3],['زیبایی',4],['دوخت',2]],
        images:['https://dkstatics-public.digikala.com/digikala-products/117515968.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80'],
        description:'تیشرت مردانه پوما تهیه شده از بهتری نوع نخ یکی از محصولات جدید شرکت میباشد که سالها به عنوان یکی از محصولات پر فروش در دسته پوشاک آقایان قرار دارد. خاصیت حفظ رنگ و عدم پرز دهی از ویژگی های منحصر به فرد این محصول می باشد.',
        details:[['جنس','نخی'],['یقه','گرد'],['آستین','کوتاه']],
        defaultVariantId: '165',
        variants: [
            {
                id: '165',price:280000,
                cartInfo:{inStock: 25},
                discountPercent: [{text:'تخفیف شب یلدا',value:12}], 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'سفید',id:'white'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'S',id:'s'}}
                ]
            }
        ]
    }
    let product1 = {
        ...product,
        variants:[
            {...product.variants[0],cartInfo:{inStock: 25, max: 10, min: 5, step: 5}}
        ]
    }
    function part(content?:React.ReactNode,code?:string){
        if(!content){return null}
        return (
            <>
                <div style={{width:400}}>{content}</div>
                {AIODoc().Code(code)}
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </>
        )
    }
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            {
                part(Shop.renderProductPage({product}),
`
...
cartInfo:{inStock: 25},
...
`
                )
            }
            {
                part(Shop.renderProductPage({product:product1}),
`
...
cartInfo:{inStock: 25, max: 10, min: 5, step: 5},
...
`
                )
            }
            
            {Shop.renderPopup()}
        </div>
    )
}

function Ex(){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = {
        id:'123432',rate:3.6,name:'تیشرت مردانه پوما',
        rates:[['قیمت',4],['دوام',3],['زیبایی',4],['دوخت',2]],
        images:['https://dkstatics-public.digikala.com/digikala-products/117515968.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80'],
        description:'تیشرت مردانه پوما تهیه شده از بهتری نوع نخ یکی از محصولات جدید شرکت میباشد که سالها به عنوان یکی از محصولات پر فروش در دسته پوشاک آقایان قرار دارد. خاصیت حفظ رنگ و عدم پرز دهی از ویژگی های منحصر به فرد این محصول می باشد.',
        details:[['جنس','نخی'],['یقه','گرد'],['آستین','کوتاه']],
        defaultVariantId: '165',
        variants: [
            {
                id: '165',price:280000,
                cartInfo:{inStock: 25},
                discountPercent: [{text:'تخفیف شب یلدا',value:12}], 
                optionValues:[
                    {optionType:{name:'رنگ',id:'color'},optionValue:{name:'سفید',id:'white'}},
                    {optionType:{name:'سایز',id:'size'},optionValue:{name:'S',id:'s'}}
                ]
            }
        ]
    }
    let product1 = {
        ...product,
        variants:[
            {...product.variants[0],cartInfo:{inStock: 25, max: 10, min: 5, step: 5}}
        ]
    }
    function part(content?:React.ReactNode,code?:string){
        if(!content){return null}
        return (
            <>
                <div style={{width:400}}>{content}</div>
                {AIODoc().Code(code)}
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </>
        )
    }
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            {
                part(Shop.renderProductPage({product}),
`
...
cartInfo:{inStock: 25},
...
`
                )
            }
            
            {Shop.renderPopup()}
        </div>
    )
}