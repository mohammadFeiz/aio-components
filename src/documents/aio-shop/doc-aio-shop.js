import React, { Component,useState } from 'react';
import DOC from '../../resuse-components/doc';
import AIODoc from '../../npm/aio-documentation/aio-documentation';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import products from './products';
import AIOShop from './../../npm/aio-shop/aio-shop';
export default class DOC_AIOShop extends Component {
    render() {
        return (
            <DOC
                {...this.props}
                nav={{
                    items:[
                        { text: 'Create Shop', id: 'createshop', render: () => <CreateShop /> }
                    ]
                }}
            />
        )
    }
}
function CreateShop() {
    //use useState To create instance only once
    let [Shop] = useState(
        new AIOShop({
            id: 'mytest',unit: 'تومان',addToCartText: 'سفارش', cartCache: true,
            getShippingOptions,getDiscounts,getExtras,checkDiscountCode,payment
        })
    )
    function getShippingOptions(){
        return [
            {
                type:'radio',title:'نوع پرداخت',field:'paymentType',value:'online',
                options:[
                    {text:'آنلاین',value:'online'},
                    {text:'درب منزل',value:'delivery'}
                ]
            },
            {
                type: 'radio',title: 'زمان ارسال', field: 'deliveryTime', value: '0',
                options:[
                    {text:'شنبه ساعت 12',value:'0'},
                    {text:'یکشنبه ساعت 18',value:'1'},
                    {text:'دو شنبه ساعت 12',value:'2'},
                    {text:'سه شنبه ساعت 18',value:'3'},
                    {text:'چهار شنبه ساعت 12',value:'4'},
                    {text:'پنج شنبه ساعت 18',value:'5'},
                ]
            }
        ]
    }
    function getDiscounts(){
        let { shipping } = Shop;
        let discounts = [];
        if (shipping.paymentType === 'delivery') {
            discounts.push({title: 'پرداخت پس از تحویل',discountPercent: 85})
        }
        return discounts
    }
    function getExtras(){
        let { shipping } = Shop;
        let { deliveryTime } = shipping;
        let plus = {'0': 15000,'1': 12000,'2': 9000,'3': 6000,'4': 3000,'5': 0}[deliveryTime] || 0;
        return [{ title: 'هزینه ارسال', amount: 50000 + plus }]
    }
    function checkDiscountCode(){
        return 'کد معتبر نیست'
    }
    function payment(){

    }
    function preview() {
        return (
            <div className='example'>
                <div className='my-shop'>
                    <div className='my-product-list'>
                        {Shop.renderList({
                            products:products.map((o)=>{
                                return {product:o,addToCart:true}
                            })
                        })}
                    </div>
                    <div className='my-cart'>
                        {Shop.renderCart()}
                    </div>
                    <div className='my-checkout'>
                        {Shop.renderShipping()}
                    </div>    
                </div>
                {
                    AIODoc().Code(`

                    `)
                }
                <div style={{marginTop:24}} className='aio-component-splitter'></div>
            </div>
        )
    }
    return (<Example preview={() => preview()}/>)
}



class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'preview',
            tabs: [
                { text: 'Preview', value: 'preview' },
                { text: 'Code', value: 'code' }
            ]
        }
    }
    body_layout() {
        let { tab } = this.state;
        return tab === 'preview' ? this.preview_layout() : this.code_layout()
    }
    preview_layout() {
        let { preview } = this.props;
        return {
            flex: 1,
            className: 'p-12',
            html: preview()
        }
    }
    code_layout() {
        let { code, rtl = false } = this.props;
        return {
            flex: 1,
            html: (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'auto' }}>
                    <pre style={{ padding: 12 }}>{AIODoc().Code(code())}</pre>
                </div>
            )
        }
    }
    toolbar_layout() {
        let { toolbar } = this.props;
        if (!toolbar) { return false }
        return {
            html: toolbar()
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    column: [
                        this.toolbar_layout(),
                        this.body_layout()
                    ]
                }}
            />
        )
    }
}




