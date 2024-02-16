import { I_pr } from "../../npm/aio-shop/types"

let products:I_pr[] = [
    {
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
]
export default products