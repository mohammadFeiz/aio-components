import React, { useEffect, useState } from 'react';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom.js';
import AIOStorage from './../../npm/aio-storage/aio-storage.js';
import AIOPopup from './../../npm/aio-popup/aio-popup.js';
import AIOInput from './../../npm/aio-input/aio-input.js';
import ACS from './../../npm/aio-content-slider/aio-content-slider.js';
import {SplitNumber} from './../../npm/aio-utils/aio-utils.js';
import { makeAutoObservable,toJS } from "mobx"
import { observer } from "mobx-react-lite"
import {Icon} from '@mdi/react';
import { mdiAlert, mdiAlertBox, mdiArrowDown, mdiArrowUp, mdiCart, mdiCash, mdiChevronDown, mdiChevronUp, mdiDelete, mdiInformation, mdiMinus, mdiPlus, mdiPlusMinus } from '@mdi/js';
import classes from './classes';
import './index.css';
import { 
    I_Cart,I_CartButton,I_Checkout,I_DiscountPercent,I_Factor,I_Factor_details,I_FinalPrice,I_ProductCard,I_pr_detail,I_pr_optionType, 
    I_ProductCard_content,I_ProductPage,I_ProductPage_content,I_ProductSlider,I_AIOShop, I_AIOShop_changeCart, I_AIOShop_context, 
    I_getVariantIcon, I_AIOShop_props, I_VariantLabels, I_cart,I_cart_content, I_cart_product, I_cart_variant, I_checkDiscountCode, 
    I_checkout, I_checkout_content, I_checkout_html, I_checkout_item, I_checkout_radio, I_discount, I_discountPercent, I_extra, I_getCartLength, 
    I_getCartVariant, I_getCartVariants, I_getCheckoutItems, I_getDiscounts, I_getExtras, I_getOptionTypes, I_getVariantByOptionValues, 
    I_openModal, I_pr, I_productCardImageContent, I_productPageImageContent, I_renderCart, I_renderCartButton, I_renderCheckout,
    I_renderProductCard, I_renderProductPage, I_renderProductSlider, I_setCheckout, I_trans, I_v, I_v_ov, I_v_label, I_pr_rate, I_addProductToCart, I_addVariantToCart, I_getNewCartVariant, I_removeVariantFromCart, I_changeCartVariant, I_Rates, I_renderRates 
} from './types';
import { I_RVD_node } from '../react-virtual-dom/types.js';
//////rvd
export default class AIOShop implements I_AIOShop{
    unit:string;
    popup:any;
    storage:any;
    cart:I_cart;
    shopId:any;
    trans:I_trans;
    cls:{[key:string]:string};
    checkout:I_checkout;
    setCheckout:I_setCheckout;
    getCheckoutItems:I_getCheckoutItems;
    checkDiscountCode:I_checkDiscountCode;
    getContext:()=>I_AIOShop_context;
    renderProductCard:I_renderProductCard;
    renderProductPage:I_renderProductPage;
    renderProductSlider:I_renderProductSlider;
    renderCart:I_renderCart;
    renderCheckout:I_renderCheckout;
    renderRates:I_renderRates;
    renderCartButton:I_renderCartButton;
    renderPopup:()=>React.ReactNode;
    getVariantIcon:I_getVariantIcon;
    changeCart:I_AIOShop_changeCart;
    setCart:(newCart:I_cart)=>void;
    addProductToCart:I_addProductToCart;
    addVariantToCart:I_addVariantToCart;
    getNewCartVariant:I_getNewCartVariant;
    removeVariantFromCart:I_removeVariantFromCart;
    changeCartVariant:I_changeCartVariant;
    getFinalPrice:(variant:I_v)=>number;
    getDiscountPercent:(discountPercent:I_discountPercent[])=>number;
    getCartVariant:I_getCartVariant;
    getCartVariants:I_getCartVariants;
    getCartLength:I_getCartLength;
    getOptionTypes:I_getOptionTypes;
    getVariantByOptionValues:I_getVariantByOptionValues;
    openModal:I_openModal;
    productPageImageContent:I_productPageImageContent;
    productCardImageContent:I_productCardImageContent;
    cartContent:I_cart_content;
    checkoutContent:I_checkout_content;
    getDiscounts:I_getDiscounts;
    getExtras:I_getExtras;
    productCardContent:I_ProductCard_content;
    productPageContent:I_ProductPage_content;
    constructor(props:I_AIOShop_props){
        for(let prop in props){this[prop] = props[prop]}
        this.setCheckout = (checkout:I_checkout)=>{this.checkout = checkout};
        this.popup = new AIOPopup();
        let storage = AIOStorage(`ShopClass_${this.shopId}`);
        let cart = storage.load({name:'cart',def:[]});
        this.cart = cart;
        this.storage = storage;
        this.checkout = {};
        this.cls = classes;
        this.renderPopup = ()=>this.popup.render()
        this.getOptionTypes = (variants:I_v[]) => {
            let dic:{[key:string]:I_pr_optionType} = {}
            for(let i = 0; i < variants.length; i++){
                let {optionValues} = variants[i];
                for(let j = 0; j < optionValues.length; j++){
                    let optionValue:I_v_ov = optionValues[j];
                    let {optionType:ot,optionValue:ov} = optionValue;
                    if(!dic[ot.id.toString()]){dic[ot.id.toString()] = {id:ot.id,name:ot.name,values:[]}} 
                    if(!dic[ot.id.toString()].values.find((o)=>o.id === ov.id)){
                        dic[ot.id.toString()].values.push({id:ov.id,name:ov.name})
                    }
                }
            }
            return Object.keys(dic).map((key)=>dic[key]);
        }
        this.getContext = ()=>{
            let context:I_AIOShop_context = {
                unit:this.unit,cart:this.cart,
                cls:this.cls,changeCart:this.changeCart.bind(this),
                getCartVariant:this.getCartVariant.bind(this),
                getCartVariants:this.getCartVariants.bind(this),
                getVariantByOptionValues:this.getVariantByOptionValues.bind(this),
                getOptionTypes:this.getOptionTypes.bind(this),
                productPageImageContent:this.productPageImageContent,
                productCardImageContent:this.productCardImageContent,
                productCardContent:this.productCardContent,
                productPageContent:this.productPageContent,
                cartContent:this.cartContent,
                checkoutContent:this.checkoutContent,
                getDiscounts:this.getDiscounts,
                getExtras:this.getExtras, 
                openModal:this.openModal.bind(this),
                checkout:this.checkout,
                getCheckoutItems:this.getCheckoutItems,
                setCheckout:this.setCheckout,
                checkDiscountCode:this.checkDiscountCode,  
                trans:this.trans,
            }
            return context;
        }
        this.getDiscountPercent = (discountPercent:I_discountPercent[])=>{
            let dp = 0;
            for(let i = 0; i < discountPercent.length; i++){dp += discountPercent[i].value;}
            return dp;
        }
        this.getFinalPrice = (variant)=>{
            let dp = this.getDiscountPercent(variant.discountPercent);
            return variant.price - (variant.price * dp / 100)
        }
        this.getCartVariant = (p:{product:I_pr,variantId?:any})=>{
            let {product,variantId} = p;
            let cartVariants:I_cart_variant[] = this.getCartVariants(product.id);
            if(!cartVariants.length){return false}
            let cartVariant:I_cart_variant = cartVariants.find((o:I_cart_variant)=>o.id === variantId)
            if(!cartVariant){return false}
            return cartVariant
        }
        this.getCartVariants = (productId)=>{
            let cartProduct:I_cart_product = this.cart.find((o:I_cart_product)=>o.product.id === productId)
            if(!cartProduct){return []}
            let cartVariants:I_cart_variant[] = cartProduct.cartVariants;
            return cartVariants
        }
        this.getCartLength = ()=>{
            let res = 0;
            for(let i = 0; i < this.cart.length; i++){
                let {cartVariants}:I_cart_product = this.cart[i];
                for(let j = 0; j < cartVariants.length; j++){
                    let {count}:I_cart_variant = cartVariants[j]
                    res += count;
                } 
            }
            return res;
        }
        this.getVariantByOptionValues = (product:I_pr,optionValues:I_v_ov[])=>{
            let dic = {}
            for(let i = 0; i < optionValues.length; i++){
                let {optionType:ot,optionValue:ov} = optionValues[i];
                dic[ot.id.toString()] = ov.id;
            }
            let variant:I_v = product.variants.find((variant:I_v)=>{
                let {optionValues} = variant;
                for(let i = 0; i < optionValues.length; i++){
                    let {optionType:ot,optionValue:ov} = optionValues[i];
                    if(dic[ot.id.toString()] !== ov.id){return false}
                }
                return true
            })
            return variant
        }
        this.setCart = (newCart:I_cart)=>this.cart = newCart;
        this.getNewCartVariant = (p)=>{
            let {product,variantId,count} = p;
            let variant = product.variants.find((v:I_v)=>v.id === variantId);
            let {price,cartInfo,id} = variant;
            let {min,max,step} = cartInfo;
            let finalPrice = this.getFinalPrice(variant);
            let cartVariant:I_cart_variant = {id,count,price,finalPrice,min,max,step,productId:product.id};
            return cartVariant; 
        }
        this.addProductToCart = (p)=>{
            let cart = toJS(this.cart);
            let {product} = p;
            let newCartVariant:I_cart_variant = this.getNewCartVariant(p);
            let newCartProduct:I_cart_product = {product,cartVariants:[newCartVariant]}
            let newCart:I_cart = [...cart,newCartProduct] 
            return newCart;
        }
        this.addVariantToCart = (p)=>{
            let cart = toJS(this.cart);
            let {product} = p;
            let newCart:I_cart = cart.map((o:I_cart_product)=>{
                if(o.product.id !== product.id){return o}
                let newCartVariant:I_cart_variant = this.getNewCartVariant(p);
                let newCartProduct:I_cart_product = {...o,cartVariants:[...o.cartVariants,newCartVariant]}
                return newCartProduct;
            })
            return newCart;
        }
        this.removeVariantFromCart = (p)=>{
            let cart = toJS(this.cart);
            let {product,variantId} = p;
            let cartProduct:I_cart_product = cart.find((o:I_cart_product)=>o.product.id === product.id);
            let newCartVariants = cartProduct.cartVariants.filter((o:I_cart_variant)=>o.id !== variantId);
            let newCart:I_cart;
            if(!newCartVariants.length){
                newCart = cart.filter((o:I_cart_product)=>o.product.id !== product.id);
            }
            else {
                let newCartProduct:I_cart_product = {...cartProduct,cartVariants:newCartVariants}
                newCart = cart.map((o:I_cart_product)=>o.product.id === product.id?newCartProduct:o)
            }
            return newCart;
        }
        this.changeCartVariant = (cartProduct,cartVariant,count)=>{
            let cart = toJS(this.cart),{product} = cartProduct,variantId = cartVariant.id;
            let p = {product,variantId,count};
            let newCartVariants:I_cart_variant[] = cartProduct.cartVariants.map((o:I_cart_variant)=>o.id !== variantId?o:this.getNewCartVariant(p));
            let newCartProduct:I_cart_product = {...cartProduct,cartVariants:newCartVariants}
            let newCart:I_cart = cart.map((o:I_cart_product)=>o.product.id !== product.id?o:newCartProduct)
            return newCart;
        }
        this.changeCart = (p)=>{
            let {product,variantId,count} = p;
            let newCart:I_cart;
            if(count === 0){newCart = this.removeVariantFromCart(p)}
            else {
                let cart = toJS(this.cart);
                let cartProduct:I_cart_product = cart.find((o:I_cart_product)=>o.product.id === product.id);
                if(!cartProduct){newCart = this.addProductToCart(p);}
                else{
                    let cartVariant:I_cart_variant = cartProduct.cartVariants.find((o:I_cart_variant)=>o.id === variantId);
                    if(!cartVariant){newCart = this.addVariantToCart(p);}
                    else{newCart = this.changeCartVariant(cartProduct,cartVariant,count);    }
                }
            }
            this.setCart(newCart);
        }
        this.renderProductCard = (p:I_ProductCard)=><ProductCard {...p} getContext={this.getContext}/>;
        this.renderCartButton = (p:I_CartButton)=><CartButton {...p} getContext={this.getContext}/>;
        this.renderProductPage = (p:I_ProductPage)=><ProductPage {...p} getContext={this.getContext}/>;
        this.renderProductSlider = (p:I_ProductSlider)=><ProductSlider {...p} getContext={this.getContext}/>;
        this.renderCart = ()=><Cart getContext={this.getContext}/>;
        this.renderRates = (p:I_Rates)=><Rates {...p} getContext={this.getContext}/>;
        this.renderCheckout = ()=><Checkout getContext={this.getContext}/>;
        this.openModal = (p)=>{
            let {title,render,position,backdrop} = p;
            let header = title?{title}:false;
            this.popup.addModal({position,header,body:{render,attrs:{style:{height:'100%'}}},backdrop})
        }
        makeAutoObservable(this)
    }
}
const Checkout = observer((props: I_Checkout) => {
    let {getContext} = props,context = getContext();
    let {cart,getCheckoutItems = ()=>[],checkout,setCheckout,cls,checkoutContent = ()=> false} = context;
    let checkoutItems:I_checkout_item[] = getCheckoutItems(context);
    let [content,setContent] = useState<React.ReactNode>();
    async function getContent(){
        let content:React.ReactNode | false = await checkoutContent(context);
        if(content){setContent(content)}
    }
    function change(changeObject: any) {
        let newCheckout:I_checkout = { ...checkout, ...changeObject }
        setCheckout(newCheckout);
    }
    useEffect(() => {
        let checkout:I_checkout = {};
        for (let i = 0; i < checkoutItems.length; i++) {
            let checkoutItem = checkoutItems[i];
            let { value, field } = checkoutItem;
            if (!field) { continue; }
            checkout[field] = value;
        }
        setCheckout(checkout);
        getContent();
    }, []);
    function cartProducts_layout():I_RVD_node {
        return {
            className:cls['checkout-products'],
            column:cart.map((cartProduct:I_cart_product)=>{
                let {product} = cartProduct;
                let props:I_ProductCard = {product,cartButton:'readonly',type:'hs',getContext}
                let node:I_RVD_node = {className:cls['checkout-product'],html:<ProductCard {...props}/>}
                return node
            })
        }
    }
    function items_layout():I_RVD_node {
        if (!checkoutItems.length) { return false }
        return {
            className:cls['checkout-items'],
            column: checkoutItems.map((checkoutItem: I_checkout_item, i) => {
                let { show = ()=> true,type} = checkoutItem;
                if (show(context) === false) { return false }
                if (type === 'html') { return itemHtml_layout(checkoutItem as I_checkout_html) }
                else if(type === 'radio'){return itemRadio_layout(checkoutItem as I_checkout_radio)}
            })
        }
    }
    function label_layout(title:string,subtitle?:string):I_RVD_node{
        return {
            align:'v',
            row:[
                {html:title,className:cls['checkout-title']},
                {show:!!subtitle,html:()=>`( ${subtitle} )`,className:cls['checkout-subtitle']}, 
            ]
        }
    }
    function itemHtml_layout(checkoutItem:I_checkout_html):I_RVD_node {
        let { title, subtitle, html,field } = checkoutItem;
        let content:React.ReactNode = html(checkout[field],(newValue)=>change({[field]:newValue}))
        let className = `${cls['checkout-item']} ${cls['checkout-item-html']}`;
        return {column:[label_layout(title,subtitle),{ html: content,className }]}
    }
    function itemRadio_layout(checkoutItem:I_checkout_radio):I_RVD_node {
        let { title, subtitle } = checkoutItem;
        return {column:[label_layout(title,subtitle),radio_layout(checkoutItem)]}
    }
    function radio_layout(checkoutItem:I_checkout_radio):I_RVD_node{
        let { options, field, multiple } = checkoutItem;
        let className = `${cls['checkout-item']} ${cls['checkout-item-radio']}`;
        return {
            className,
            html: (
                <AIOInput
                    type='radio'
                    multiple={multiple}
                    options={options.map((o) => { return { ...o, before: o.icon } })}
                    optionAttrs={()=>{return {className:cls["checkout-item-radio-option"]}}}
                    value={checkout[field]}
                    onChange={(value:any) => change({ [field]: value })}
                />
            )
        }
    }
    function content_layout():I_RVD_node{
        return !content?false:{className:`${cls['checkout-content']} ${cls['pp-box']}`,html:content}
    }
    function factor_layout():I_RVD_node {
        let props:I_Factor = {getContext,renderIn:'checkout',mode:'details'}
        return { html: <Factor {...props}/>,className:`${cls['checkout-factor']} ${cls['pp-box']}` }
    }
    function footer_layout():I_RVD_node {
        let props:I_Factor = {getContext,renderIn:'checkout',mode:'payment'}
        return { html: <Factor {...props}/>,className:'checkout-footer' }
    }
    return (
        <RVD
            layout={{
                className:cls['checkout'],
                column: [
                    {
                        flex: 1, className: cls['checkout-body'],
                        column: [
                            cartProducts_layout(),
                            items_layout(),
                            content_layout(),
                            factor_layout(),
                        ]
                    },
                    footer_layout(),
                ]
            }}
        />
    )
})
const Cart = observer((props:I_Cart) => {
    let { getContext } = props,context = getContext();
    let {cart,cls,unit} = context;    
    let [content,setContent] = useState<React.ReactNode>();
    async function getContent(){
        if(typeof context.cartContent !== 'function'){return}
        let content:React.ReactNode = await context.cartContent(cart);
        setContent(content);
    }
    useEffect(()=>{getContent()},[cart])
    function body_layout():I_RVD_node{return {className:cls['cart-body'],column:[cartProducts_layout(),content_layout(),factor_layout()]}}
    function cartProducts_layout() {return { className: cls['cart-products'], column: cart.map((o:I_cart_product) => cartProduct_layout(o)) }}
    function cartProduct_layout(cartProduct:I_cart_product) {
        let {product} = cartProduct;
        let props:I_ProductCard = {product,type:'hs',cartButton:true,getContext}
        let productCard = <ProductCard {...props}/>
        return { className: cls['c-product'], html: productCard }
    }
    function content_layout():I_RVD_node{return !content?false:{className:`${cls['cart-content']} ${cls['pp-box']}`,html:content}}
    function factor_layout():I_RVD_node{
        let props:I_Factor = {renderIn:'cart',getContext,mode:'details'}
        return {className:`${cls['cart-factor']} ${cls['pp-box']}`,html:<Factor {...props}/>}
    }
    function footer_layout():I_RVD_node{
        let props:I_Factor = {renderIn:'cart',getContext,mode:'payment'}
        return {className:cls['cart-footer'],html:<Factor {...props}/>}
    }
    if (!cart.length) {return (<RVD layout={{className: cls['cart'],html: 'سبد خرید شما خالی است', align: 'vh'}}/>)}
    return (<RVD layout={{className: cls['cart'],column: [body_layout(),footer_layout()]}}/>)
})
const Factor = observer((props:I_Factor) => {
    let {renderIn,getContext,mode} = props,context = getContext();
    let {cart,checkout,cls,unit,checkDiscountCode} = context;
    let [details,setDetails] = useState<I_Factor_details>({price:0,payment:0,productsDiscount:0,discounts:[],extras:[]})
    let [discountCodeTemp, setDiscountCodeTemp] = useState<string>('');
    let [fetchedDiscountCode, setFetchedDiscountCode] = useState<I_discount | string>();
    async function getDetails(){
        let {getDiscounts = ()=>[],getExtras = ()=>[]} = context;
        let Discounts:I_discount[] = await getDiscounts(renderIn,context);
        if(typeof fetchedDiscountCode === 'object' && fetchedDiscountCode.discountPercent && fetchedDiscountCode.maxDiscount){
            Discounts.push({...fetchedDiscountCode,title:'کد تخفیف'})
        }
        
        let Extras:I_extra[] = await getExtras(renderIn,context);
        let price = 0,payment = 0,productsDiscount = 0;
        for(let i = 0; i < cart.length; i++){
            let {cartVariants}:I_cart_product = cart[i];
            for(let j = 0; j < cartVariants.length; j++){
                let cv:I_cart_variant = cartVariants[j];
                price += cv.price; payment += cv.finalPrice;
            }
        }
        productsDiscount = price - payment;
        let discounts = Discounts.map((discount:I_discount)=>{
            let {discountPercent,maxDiscount = Infinity} = discount;
            let amount = Math.min(maxDiscount,Math.round(payment * discountPercent / 100));
            payment -= amount;
            return {discount,amount}
        })
        let extras = Extras.map((extra:I_extra)=>{payment += extra.amount; return extra})
        let details:I_Factor_details = {price,payment,productsDiscount,discounts,extras}
        setDetails(details)
    }
    useEffect(()=>{getDetails()},[cart,checkout,fetchedDiscountCode])  
    function discountCode_layout():I_RVD_node {
        if (!checkDiscountCode) { return false }
        return {
            className: 'factor-discount-code',
            row: [
                {
                    flex: 1,
                    html: (
                        <input
                            disabled={typeof fetchedDiscountCode === 'object'} placeholder='کد تخفیف' type='text' value={discountCodeTemp}
                            onChange={(e) => { setDiscountCodeTemp(e.target.value); setFetchedDiscountCode(undefined) }}
                        />
                    )
                },
                {
                    html: (
                        <button
                            disabled={typeof fetchedDiscountCode === 'object' || !discountCodeTemp}
                            onClick={async () => {
                                let discountCode:I_discount | string = await checkDiscountCode(discountCodeTemp, context);
                                setFetchedDiscountCode(discountCode)
                            }}
                        >ثبت کد تخفیف</button>
                    )
                }
            ]
        }
    }
    function discountCodeError_layout():I_RVD_node {
        if (typeof fetchedDiscountCode !== 'string') { return false }
        return { className: cls['factor-discount-code-error'], html: fetchedDiscountCode }
    }
    
    function price_layout(price:number):I_RVD_node{
        return {
            className:cls['factor-total'],align:'v',
            row:[
                {className:cls['factor-icon'],html:<Icon path={mdiCash} size={0.6}/>},
                {className:cls['factor-key'],html:'جمع سبد خرید',flex:1},
                {className:cls['factor-value'],html:SplitNumber(price)},
                {className:cls['factor-unit'],html:unit},
            ]
        }
    }
    function products_discount_layout(amount):I_RVD_node{
        return {
            className:cls['factor-products-discount'],align:'v',
            row:[
                {className:cls['factor-icon'],html:<Icon path={mdiMinus} size={0.6}/>},
                {className:cls['factor-key'],html:'تخفیف کالا ها',flex:1},
                {className:cls['factor-value'],html:SplitNumber(amount)},
                {className:cls['factor-unit'],html:unit},
            ]
        }
    }
    function discount_layout(o:{discount:I_discount,amount:number}):I_RVD_node{
        let {discount,amount} = o;
        return {
            column:[
                {
                    className:cls['factor-discount'],align:'v',
                    row:[
                        {
                            column:[
                                {
                                    gap:3,align:'v',
                                    row:[
                                        {className:cls['factor-minus'],html:<Icon path={mdiMinus} size={0.6}/>},
                                        {className:cls['factor-key'],html:`${discount.title}`},
                                        {className:cls['dp'],html:`${discount.discountPercent}%`},
                                    ]
                                },
                                {className:cls['factor-max-discount'],show:!!discount.maxDiscount && discount.maxDiscount !== Infinity,html:()=>`تا سقف ${SplitNumber(discount.maxDiscount)} ${unit}`}
                            ]
                        },
                        {flex:1},
                        {className:cls['factor-value'],html:`${SplitNumber(amount)}`},
                        {className:cls['factor-unit'],html:unit},
                    ]
                },
                
            ]
        }
    }
    function extra_layout(extra:I_extra):I_RVD_node{
        let {title,amount} = extra;
        return {
            className:cls['factor-extra'],align:'v',  
            row:[
                {className:cls['factor-icon'],html:<Icon path={mdiPlus} size={0.6}/>},
                {className:cls['factor-key'],html:title,flex:1},
                {className:cls['factor-value'],html:`${SplitNumber(amount)}`},
                {className:cls['factor-icon'],html:unit}
            ]
        }
    }
    function onSubmit(){
        if(renderIn === 'cart'){
            const render = ()=>{
                let props:I_Checkout = {getContext}
                return <Checkout {...props}/>
            }
            context.openModal({title:'تکمیل خرید',render})
        }
    }
    function button_layout():I_RVD_node{
        let text = renderIn === 'cart'?'تکمیل خرید':`پرداخت ${SplitNumber(details.payment)} ${unit}`
        return {className:cls['factor-continue'],html:<button onClick={()=>onSubmit()}>{text}</button>,align:'vh'}
    }
    function amount_layout():I_RVD_node{
        return {
            align:'v',flex:1,
            column:[
                {
                    row:[
                        {flex:1},
                        {html:'مبلغ قابل پرداخت',className:cls['factor-payment-text']},
                    ]
                },
                {
                    gap:3,align:'v',
                    row:[
                        {flex:1},
                        {html:SplitNumber(details.payment),className:cls['factor-payment-value']},
                        {html:unit,className:cls['factor-payment-unit']},
                    ]
                }
            ]
        }
    }
    if(mode === 'details'){
        let DiscountCode = discountCode_layout()
        let DiscountCodeError = discountCodeError_layout()
        let Price = price_layout(details.price)
        let ProductsDiscount = products_discount_layout(details.productsDiscount);
        let Discounts = !details.discounts.length?false:{column:details.discounts.map((o)=>discount_layout(o))}
        let Extras = !details.extras.length?false:{column:details.extras.map((extra:I_extra)=>extra_layout(extra))}
        return (<RVD layout={{className:cls['factor'],column:[DiscountCode,DiscountCodeError,Price,ProductsDiscount,Discounts,Extras]}}/>)
    }
    else if(mode === 'payment'){
        return (<RVD layout={{className:`${cls['factor']} ${cls['factor-payment']}`,row:[button_layout(),amount_layout()]}}/>)
    }
})
function ProductSlider(props:I_ProductSlider){
    let {title = '',action,before = () => false,after = () => false,products,getContext,cartButton = false,icon} = props,context = getContext();
    let {cls} = context;
    function header_layout():I_RVD_node{
        if(!title && !action){return false}
        let row:I_RVD_node[] = [
            
        ]
        if(icon){row.push({align:'vh',html:icon})}
        row.push({align:'v',flex:1,html:title,className:cls['ps-title']})
        if(action){row.push({html:action.text,className:cls['ps-action'],onClick:action.onClick})}
        return {align:'v',className:cls['ps-header'],row}
    }
    function body_layout():I_RVD_node{
        return {className:cls['ps-body'],row:[before_layout(),products_layout(),after_layout()]}
    }
    function before_layout():I_RVD_node{
        let res = before(); if(!res){return false}
        return {className:cls['ps-before'],html:res}
    }
    function products_layout():I_RVD_node{
        return {
            className:cls['ps-products'],
            row:products.map((product:I_pr)=>{
                let props:I_ProductCard = {type:'v',product,cartButton,getContext}
                return {className:cls['ps-product'],html:<ProductCard {...props}/>}
            })
        }
    }
    function after_layout():I_RVD_node{
        let res = after(); if(!res){return false}
        return {className:cls['ps-after'],html:res}
    }
    return (<RVD layout={{className:cls['ps'],column:[header_layout(),body_layout()]}}/>)
}
const ProductPage = observer((props:I_ProductPage) => {
    let {product,variantIds = product.variants.map((o:I_v)=>o.id),getContext} = props,context = getContext();
    let {images,details = [],description,rates = []} = product;
    let [imageContent,setImageContent] = useState<React.ReactNode>()
    let [content,setContent] = useState<React.ReactNode>()
    let [showFull,setShowFull] = useState<{[key:string]:boolean}>({});
    async function getImageContent(){
        if(typeof context.productPageImageContent !== 'function'){return}
        setImageContent(await context.productPageImageContent(product,variant?variant.id:undefined))
    }
    async function getContent(){
        if(typeof context.productPageContent !== 'function'){return}
        setContent(await context.productPageContent(product,variant?variant.id:undefined))
    }
    useEffect(()=>{getImageContent(); getContent()},[])
    let {cls,trans} = context;
    let [variants] = useState<I_v[]>(product.variants.filter((o:I_v)=>variantIds.indexOf(o.id) !== -1 && !!o.cartInfo.inStock));
    let [selectedOptionValues,setSelectedOptionValues] = useState<I_v_ov[]>(getInitialOptionValues(variants));
    let [optionTypes] = useState<I_pr_optionType[]>(context.getOptionTypes(variants));
    let variant = context.getVariantByOptionValues(product,selectedOptionValues)
    
    function changeVariant(optionType:I_pr_optionType,value:{name:string,id:any}){        
        let newOptionValues:I_v_ov[] = selectedOptionValues.map((o:I_v_ov)=>{
            return o.optionType.id === optionType.id?{optionType:{id:optionType.id,name:optionType.name},optionValue:{id:value.id,name:value.name}}:o
        })
        setSelectedOptionValues(newOptionValues); 
    }
    function getInitialOptionValues(variants:I_v[]){
        let variantId = props.variantId || product.defaultVariantId;
        let variant = variants.find((o:I_v)=>o.id === variantId) || variants[0];
        return JSON.parse(JSON.stringify(variant.optionValues))
    }
    function image_content(){return !imageContent?null:<div className={cls['pp-image-content']}>{imageContent}</div>}
    function image_layout():I_RVD_node{return {className:cls['pp-image_layout'],html:(<>{imageSlider()}{image_content()}</>)}}
    function imageSlider(){
        return (
            <ACS
                autoSlide={false}
                items={images.map((image:string)=>{
                    return <img src={image} alt='' height='240px'/>
                })}
            />
        )
    }
    function name_layout():I_RVD_node{return {html:product.name,className:cls['pp-name']}}
    function optionTypes_layout():I_RVD_node{
        return {className:`of-visible ${cls['pp-optionTypes']} ${cls['pp-box']}`,column:optionTypes.map((o:I_pr_optionType)=>optionType_layout(o))}
    }
    
    function optionType_layout(optionType:I_pr_optionType):I_RVD_node{
        let {id:optionTypeId,name:optionTypeName,values} = optionType;
        let selectedOptionValue:I_v_ov = selectedOptionValues.find((o:I_v_ov)=>o.optionType.id === optionTypeId)
        return {
            className:cls['pp-optionType'],
            column:[
                {className:cls['pp-label'],html:`${optionTypeName} : ${selectedOptionValue.optionValue.name}`},
                {className:cls['pp-optionValue-buttons'],row:values.map((value:{name:string,id:any})=>optionValueButton_layout(optionType,value,selectedOptionValue))}
            ]
        }
    }
    function optionValueButton_layout(optionType:I_pr_optionType,value:{name:string,id:any},selectedOptionValue:I_v_ov):I_RVD_node{
        let {name:optionValueName,id:optionValueId} = value;
        let active = selectedOptionValue.optionValue.id === optionValueId
        let className = cls['pp-optionValue-button'] + (active?' active':'');
        let button = <button className={className} onClick={()=>changeVariant(optionType,value)}>{optionValueName}</button>
        return {html:button}
    }
    function label_layout(label:string,field?:string):I_RVD_node{
        return {
            align:'v',className:cls['pp-label-row'],
            row:[
                {html:label,className:cls['pp-label'],flex:1},
                {
                    className:cls['pp-show-more'],show:!!field,align:'v',
                    onClick:()=>setShowFull({...showFull,[field]:!showFull[field]}),
                    row:[
                        {html:<Icon path={showFull[field]?mdiChevronUp:mdiChevronDown} size={0.8}/>},
                        {html:()=>showFull[field]?'نمایش کمتر':'نمایش بیشتر'}
                    ]
                }
            ]
        }
    }
    function details_layout():I_RVD_node{
        if(!details.length){return false}
        let Details:I_pr_detail[] = showFull.details?details:details.slice(0,3);
        return {className:`${cls['pp-details']} ${cls['pp-box']}`,column:[label_layout('مشخصات','details'),{column:Details.map((o:I_pr_detail)=>detail_layout(o))}]}
    }
    function detail_layout(detail:I_pr_detail):I_RVD_node{
        let [key,value] = detail;
        let KEY = {html:`${key}:`,className:cls['pp-detail-key']}
        let VALUE = {html:value,className:cls['pp-detail-value']}
        return {align:'v',className:cls['pp-detail'],row:[bullet_layout(),KEY,VALUE]}
    }
    function description_layout():I_RVD_node{
        if(!description){return false}
        let Description = showFull.description?description:description.slice(0,64) + ' ...';
        return {className:`${cls['pp-desc']} ${cls['pp-box']}`,column:[label_layout('توضیحات','description'),{className:cls['pp-desc-text'],html:Description}]}
    }
    function bullet_layout():I_RVD_node{return {html:<div className={cls['pp-detail-bullet']}></div>,align:'vh'}}
    function content_layout():I_RVD_node{return !content?false:{className:`${cls['pp-content']} ${cls['pp-box']}`,html:content}}
    function rates_layout():I_RVD_node{
        if(!rates.length){return false}
        let props:I_Rates = {getContext,rates}
        return {className:`${cls['pp-rates']} ${cls['pp-box']}`,column:[label_layout('امتیاز'),{html:<Rates {...props}/>}]}
    }
    function footer_layout():I_RVD_node{return {className:cls['pp-footer'],row:[cartButton_layout(),{flex:1},amounts_layout()]}}
    function amounts_layout():I_RVD_node{return !variant?false:{className:cls['pp-amounts'],column:[discount_layout(),finalPrice_layout()]}}
    function icon_layout(path:any,size:number){return {html:<Icon path={path} size={size}/>}}
    function cartButton_layout():I_RVD_node{
        if(!variant){return {className:cls['pp-not-exist'],align:'vh',row:[icon_layout(mdiInformation,0.9),{html:trans.notExist}]}}
        let props:I_CartButton = {product,variantId:variant.id,readonly:false,getContext}
        return {className:'of-visible',align:'vh',html:<CartButton {...props}/>}
    }
    function discount_layout():I_RVD_node{let props:I_DiscountPercent = {product,getContext}; return {html:<DiscountPercent {...props}/>}}
    function finalPrice_layout():I_RVD_node{let props:I_FinalPrice = {getContext,product}; return {html:<FinalPrice {...props}/>}}
    function body_layout(){
        let column = [image_layout(),name_layout(),optionTypes_layout(),details_layout(),description_layout(),rates_layout(),content_layout()]
        return {flex:1,className:cls['pp-body'],column}
    }
    return (<RVD layout={{className:cls['pp'],column:[body_layout(),footer_layout()]}}/>)
})
function Rates(props:I_Rates){
    let {getContext,rates} = props,context = getContext(),{cls} = context;
    function item_layout(rate:I_pr_rate):I_RVD_node{
        let [key,value] = rate;
        let sliderProps = {direction:'left',className:cls['rate-item-slider'],type:'slider',start:0,end:5,step:0.1,value}
        return {
            className:cls['rate-item'],align:'v',
            row:[{html:key,className:cls['rate-item-text']},{flex:1,html:<AIOInput {...sliderProps}/>},{html:value,className:cls['rate-item-value'],align:'vh'}]
        }
    }
    return <RVD layout={{className:cls['rate-items'],column:rates.map((rate:I_pr_rate)=>item_layout(rate))}}/>
}
const CartButton = observer((props:I_CartButton) => {
    let {product,variantId,readonly,getContext} = props;
    let {cls,trans,changeCart,getCartVariant} = getContext();
    let cartVariant = getCartVariant({product,variantId})
    let count = !cartVariant?0:cartVariant.count;
    function notExist_layout():I_RVD_node{return {className:`${cls['cb']}`,html:<span className='cb-not-exist'>{trans.notExist}</span>}}
    function icon_layout():I_RVD_node{return {html:<Icon path={mdiCart} size={0.6}/>,className:cls['cb-icon']}}
    function count_layout(style?:any):I_RVD_node{return {html:count,align:'vh',className:cls['cb-count'],style}}
    function changeStep(offset){
        let newCount = count + offset;
        if(newCount < min){newCount = min}
        if(newCount > max){newCount = max}
        changeCart({product,variantId,count:newCount})
    }
    function button_layout(dir:number,config?:any):I_RVD_node{
        let {disabled,del} = (config || {});
        let path:any,size:number;
        if(del){path = mdiDelete; size=0.6;} else {path = dir > 0?mdiPlus:mdiMinus; size=0.8;}
        let html:React.ReactNode = <Icon path={path} size={size}/>
        let className = `of-visible ${dir > 0?cls['cb-plus']:cls['cb-minus']}`;
        if(disabled){className += ` ${cls['cb-disabled']}`}
        return {html,align:'vh',className,onClick:disabled?undefined:()=>del?changeCart({product,variantId,count:0}):changeStep(dir)}
    }
    function body_layout():I_RVD_node{return {className:cls['cb-body'],row:[button_layout(step,{disabled:count >= max}),count_layout(),button_layout(-step,{del:count === Math.max(min,1)})]}}
    function footer_layout():I_RVD_node{
        let showMin = min > 0,showMax = max !== Infinity,showStep = step > 1;
        if(!showMin && !showMax && !showStep){return false}
        return {
            className:cls['cb-footer'],align:'v',
            row:[
                {align:'v',show:showMin,className:cls['cb-min'],row:[{html:<Icon path={mdiArrowDown} size={0.5}/>},{html:min}]},
                {align:'v',show:showMax,className:cls['cb-max'],row:[{html:<Icon path={mdiArrowUp} size={0.5}/>},{html:max}]},
                {align:'v',show:showStep,className:cls['cb-step'],row:[{html:<Icon path={mdiPlusMinus} size={0.5}/>},{html:step}]}
            ]
        }
    }
    function getCartInfo(){
        let {min = 0,max = Infinity,step = 1,inStock} = variant.cartInfo;
        if(inStock === true){inStock = Infinity}
        else if(inStock === false){inStock = 0;}
        if(min > inStock){min = inStock}
        if(max > inStock){max = inStock}
        return {min,max,step}
    }
    let [variant] = useState<I_v>(product.variants.find((o:I_v)=>o.id === variantId));
    let {min,max,step} = getCartInfo();
    if(!max){return <RVD layout={notExist_layout()}/>}
    if(readonly){return !count?null:<RVD layout={{className:`${cls['cb']} ${cls['cb-readonly']}`,align:'v',row:[icon_layout(),count_layout({width:'fit-content',padding:'0 3px',fontSize:14})]}}/>}
    if(!count){return <RVD layout={{className:`${cls['cb']}`,html:<button className={cls['cb-add']} onClick={()=>changeStep(step)}>{trans.addToCart}</button>}}/>}
    return (<RVD layout={{className:`${cls['cb']}`,column:[body_layout(),footer_layout()]}}/>)
})
const ProductCard = observer((props:I_ProductCard) => {
    let {product,type,title,variantId,getContext,cartButton = false} = props,context = getContext(),{cls,unit} = context;
    let {name,images} = product;
    let [imageContent,setImageContent] = useState<React.ReactNode>()
    let [content,setContent] = useState<React.ReactNode>()
    async function getImageContent(){
        if(typeof context.productCardImageContent !== 'function'){return}
        setImageContent(await context.productCardImageContent(product,props.variantId))
    }
    async function getContent(){
        if(typeof context.productCardContent !== 'function'){return}
        setContent(await context.productCardContent(product,props.variantId))
    }
    useEffect(()=>{getImageContent(); getContent();},[])
    let image = images[0];
    let className = `${cls['pc']} ${cls[`pc-${type}`]}`;
    function image_layout():I_RVD_node{
        let size = {v:84,h:72,hs:48}[type];
        let sizeKey = {v:'height',h:'width',hs:'width'}[type];
        if(!imageContent || imageContent === null){imageContent = false}
        return {
            size,align:'vh',className:cls['pc-image'],
            html:(<>
                <img src={image} alt='' {...{[sizeKey]:'100%'}}/>
                {imageContent === false?null:<div className={cls['pc-image-content']}>{imageContent}</div>}
            </>)
        }
    }
    function title_layout():I_RVD_node{return typeof title !== 'string'?false:{html:title,className:cls['pc-title'],align:'v'}}
    function name_layout():I_RVD_node{return {html:name,className:cls['pc-name']}}
    function description_layout():I_RVD_node{
        if(!variantId){return false}
        let props:I_VariantLabels = {product,variantId,getContext,type:type === 'hs'?'h':'v'}
        return {html:<VariantLabels {...props}/>}
    }
    function content_layout():I_RVD_node{return !content || type === 'hs'?false:{html:content,className:cls['pc-content']}}
    function discount_layout():I_RVD_node{
        let props:I_DiscountPercent = {product,variantId,getContext}
        return {className:cls['pc-discount-layout'],row:[{flex:1},{html:<DiscountPercent {...props}/>}]}
    }
    function finalPrice_layout():I_RVD_node{
        let props:I_FinalPrice = {product,variantId,getContext}
        return {className:cls['pc-finalPrice_layout'],row:[{flex:1},{html:<FinalPrice {...props}/>}]}
    }
    function variants_layout():I_RVD_node{
        if(cartButton === false){return false}
        let cvs:I_cart_variant[] = context.getCartVariants(product.id)
        return !cvs.length?false:{className:cls['pc-variants'],column:cvs.map((cv:I_cart_variant)=>variant_layout(cv))} 
    }
    function variant_layout(cv:I_cart_variant):I_RVD_node{return {align:'v',className:cls['pc-variant'],row:[variantDetails_layout(cv),cartButton_layout(cv)]}}
    function variantDetails_layout(cv:I_cart_variant):I_RVD_node{
        let props:I_VariantLabels = {type:'h',product,variantId:cv.id,getContext};
        let fpProps:I_FinalPrice = {getContext,product,variantId:cv.id}
        let dpProps:I_DiscountPercent = {getContext,product,variantId:cv.id,showPrice:false}
        return {
            flex:1,
            column:[
                {flex:1,html:<VariantLabels {...props}/>},
                {
                    gap:6,style:{fontSize:10},align:'v',
                    row:[
                        {html:<DiscountPercent {...dpProps}/>},
                        {html:<FinalPrice {...fpProps}/>},
                        {html:`(جمع ${SplitNumber(cv.count * cv.finalPrice)} ${unit})`,className:'fs-9'}
                    ]
                }
            ]
        }
    }
    function cartButton_layout(cv:I_cart_variant):I_RVD_node{
        let props:I_CartButton = {product,variantId:cv.id,readonly:cartButton === 'readonly',getContext}
        return {align:'vh',html:<CartButton {...props}/>}
    }
    function click(){
        const render = ()=>{
            let props:I_ProductPage = {getContext,product,variantId}
            return <ProductPage {...props}/>
        }
        context.openModal({title:'جزییات',render})
    }
    function v_layout():I_RVD_node{
        let column = [title_layout(),image_layout(),body_layout_v()]
        return {className,onClick:()=>click(),column}
    }
    function body_layout_v():I_RVD_node{
        return {className:cls['pc-body'],align:'v',flex:1,column:[name_layout(),description_layout(),content_layout(),{flex:1},productAmounts_layout()]}
    }
    function body_layout_h():I_RVD_node{
        return {className:cls['pc-body'],align:'v',flex:1,column:[name_layout(),description_layout(),content_layout(),{flex:1},productAmounts_layout()]}
    }
    function body_layout_hs():I_RVD_node{
        return {className:cls['pc-body'],align:'v',flex:1,column:[name_layout(),description_layout(),productAmounts_layout()]}
    }
    function productAmounts_layout(){
        if(cartButton){return false}
        if(type === 'v'){return {column:[discount_layout(),finalPrice_layout()]}}
        if(type === 'h'){return {column:[discount_layout(),finalPrice_layout()]}}
        if(type === 'hs'){return {gap:6,row:[finalPrice_layout(),{flex:1},discount_layout()]}}
        return false
    }
    function h_layout():I_RVD_node{
        let body;
        if(type === 'h'){body = body_layout_h()}
        else if(type === 'hs'){body = body_layout_hs()}
        return {
            className,onClick:()=>click(),
            column:[
                {row:[image_layout(),{flex:1,column:[title_layout(),body]}]},
                variants_layout()
            ]
        }
    }
    return (<RVD layout={type === 'v'?v_layout():h_layout()}/>)
})
function DiscountPercent(props:I_DiscountPercent){
    let {product,getContext,showPrice} = props,context = getContext(),{cls} = context;
    let [variant] = useState<I_v>(getVariant())
    let [items] = useState<I_discountPercent[]>(getItems(variant))
    function getVariant(){
        let variantId = props.variantId?props.variantId:product.defaultVariantId;
        return product.variants.find((o:I_v)=>o.id === variantId); 
    }
    function getItems(variant:I_v){return (variant.discountPercent || []).filter((o:I_discountPercent)=>!!o.value)}
    function percents_layout():I_RVD_node{return {align:'v',row:items.map((item)=>percent_layout(item)),className:cls['dps']}}
    function percent_layout(item:I_discountPercent):I_RVD_node{
        return {html:`${item.value}%`,className:cls['dp'],attrs:item.attrs,onClick:(e)=>{
            e.stopPropagation();
            context.openModal({
                position:'center',backdrop:{attrs:{style:{backdropFilter:'blur(3px)'}}},
                render:()=><DiscountPercentModal item={item} context={context}/>
            })
        }}
    }
    function price_layout():I_RVD_node{return showPrice === false?false:{className:cls['price'],html:SplitNumber(variant.price)}}
    return !items.length?null:<RVD layout={{align:'v',className:cls['dr'],row:[{flex:1},price_layout(),percents_layout()]}}/>
}
type I_DiscountPercentModal = {context?:I_AIOShop_context,item:I_discountPercent}
function DiscountPercentModal(props:I_DiscountPercentModal){
    let {item,context} = props;
    let {cls} = context;
    return (
        <RVD
            layout={{
                className:cls['dp-modal'],align:'v',
                row:[
                    {html:item.text,className:cls['dp-modal-text']},
                    {row:[{flex:1},{html:`${item.value}%`,className:cls['dp'],attrs:item.attrs}]}
                ]
            }}
        />
    )
}
function FinalPrice(props:I_FinalPrice){
    let {getContext,product} = props,context = getContext();
    let {cls,unit} = context
    function price_layout():I_RVD_node{
        let variantId = props.variantId || product.defaultVariantId;
        let variant = product.variants.find((o:I_v)=>o.id === variantId);
        let {price,discountPercent:dps = []} = variant;
        let dp = 0;
        for(let i = 0; i < dps.length; i++){dp += dps[i].value}
        let finalPrice = Math.round(price - (price * dp / 100))
        return {html:SplitNumber(finalPrice),className:cls['fp']}
    }
    function unit_layout():I_RVD_node{return {html:unit,className:cls['unit']}}
    return (<RVD layout={{className:'gap-3',align:'v',row:[price_layout(),unit_layout()]}}/>)
}
function VariantLabels(props:I_VariantLabels){
    let {product,variantId,getContext,type} = props,context = getContext();
    let {cls,getVariantIcon = ()=>false,getOptionTypes} = context;
    let [items] = useState<I_v_label[]>(getItems())
    function getItems(){
        let variant = product.variants.find((o:I_v)=>o.id === variantId);
        let res:I_v_label[] = [];
        let optionTypes = getOptionTypes(product.variants);
        let {optionValues} = variant;
        for(let i = 0; i < optionValues.length; i++){
            let {optionType,optionValue}:I_v_ov = optionValues[i];
            let {name:optionTypeName,values}:I_pr_optionType = optionTypes.find((o:I_pr_optionType)=>o.id === optionType.id);
            let {name:optionValueName} = values.find((o)=>o.id === optionValue.id)
            let item:I_v_label = [optionTypeName,optionValueName]
            res.push(item)
        }
        return res
    }
    function row_layout(vl:I_v_label):I_RVD_node{
        return {
            className:cls['vl-row'],row:[type === 'h'?false:bullet_layout(),icon_layout(vl),key_layout(vl),{html:':',align:'vh'},value_layout(vl)]
        }
    }
    function key_layout(vl:I_v_label):I_RVD_node{return {html:vl[0],className:cls['vl-row-key'],align:'v'}}
    function value_layout(vl:I_v_label):I_RVD_node{return {html:vl[1],className:cls['vl-row-value'],align:'v'}}
    function icon_layout(vl:I_v_label):I_RVD_node{
        let icon = getVariantIcon(vl);
        return !icon?false:{html:icon,align:'vh',className:cls['vl-icon']}
    }
    function bullet_layout():I_RVD_node{return {html:<div className={cls['vl-bullet']}></div>,align:'vh'}}
    function h_layout(){
        return {
            className:`${cls['vl-rows']} ${cls[`vl-rows-${type}`]} p-0`,gap:3,
            row:[
                bullet_layout(),
                {align:'v',row:items.map((item:I_v_label)=>row_layout(item)),gap:8,gapHtml:()=>'-',gapAttrs:{className:'align-vh'}}
            ]
        }
    }
    function v_layout(){
        return {
            className:`${cls['vl-rows']} ${cls[`vl-rows-${type}`]}`,
            column:[items.map((item:I_v_label)=>row_layout(item))]
        }
    }
    return (<RVD layout={type === 'h'?h_layout():v_layout()}/>)
}