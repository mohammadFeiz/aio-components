import { useState } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import Code from '../../npm/code/index';
import products from './products.tsx';
import AIOShop from '../../npm/aio-shop/index.tsx';
import './index.css';
import { I_AIOShop, I_AIOShop_props, I_cartInfo, I_discount, I_pr, I_v } from '../../npm/aio-shop/types.js';
import {Icon} from '@mdi/react';
import { mdiArrowLeftBoldCircle, mdiCircleMedium, mdiGift } from '@mdi/js';
export default function DOC_AIOShop(props:any){
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                nested:true,
                items:()=>[
                    { 
                        text: 'product structure', id: 'product structure',
                        items:[
                            { text: 'with variant', id: 'product structure v', render: () => <Product v={true} key='v'/> },
                            { text: 'without variant', id: 'product structure nv', render: () => <Product v={false} key='nv'/> },
                        ]
                    },
                    { 
                        text: 'renderProductCard', id: 'renderProductCard', 
                        items:[
                            { text: 'with variant', id: 'renderProductCard v', render: () => <RenderProductCard v={true} key='v'/> },
                            { text: 'without variant', id: 'renderProductCard nv', render: () => <RenderProductCard v={false} key='nv' /> }
                        ]
                    },
                    { 
                        text: 'productCardContent', id: 'productCardContent',
                        items:[
                            { text: 'with variant', id: 'productCardContent v', render: () => <ProductCardContent v={true} key='v' /> },
                            { text: 'without variant', id: 'productCardContent nv', render: () => <ProductCardContent v={false} key='nv' /> }
                        ] 
                    },
                    { 
                        text: 'productCardImageContent', id: 'productCardImageContent',
                        items:[
                            { text: 'with variant', id: 'productCardImageContent v', render: () => <ProductCardImageContent v={true} key='v'/> },
                            { text: 'without variant', id: 'productCardImageContent nv', render: () => <ProductCardImageContent v={false} key='nv' /> }
                        ]
                    },
                    { 
                        text: 'renderProductPage', id: 'renderProductPage',
                        items:[
                            { text: 'with variant', id: 'renderProductPage v', render: () => <RenderProductPage v={true} key='v' /> },
                            { text: 'without variant', id: 'renderProductPage nv', render: () => <RenderProductPage v={false} key='nv' /> }
                        ]
                    },
                    { 
                        text: 'productPageContent', id: 'productPageContent',
                        items:[
                            { text: 'with variant', id: 'productPageContent v', render: () => <ProductPageContent v={true} key='v' /> },
                            { text: 'without variant', id: 'productPageContent nv', render: () => <ProductPageContent v={false} key='nv' /> }
                        ]
                    },
                    { 
                        text: 'productPageImageContent', id: 'productPageImageContent',
                        items:[
                            { text: 'with variant', id: 'productPageImageContent v', render: () => <ProductPageImageContent v={true} key='v' /> },
                            { text: 'without variant', id: 'productPageImageContent nv', render: () => <ProductPageImageContent v={false} key='nv' /> }
                        ]
                    },
                    { 
                        text: 'discountPercent', id: 'discountPercent', 
                        items:[
                            { text: 'with variant', id: 'discountPercent v', render: () => <DiscountPercent /> },
                            { text: 'without variant', id: 'discountPercent nv', render: () => <DiscountPercentNoVariant/> },
                    
                        ]
                    },
                    { 
                        text: 'renderProductSlider', id: 'renderProductSlider',
                        items:[
                            { text: 'with variant', id: 'renderProductSlider v', render: () => <RenderProductSlider v={true} key='v' /> },
                            { text: 'without variant', id: 'renderProductSlider nv', render: () => <RenderProductSlider v={false} key='nv' /> }
                        ]
                    },
                    { 
                        text: 'renderCart', id: 'renderCart', 
                        items:[
                            { text: 'with variant', id: 'renderCart v', render: () => <RenderCart v={true} key='v' /> },
                            { text: 'without variant', id: 'renderCart nv', render: () => <RenderCart v={false} key='nv' /> }
                        ]
                    },
                    { 
                        text: 'renderCheckout', id: 'renderCheckout',
                        items:[
                            { text: 'with variant', id: 'renderCheckout v', render: () => <RenderCheckout v={true} key='v' /> },
                            { text: 'without variant', id: 'renderCheckout nv', render: () => <RenderCheckout v={false} key='nv' /> }
                        ]
                    }
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
            {!!code && Code(code)}
            <div style={{marginTop:24}} className='aio-component-splitter'></div>
        </>
    )
}
function Product({v}:{v:boolean}){
    let product = products[v?0:1]
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            <Part
                content={`product structure ${v?'with':'without'} variant`}
                code={`
${JSON.stringify(product,null,4)}
                `}
            />            
        </div>
    )
}
const a = {typeId:'color',valueId:'grey',typeName:'رنگ',valueName:'خاکستری'}
function RenderProductCard({v}:{v:boolean}){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        onPayment:async ()=>true
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = products[v?0:1]
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            <Part
                content={Shop.renderProductCard({product,type:'h',cartButton:false})}
                code={
`Shop.renderProductCard({product,type:'h',cartButton:false})`                    
                }
            />
            <Part
                content={Shop.renderProductCard({product,type:'h',cartButton:true})}
                code={
`Shop.renderProductCard({product,type:'h',cartButton:true})`                    
                }
            />
            <Part
                content={Shop.renderProductCard({product,type:'h',cartButton:'readonly'})}
                code={
`Shop.renderProductCard({product,type:'h',cartButton:'readonly'})`                    
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
function RenderProductPage({v}:{v:boolean}){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        onPayment:async ()=>true
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = products[v?0:1]
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
function ProductPageContent({v}:{v:boolean}){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        productPageContent:async (product,variantId)=>{
            return (
                <div style={{color:'orange'}} className='align-vh p-24 w-100'>با خرید این محصول 100 امتیاز دریافت کنید</div>
            )
        },
        onPayment:async ()=>true
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = products[v?0:1]
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
function ProductPageImageContent({v}:{v:boolean}){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        productPageImageContent:async (product,variantId)=>{
            let cartInfo;
            if(product.hasVariant && product.variants){
                let variant = product.variants.find((o)=>o.id === variantId) as I_v
                cartInfo = variant.cartInfo;
            }
            else{
                cartInfo = product.cartInfo
            }
            let dp = 0;
            let {discountPercent = []} = cartInfo || {};
            for(let i = 0; i < discountPercent.length; i++){
                let {value} = discountPercent[i];
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
        },
        onPayment:async ()=>true
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = products[v?0:1]
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            <Part
                content={Shop.renderProductPage({product})}
                code={
`...
let Shop = new AIOShop({
    ...
    productPageImageContent:async (product,variantId)=>{
        let cartInfo;
        if(product.hasVariant){
            let variant = product.variants.find((o)=>o.id === variantId)
            cartInfo = variant.cartInfo;
        }
        else{
            cartInfo = product.cartInfo
        }
        let dp = 0;
        for(let i = 0; i < cartInfo.discountPercent.length; i++){
            let {value} = cartInfo.discountPercent[i];
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
    },
    ...
})
...`
                }
            />
            {Shop.renderPopup()}
        </div>
    )
}
function ProductCardContent({v}:{v:boolean}){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        productCardContent:async (product,variantId)=>{
            return (
                <div style={{color:'red'}} className='w-100 fs-10'>با خرید این محصول 100 امتیاز دریافت کنید</div>
            )
        },
        onPayment:async ()=>true
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = products[v?0:1]
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
function ProductCardImageContent({v}:{v:boolean}){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        productCardImageContent:async (product,variantId)=>{
            let {variants = []} = product;
            let cartInfo = variants[0].cartInfo as I_cartInfo;
            let {discountPercent = []} = cartInfo;
            return (
                <div className='p-6 absolute r-0 t-0'>
                    <div 
                        style={{background:'orange',color:'#fff'}} 
                        className='br-4 p-h-3'
                    >{discountPercent[0].value + '%'}</div>
                </div>
            )
        },
        onPayment:async ()=>true
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product = products[v?0:1]
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
        onPayment:async ()=>true
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product1 = products[0]
    let {variants = []} = product1;
    let product2 = {
        ...product1,
        variants:[{
            ...variants[0],
            cartInfo:{
                ...variants[0].cartInfo,
                discountPercent: [{text:'تخفیف شب یلدا',value:12,attrs:{style:{background:'green'}}}]
            }, 
        }]
    }
    let product3 = {
        ...product1,
        variants:[{
            ...variants[0],
            cartInfo:{
                ...variants[0].cartInfo,
                discountPercent: [
                    {text:'تخفیف شب یلدا',value:12,attrs:{style:{background:'green'}}},
                    {text:'تخفیف مشتری خوش حساب',value:10,attrs:{style:{background:'orange'}}}
                ],
            } 
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
function DiscountPercentNoVariant(){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        onPayment:async ()=>true
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let product1 = products[1]
    let product2 = {
        ...product1,
        cartInfo:{
            ...product1.cartInfo,
            discountPercent: [{text:'تخفیف شب یلدا',value:12,attrs:{style:{background:'green'}}}], 
        }
    }
    let product3 = {
        ...product1,
        cartInfo:{
            ...product1.cartInfo,
            discountPercent: [
                {text:'تخفیف شب یلدا',value:12,attrs:{style:{background:'green'}}},
                {text:'تخفیف مشتری خوش حساب',value:10,attrs:{style:{background:'orange'}}}
            ], 
        }
    }
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            <Part
                content={Shop.renderProductCard({product:product1,type:'h',cartButton:false})}
                code={
`let product = {
    ...
    defaultVariantId:'165',
    cartInfo: {
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
}
Shop.renderProductCard({product,type:'h',cartButton:false})`
                }
            />
            <Part
                content={Shop.renderProductCard({product:product2 as any,type:'h',cartButton:false})}
                code={
`let product = {
    ...
    defaultVariantId:'165',
    cartInfo: {
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
    cartInfo: {
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
}
Shop.renderProductCard({product,type:'h',cartButton:false})`
                }
            />
            {Shop.renderPopup()}
        </div>
    )
}
function RenderProductSlider({v}:{v:boolean}){
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        onPayment:async ()=>true
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let p = products[v?0:1]
    let items = [p,p,p,p,p,p,p,p,]
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

function RenderCart({v}:{v:boolean}){
    let product:I_pr = products[v?0:1];
    let props:I_AIOShop_props = {
        shopId: 'mytestrenderproductcard',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        getDiscounts:async ()=>[{title:'تخفیف جشنواره',discountPercent:12,maxDiscount:100000}],
        cartContent:async ()=>'محتوی سبد خرید',
        onPayment:async(context)=>true,
        cart:v?[{product,variants: [{"id": "165","count": 5}]}]:[{product,count: 5}]
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let productToCode = {...product,rates:'...',details:'...'};
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            {Shop.renderCart()}
            {Shop.renderPopup()}
            {
                Code(`
const product = ${JSON.stringify(productToCode,null,4)}
                `)
            }
            {
                Code(`
function RenderCart({product}){
    let props:I_AIOShop_props = {
        shopId: 'test-render-cart',
        unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        getDiscounts:async ()=>[{title:'تخفیف جشنواره',discountPercent:12,maxDiscount:100000}],
        cartContent:async ()=>'محتوی سبد خرید',
        onPayment:async(context)=>true,
        cart:[{product,"variants": [{"id": "165","count": 5}]}]
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            {Shop.renderCart()}
            {Shop.renderPopup()}
        </div>
    )
}
                `)
            }
            
        </div>
    )
}
function RenderCheckout({v}:{v:boolean}){
    let product:I_pr = products[v?0:1];
    let props:I_AIOShop_props = {
        shopId: 'testrendercheckout',unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        getDiscounts:async ({renderIn,checkout,cart})=>{
            let discounts:I_discount[] = [{title:'تخفیف جشنواره',discountPercent:12,maxDiscount:100000}]
            if(checkout.paymentType === 'in location'){
                discounts.push({title:'پرداخت در محل',discountPercent:75})
            }
            return discounts
        },
        getExtras:async ({renderIn,checkout,cart})=>{
            if(renderIn !== 'checkout'){return }
            return [{title:'هزینه ارسال',amount:{post:50000,carier:75000}[checkout.deliveryType || 'post']}]
        },
        checkoutContent:async ()=>'محتوی چک اوت',
        onPayment:async(context)=>true,
        cart:v?[{product,variants: [{"id": "165","count": 5}]}]:[{product,count: 5}],
        checkDiscountCode:async (code,context)=>{
            if(code === '123456'){
                return {
                    discountPercent:100,maxDiscount:50000,title:'کد تخفیف'
                }
            }
            return 'کد معتبر نیست'
        },
        getCheckoutItems:(context)=>{
            return [
                {
                    type:'radio',title:'نحوه ارسال',subtitle:'توصیحات',field:'deliveryType',value:'carier',
                    options:[
                        {text:'پست پیشتاز',value:'post',after:'50 هزار تومان'},
                        {text:'پیک',value:'carier',after:'75 هزار تومان'},
                    ]
                },
                {
                    type:'radio',title:'نحوه پرداخت',subtitle:'توصیحات',field:'paymentType',value:'online',
                    options:[
                        {text:'آنلاین',value:'online',after:'پرداخت کامل'},
                        {text:'درمحل',value:'in location',after:'پرداخت 25%'},
                    ]
                },
                {
                    type:'html',title:'نحوه پرداخت',subtitle:'توصیحات',field:'paymentType',value:'online',
                    html:(value,onChange)=>{
                        return (
                            <select style={{width:'100%',fontFamily:'inherit',border:'1px solid #ddd',outline:'none'}} value={value} onChange={(e)=>onChange(e.target.value)}>
                                <option value='online'>آنلاین</option>
                                <option value='in location'>درمحل</option>
                            </select>
                        )
                    }
                }
            ]
             
        }
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    let productToCode = {...product,rates:'...',details:'...'};
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            {Shop.renderCheckout()}
            {Shop.renderPopup()}
            {
                Code(`
const product = ${JSON.stringify(productToCode,null,4)}
                `)
            }
            {Code(`
function RenderCheckout({product}){
    let props:I_AIOShop_props = {
        shopId: 'testrendercheckout',unit: 'تومان',
        trans:{addToCart:'سفارش',notExist:'ناموجود'},
        getDiscounts:async ()=>[{title:'تخفیف جشنواره',discountPercent:12,maxDiscount:100000}],
        getExtras:async ({renderIn,checkout,cart})=>{
            if(renderIn !== 'checkout'){return }
            return [{title:'هزینه ارسال',amount:{post:50000,carier:75000}[checkout.deliveryType || 'post']}]
        },
        checkoutContent:async ()=>'محتوی چک اوت',
        onPayment:async(context)=>true,
        //initiate shop cart
        ${v?'cart:[{product,variants: [{"id": "165","count": 5}]}],':'cart:[{product,count:5}],'}
        checkDiscountCode:async (code,context)=>{
            if(code === '123456'){
                return {
                    discountPercent:100,maxDiscount:50000,title:'کد تخفیف'
                }
            }
            return 'کد معتبر نیست'
        },
        getCheckoutItems:(context)=>{
            return [
                {
                    type:'radio',title:'نحوه ارسال',subtitle:'توصیحات',field:'deliveryType',value:'carier',
                    options:[
                        {text:'پست پیشتاز',value:'post',after:'50 هزار تومان'},
                        {text:'پیک',value:'carier',after:'75 هزار تومان'},
                    ]
                },
                {
                    type:'radio',title:'نحوه پرداخت',subtitle:'توصیحات',field:'paymentType',value:'online',
                    options:[
                        {text:'آنلاین',value:'online',after:'پرداخت کامل'},
                        {text:'درمحل',value:'in location',after:'پرداخت 25%'},
                    ]
                },
                {
                    type:'html',title:'نحوه پرداخت',subtitle:'توصیحات',field:'paymentType',value:'online',
                    html:(value,onChange)=>{
                        return (
                            <select style={{width:'100%',fontFamily:'inherit',border:'1px solid #ddd',outline:'none'}} value={value} onChange={(e)=>onChange(e.target.value)}>
                                <option value='online'>آنلاین</option>
                                <option value='in location'>درمحل</option>
                            </select>
                        )
                    }
                }
            ]
                
        }
    }
    let [Shop] = useState<I_AIOShop>(new AIOShop(props))
    return (
        <div className='example' style={{direction:'rtl',background:'#aaa'}}>
            {Shop.renderCheckout()}
            {Shop.renderPopup()}
        </div>
    )
}
            `)}
        </div>
    )
}