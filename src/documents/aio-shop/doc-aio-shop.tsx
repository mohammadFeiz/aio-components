import React, { Component,Fragment,useState } from 'react';
import DOC from '../../resuse-components/doc.js';
import AIODoc from '../../npm/aio-documentation/aio-documentation.js';
import RVD from '../../npm/react-virtual-dom/react-virtual-dom.js';
import products from './products.tsx';
import AIOShop from '../../npm/aio-shop/aio-shop.js';
import './index.css';
import { I_AIOShop, I_AIOShop_props } from '../../npm/aio-shop/types.js';
import {Icon} from '@mdi/react';
import { mdiArrowLeftBoldCircle, mdiGift } from '@mdi/js';
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
                    { text: 'productPageImageContent', id: 'productPageImageContent', render: () => <ProductPageImageContent /> },
                    { text: 'discountPercent', id: 'discountPercent', render: () => <DiscountPercent /> },
                    { text: 'cartInfo', id: 'cartinfo', render: () => <CartInfo /> },
                    { text: 'renderProductSlider', id: 'renderProductSlider', render: () => <RenderProductSlider /> },
                    { text: 'renderCart', id: 'renderCart', render: () => <RenderCart /> },
                ]
            }}
        />
    )
}
function Part(p:{content?:any,code?:string}){
    let {content,code} = p;
    if(!content){return null}
    return (
        <>
            <div style={{maxWidth:400}}>{content}</div>
            {AIODoc().Code(code)}
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </>
    )
}
function RenderProductCard(){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = products[0]
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            <Part
                content={Shop.renderProductCard({product,type:'h',cartButton:false})}
                code={
`Shop.renderProductCard({product,type:'h',cartButton:false})`                    
                }
            />
            <Part
                content={Shop.renderProductCard({product,type:'h',cartButton:false,title:'فروش ویژه'})}
                code={
`Shop.renderProductCard({product,type:'h',cartButton:false,title:'فروش ویژه'})`
                }
            />
            <Part
                content={Shop.renderProductCard({product,type:'h',cartButton:false,variantId:'167'})}
                code={
`Shop.renderProductCard({product,type:'h',cartButton:true,variantId:'167'})`
                }
            />
            <Part
                content={Shop.renderProductCard({product,type:'hs',cartButton:false})}
                code={
`Shop.renderProductCard({product,type:'hs',cartButton:false})`
                }
            />
            <Part
                content={Shop.renderProductCard({product,type:'hs',cartButton:false,title:'فروش ویژه'})}
                code={
`Shop.renderProductCard({product,type:'hs',cartButton:false,title:'فروش ویژه'})`
                }
            />
            <Part
                content={Shop.renderProductCard({product,type:'hs',cartButton:false,variantId:'167'})}
                code={
`Shop.renderProductCard({product,type:'hs',cartButton:false,variantId:'167'})`
                }
            />
            <Part
                content={Shop.renderProductCard({product,type:'v',cartButton:false})}
                code={
`Shop.renderProductCard({product,type:'v',cartButton:false})`
                }
            />
            <Part
                content={Shop.renderProductCard({product,type:'v',cartButton:false,title:'فروش ویژه'})}
                code={
`Shop.renderProductCard({product,type:'v',cartButton:false,title:'فروش ویژه'})`
                }
            />
            <Part
                content={Shop.renderProductCard({product,type:'v',cartButton:false,variantId:'167'})}
                code={
`Shop.renderProductCard({product,type:'v',cartButton:false,variantId:'167'})`
                }
            />
            
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
    let product = products[0]
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            <Part
                content={Shop.renderProductPage({product})}
                code={
`...
Shop.renderProductPage({product})
...`
                }
            />
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
    let product = products[0]
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            <Part
                content={Shop.renderProductPage({product})}
                code={
`...
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
...`
                }
            />
            {Shop.renderPopup()}
        </div>
    )
}
function ProductPageImageContent(){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        productPageImageContent:async (product,variantId)=>{
            let variant = product.variants.find((o)=>o.id === variantId)
            let dp = 0;
            for(let i = 0; i < variant.discountPercent.length; i++){
                let {value} = variant.discountPercent[i];
                dp += value;
            }
            return (
                <div className='p-6 absolute r-0 t-0'>
                    <div 
                        style={{background:'orange',color:'#fff'}} 
                        className='br-4 p-h-3'
                    >{dp + '%'}</div>
                </div>
            )
        }
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = products[0]
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            <Part
                content={Shop.renderProductPage({product})}
                code={
`...
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
...`
                }
            />
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
    let product = products[0]
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            <Part
                content={Shop.renderProductCard({product,type:'h',cartButton:false})}
                code={
`...
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
...`
                }
            />
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
    let product = products[0]
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            <Part
                content={Shop.renderProductCard({product,type:'h',cartButton:false})}
                code={
`...
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
...`
                }
            />
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
    let product1 = products[0]
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
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            <Part
                content={Shop.renderProductCard({product:product1,type:'h',cartButton:false})}
                code={
`let product = {
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
Shop.renderProductCard({product,type:'h',cartButton:false})`
                }
            />
            <Part
                content={Shop.renderProductCard({product:product2,type:'h',cartButton:false})}
                code={
`let product = {
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
Shop.renderProductCard({product,type:'h',cartButton:false})`
                }
            />
            <Part
                content={Shop.renderProductCard({product:product3,type:'h',cartButton:false})}
                code={
`let product = {
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
Shop.renderProductCard({product,type:'h',cartButton:false})`
                }
            />
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
    let product = products[0]
    let product1 = {...product,variants:[{...product.variants[0],cartInfo:{inStock: 25, max: 10, min: 5, step: 5}}]}
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            <Part
                content={Shop.renderProductPage({product})}
                code={
`...
cartInfo:{inStock: 25},
...`                 
                }
            />
            <Part
                content={Shop.renderProductPage({product:product1})}
                code={
`...
cartInfo:{inStock: 25, max: 10, min: 5, step: 5},
...` 
                }
            />
            {Shop.renderPopup()}
        </div>
    )
}


