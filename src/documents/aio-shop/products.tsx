import { I_pr } from "../../npm/aio-shop/types"

let products:I_pr[] = [
    {
        hasVariant:true,id:'123432',rate:3.6,name:'تیشرت مردانه پوما',
        rates:[['قیمت',4],['دوام',3],['زیبایی',4],['دوخت',2]],
        images:['https://dkstatics-public.digikala.com/digikala-products/117515968.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80'],
        description:'تیشرت مردانه پوما تهیه شده از بهتری نوع نخ یکی از محصولات جدید شرکت میباشد که سالها به عنوان یکی از محصولات پر فروش در دسته پوشاک آقایان قرار دارد. خاصیت حفظ رنگ و عدم پرز دهی از ویژگی های منحصر به فرد این محصول می باشد.',
        details:[['جنس','نخی'],['یقه','گرد'],['آستین','کوتاه']],
        defaultVariantId: '165',
        variants: [
            {
                id: '165',
                cartInfo:{
                    inStock: 25, max: 10, min: 5, step: 5,price:280000,
                    discountPercent: [{text:'تخفیف شب یلدا',value:12}]
                },
                optionValues:[
                    {typeName:'رنگ',typeId:'color',valueName:'سفید',valueId:'white'},
                    {typeName:'سایز',typeId:'size',valueName:'S',valueId:'s'}
                ]
            },
            {
                id: '166', 
                cartInfo:{inStock: 12,price:295000}, 
                optionValues:[
                    {typeName:'رنگ',typeId:'color',valueName:'سفید',valueId:'white'},
                    {typeName:'سایز',typeId:'size',valueName:'M',valueId:'m'},
                ]
            },
            { 
                id: '167', 
                cartInfo:{
                    inStock: 1,max:2,price:280000,
                    discountPercent: [{text:'تخفیف شب یلدا',value:15}]
                },
                optionValues:[
                    {typeName:'رنگ',typeId:'color',valueName:'خاکستری',valueId:'grey'},
                    {typeName:'سایز',typeId:'size',valueName:'L',valueId:'l'}
                ]
            }
        ]
    },
    {
        hasVariant:false,id:'123432',rate:3.6,name:'تیشرت مردانه پوما',
        rates:[['قیمت',4],['دوام',3],['زیبایی',4],['دوخت',2]],
        images:['https://dkstatics-public.digikala.com/digikala-products/117515968.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80'],
        description:'تیشرت مردانه پوما تهیه شده از بهتری نوع نخ یکی از محصولات جدید شرکت میباشد که سالها به عنوان یکی از محصولات پر فروش در دسته پوشاک آقایان قرار دارد. خاصیت حفظ رنگ و عدم پرز دهی از ویژگی های منحصر به فرد این محصول می باشد.',
        details:[['جنس','نخی'],['یقه','گرد'],['آستین','کوتاه']],
        cartInfo:{
            inStock: 25, max: 10, min: 5, step: 5,price:280000,
            discountPercent: [{text:'تخفیف شب یلدا',value:12}]
        }
    }
]
export default products