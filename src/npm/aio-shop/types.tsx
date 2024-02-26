export type I_pr = {
    hasVariant:boolean,
    cartInfo?:I_cartInfo,
    images:string[],
    props?:any,
    id:any,
    name:string,
    details?:I_pr_detail[],
    description?:string,
    defaultVariantId?:any,
    rate?:number,
    rates?:I_pr_rate[],
    variants?:I_v[]
}
export type I_pr_optionType = {id:any,name:string,values:{name:string,id:any}[]}
export type I_pr_rate = (string | number)[];
export type I_pr_detail = string[];
export type I_v = {id:any,cartInfo:I_cartInfo,optionValues:I_v_ov[]}
export type I_v_ov = {typeId:any,valueId:any,typeName:string,valueName:string}
export type I_discountPercent = {value:number,text:string,attrs?:any}
export type I_cartInfo = {inStock:number | boolean,min?:number,max?:number,step?:number,price:number,discountPercent?:I_discountPercent[]}



export type I_ProductCard_type = 'h' | 'v' | 'hs'
export type I_ProductCard_cartButton = boolean | 'readonly';




export type I_action = {text:string,onClick:()=>void}
export type I_discount = { discountPercent?: number; maxDiscount?: number; title: string; }
export type I_extra = { title: string, amount: number }
export type I_productPageImageContent = (product:I_pr,variantId?:any)=>Promise<React.ReactNode>;
export type I_productCardImageContent = (product:I_pr,variantId?:any)=>Promise<React.ReactNode>;
export type I_ProductCard_content = (product:I_pr,variantId?:any)=>Promise<React.ReactNode>;
export type I_ProductPage_content = (product:I_pr,variantId?:any)=>Promise<React.ReactNode>;
export type I_cart_content = (cart:I_cart)=>Promise<React.ReactNode>;
export type I_checkout_content = (context:I_AIOShop_context)=>Promise<React.ReactNode>;
export type I_getDiscounts = (p:{renderIn:'cart' | 'checkout',checkout:any,cart:I_cart})=>Promise<I_discount[]>
export type I_getExtras = (p:{renderIn:'cart' | 'checkout',checkout:any,cart:I_cart})=>Promise<I_extra[]>
export type I_getFinalPrice = (cartInfo:I_cartInfo)=>number;
export type I_getCartInfo = (product:I_pr,variantId?:any) => I_cartInfo;
export type I_trans = {addToCart:string,notExist:string};
export type I_getOptionTypes = (variants:I_v[])=>I_pr_optionType[];
export type I_onPayment = (p:{factor:I_Factor_details,checkout:I_checkout})=>Promise<boolean>
export type I_AIOShop_context = {
    unit:string,cart:I_cart,
    cls:{[key:string]:string},
    getVariantIcon?:I_getVariantIcon,
    getCartInfo:I_getCartInfo,
    changeCart:I_changeCart,
    getCartCount:I_getCartCount,
    getCartVariants:I_getCartVariants,
    getVariantByOptionValues:I_getVariantByOptionValues,
    productPageImageContent:I_productPageImageContent,
    productCardImageContent:I_productCardImageContent,
    productCardContent:I_ProductCard_content,
    productPageContent:I_ProductPage_content,
    cartContent:I_cart_content,
    checkoutContent:I_checkout_content,
    getDiscounts:I_getDiscounts,
    getExtras:I_getExtras,
    openModal:I_openModal,
    closeModal:I_closeModal,
    checkout:I_checkout,
    getCheckoutItems:I_getCheckoutItems,
    setCheckout:I_setCheckout,
    checkDiscountCode:I_checkDiscountCode,
    getOptionTypes:I_getOptionTypes,
    getFinalPrice:I_getFinalPrice,
    trans:I_trans,
    onPayment:I_onPayment
}
export type I_getVariantIcon = (p:[key:string,value:string])=>React.ReactNode;
export type I_changeCart = (p:{product:I_pr,variantId?:any,count:number})=>void;
export type I_addProductToCart = (p:{product:I_pr,variantId:any,count:number})=>I_cart;
export type I_addVariantToCart = (p:{product:I_pr,variantId:any,count:number})=>I_cart;
export type I_getNewCartVariant = (p:{product:I_pr,variantId:any,count:number})=>I_cart_variant;
export type I_removeVariantFromCart = (p:{product:I_pr,variantId:any,count:number})=>I_cart;
export type I_changeCartCount = (p:{cartProduct:I_cart_product,cartVariant?:I_cart_variant,count:number})=>I_cart;
export type I_getCartCount = (product:I_pr,variantId?:any)=>number;
export type I_getCartVariants = (productId:any)=>I_cart_variant[];
export type I_getVariantByOptionValues = (product:I_pr,optionValues:I_v_ov[])=>I_v;
export type I_openModal = (p:{
    position?:'fullscreen' | 'center' | 'left' | 'right' | 'top' | 'bottom',
    title?:string,backdrop?:any,
    id:string,
    render:()=>React.ReactNode
})=>void;
export type I_closeModal = (id?:string)=>void;
export type I_checkout_option = { text: string, value: any,icon?:React.ReactNode };
export type I_checkout_item = I_checkout_radio | I_checkout_html;
export type I_checkout_html = {
    type:'html',title: string,subtitle?: string,field: string,value: any,html:(value:any,change:(newValue:any)=>void) => React.ReactNode,
    show?:(context:I_AIOShop_context)=>boolean
}
export type I_checkout_radio = {
    type:'radio',title: string,subtitle?: string,field: string,value: any,options: I_checkout_option[],multiple?:boolean,
    show?:(context:I_AIOShop_context)=>boolean
}
export type I_checkout = {[key:string]:any}
export type I_getCheckoutItems = (context:I_AIOShop_context)=>I_checkout_item[];
export type I_setCheckout = (checkout:I_checkout)=>void;
export type I_checkDiscountCode = (discountCode:string,context:I_AIOShop_context)=>Promise<I_discount | string>
export type I_AIOShop_props = {
    unit:string,shopId:any,
    getVariantIcon?:I_getVariantIcon,
    productPageImageContent?:I_productPageImageContent,
    productCardImageContent?:I_productCardImageContent,
    productCardContent?:I_ProductCard_content,
    productPageContent?:I_ProductPage_content,
    cartContent?:I_cart_content,
    checkoutContent?:I_checkout_content,
    getDiscounts?:I_getDiscounts,
    getExtras?:I_getExtras,
    getCheckoutItems?:I_getCheckoutItems,
    checkDiscountCode?:I_checkDiscountCode,
    onPayment:I_onPayment,
    trans:I_trans,
    cart?:'cache' | I_cart
}
export type I_AIOShop = {
    unit:string;
    cart:I_cart;
    shopId:any;
    checkout:I_checkout;
    setCheckout:I_setCheckout;
    renderProductCard:I_renderProductCard;
    renderProductPage:I_renderProductPage;
    renderProductSlider:I_renderProductSlider;
    renderCart:I_renderCart;
    renderCheckout:I_renderCheckout;
    renderCartButton:I_renderCartButton;
    renderPopup:I_renderPopup;
    changeCart:I_changeCart;
    setCart:(newCart:I_cart)=>void;
    getDiscountPercent:(discountPercent:I_discountPercent[])=>number;
    getCartCount:I_getCartCount;
    getCartVariants:I_getCartVariants;
    getCartLength:I_getCartLength;
    openModal:I_openModal;
    
}
export type I_getCartLength = ()=>number;
export type I_cart_variant = {id:any,count:number};
export type I_cart_product = I_cart_product_hasVariant | I_cart_product_hasNotVariant;
export type I_cart_product_hasVariant = {product:I_pr,variants:I_cart_variant[]};
export type I_cart_product_hasNotVariant = {product:I_pr,count:number};
export type I_cart = I_cart_product[];
//////rvd
export type I_Factor_details = {
    totalDiscount:number,
    total:number,payment:number,productsDiscount:number,
    discounts:{discount:I_discount,amount:number}[],
    discountCode?:{discount:I_discount,amount:number},
    extras:I_extra[]
}
export type I_v_label = [key:string,value:string]