function RenderProductSlider(){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let items = [products[0],products[0],products[0],products[0],products[0],products[0],products[0],products[0],]
    function Before(){
        return (
            <div style={{background:'red',color:'#fff',width:120}} className='align-vh t-a-center br-6 p-12 border-box'>محصولات منتخب</div>
        )
    }
    function After(){
        return (
            <div style={{background:'#fff',color:'dodgerblue',width:120}} className='align-vh t-a-center br-6 p-12 border-box'>
                <Icon path={mdiArrowLeftBoldCircle} size={2}/>
            </div>
        )
    }
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            <Part
                content={
                    Shop.renderProductSlider({
                        products:items,
                        cartButton:true,
                        before:()=>Before(),
                        after:()=>After(),
                        icon:()=>(
                            <div className='w-24 h-24 border-22 border-dashed br-100 m-h-6 align-vh'>
                                <Icon path={mdiGift} size={0.6}/>
                            </div>
                        ),
                        title:'محصولات منتخب',
                        action:{
                            text:'نمایش همه',
                            onClick:()=>alert()
                        }
                    })
                }
                code={
`...
Shop.renderProductSlider({
    products:items,
    cartButton:true,
    before:()=>Before(),
    after:()=>After(),
    title:'محصولات منتخب',
    action:{
        text:'نمایش همه',
        onClick:()=>alert()
    }
})
...`                 
                }
            />
            {Shop.renderPopup()}
        </div>
    )
}

function RenderCart(){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        getDiscounts:async ()=>{
            return [
                {title:'تخفیف جشنواره',discountPercent:12,maxDiscount:100000}
            ]
        },
        getExtras:async ()=>{
            return [
                {title:'هزینه ارسال',amount:100000}
            ]
        }
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = products[0];
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            {Shop.renderProductCard({product,type:'h'})}
            <div style={{height:12}}></div>
            {Shop.renderCart()}
            {Shop.renderPopup()}
        </div>
    )
}