/////////////////////////render function /////////////////////
export type I_renderProductCard = (p:I_ProductCard)=>React.ReactNode;
export type I_renderProductPage = (p:I_ProductPage)=>React.ReactNode;
export type I_renderProductSlider = (p:I_ProductSlider)=>React.ReactNode;
export type I_renderCart = (P?:I_Cart)=>React.ReactNode;
export type I_renderCheckout = ()=>React.ReactNode;
export type I_renderCartButton = (p:I_CartButton)=>React.ReactNode;
export type I_renderRates = (P:I_Rates)=>React.ReactNode;
export type I_renderPopup = ()=>React.ReactNode;
/////////////////////////render function /////////////////////
/////////////////////////components///////////////////////////
export type I_Cart = {getContext?:()=>I_AIOShop_context}
export type I_CartButton = {product:I_pr,variantId?:any,getContext?:()=>I_AIOShop_context,readonly:boolean}
export type I_ProductSlider = {
    getContext?:()=>I_AIOShop_context,
    before?:()=>React.ReactNode,
    after?:()=>React.ReactNode,
    title?:string,
    action?:I_action,
    products:I_pr[],
    icon?:()=>React.ReactNode,
    cartButton:I_ProductCard_cartButton
}
export type I_ProductPage = {
    product:I_pr,variantId?:any,variantIds?:any[],getContext?:()=>I_AIOShop_context,
    content?:(product:I_pr,variantId?:any)=>React.ReactNode
}
export type I_ProductCard = {
    product:I_pr,
    variantId?:any,
    type:I_ProductCard_type,
    cartButton?:I_ProductCard_cartButton,
    attrs?:any,
    title?:string,
    getContext?:()=>I_AIOShop_context 
}
export type I_Checkout = {getContext?:()=>I_AIOShop_context}
export type I_Factor = {renderIn:'cart' | 'checkout',getContext?:()=>I_AIOShop_context,mode:'details' | 'payment'}
export type I_DiscountPercent = {product:I_pr,variantId?:any,getContext?:()=>I_AIOShop_context,showPrice?:boolean}
export type I_FinalPrice = {product:I_pr,variantId?:any,getContext?:()=>I_AIOShop_context}
export type I_VariantLabels = {product:I_pr,variantId,getContext?:()=>I_AIOShop_context,type:'h' | 'v'}
export type I_Rates = {getContext?:()=>I_AIOShop_context,rates:I_pr_rate[]}
///////////////////////components/////////////////////////////