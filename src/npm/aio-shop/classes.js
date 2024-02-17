const classes = {
    'dr':'aio-shop-discount-row',//discount percent row
    'dps':'aio-shop-discount-percents',//discount percent row => discount boxes
    'dp':`aio-shop-discount-percent`,//discount percent row => discount boxes => discount box
    'dp-modal':'aio-shop-discount-percent-modal',//
    'dp-modal-text':'aio-shop-discount-percent-modal-text',//
    'unit':'aio-shop-unit',//unit
    'pc':'aio-shop-product-card',//product card
    'pc-v':'aio-shop-product-card-v',//product card vertical
    'pc-h':'aio-shop-product-card-h',//product card horizontal
    'pc-hs':'aio-shop-product-card-hs',//product card horizontal small
    'pc-body':'aio-shop-product-card-body',//
    'pc-image':'aio-shop-product-card-image',//product card => product card image
    'pc-image-content':'aio-shop-product-card-image-content',//product card => product card image => product card image content
    'pc-title':'aio-shop-product-card-title',//product card title
    'pc-name':'aio-shop-product-card-name',//product card => product card name
    'pc-desc':'aio-shop-product-card-description',//product card => description
    'pc-discount-layout':'aio-shop-product-card-discount-layout',//
    'pc-finalPrice_layout':'aio-shop-product-card-final-price_layout',//
    'price':'aio-shop-price',
    'pc-variants':'aio-shop-product-card-variants',//
    'pc-variant':'aio-shop-product-card-variant',//
    'pc-content':'aio-shop-product-card-content',//product card info
    'fp':'aio-shop-final-price',//final price
    'vl-rows':'aio-shop-variant-label-rows',//variant label rows
    'vl-row':'aio-shop-variant-label-row',//variant label row
    'vl-bullet':'aio-shop-variant-label-row-bullet',//variant label row bullet
    'vl-row-key':'aio-shop-variant-label-row-key',//variant label row key',
    'vl-row-value':'aio-shop-variant-label-row-value',//variant label row value',
    'vl-icon':'aio-shop-variant-label-icon',//'variant label icon'
    'vl-rows-h':'aio-shop-variant-label-rows-h',//variant label rows horizontal
    'vl-rows-v':'aio-shop-variant-label-rows-v',//variant label rows vertical
    'cb':'aio-shop-cart-button',//
    'cb-readonly':'aio-shop-cart-button-readonly',//
    'cb-icon':'aio-shop-cart-button-icon',//
    'cb-count':'aio-shop-cart-button-count',//
    'cb-step':'aio-shop-cart-button-step',//
    'cb-plus':'aio-shop-cart-button-plus',//
    'cb-minus':'aio-shop-cart-button-minus',//
    'cb-add':'aio-shop-cart-button-add',//
    'cb-not-exist':'as-cart-button-not-exist',//
    'cb-disabled':'aio-shop-cart-button-disabled',//
    'cb-min':'aio-shop-cart-button-min',//
    'cb-max':'aio-shop-cart-button-max',//
    'cb-body':'aio-shop-cart-button-body',//
    'cb-footer':'aio-shop-cart-button-footer',//
    'cart':'aio-shop-cart',//
    'cart-factor':'aio-shop-cart-factor',//
    'cart-body':'aio-shop-cart-body',//
    'cart-footer':'aio-shop-cart-footer',//
    'cart-products':'aio-shop-cart-products',//
    'pp':'aio-shop-product-page',//
    'pp-body':'aio-shop-product-page-body',//
    'pp-footer':'aio-shop-product-page-footer',//
    'pp-not-exist':'aio-shop-product-page-not-exist',//
    'pp-label-row':'aio-show-product-page-label-row',//
    'pp-show-more':'aio-shopw-product-page-show-more',//
    'pp-desc':'aio-shop-product-page-description',//
    'pp-desc-text':'aio-shop-product-page-description-text',//
    'pp-rates':'aio-shop-product-page-rates',//
    'rate-items':'aio-shop-product-page-rate-items',//
    'rate-item':'aio-shop-rate-item',//
    'rate-item-text':'aio-shop-rate-item-text',//
    'rate-item-value':'aio-shop-rate-item-value',//
    'rate-item-slider':'aio-shop-rate-item-slider',//
    'pp-image_layout':'aio-shop-product-page-image-layout',//
    'pp-box':'aio-shop-product-page-box',//
    'pp-image-arrow':'aio-shop-product-page-image-arrow',//
    'pp-image-arrow-up':'aio-shop-product-page-image-arrow-up',//
    'pp-image-arrow-down':'aio-shop-product-page-image-arrow-down',//
    'pp-image-content':'aio-shop-product-page-image-content',//
    'pp-name':'aio-shop-product-page-name',//
    'pp-optionTypes':'aio-shop-product-page-option-types',//
    'pp-optionType':'aio-shop-product-page-option-type',//
    'pp-optionValue-buttons':'aio-shop-product-page-option-value-buttons',//
    'pp-optionValue-button':'aio-shop-product-page-option-value-button',//
    'pp-label':'aio-shop-product-page-label',//
    'pp-details':'aio-shop-product-page-details',//
    'pp-detail':'aio-shop-product-page-detail',//
    'pp-detail-bullet':'aio-shop-product-page-detail-bullet',//
    'pp-detail-key':'aio-shop-product-page-detail-key',//
    'pp-detail-value':'aio-shop-product-page-detail-value',//
    'pp-content':'aio-shop-product-page-content',//
    'ps':'aio-shop-product-slider',//
    'ps-body':'aio-shop-product-slider-body',//
    'ps-header':'aio-shop-product-slider-header',//
    'ps-products':'aio-shop-product-slider-products',//
    'ps-product':'aio-shop-product-slider-product',//
    'ps-before':'aio-shop-product-slider-before',//
    'ps-after':'aio-shop-product-slider-after',//
    'ps-title':'aio-shop-product-slider-title',//
    'ps-action':'aio-shop-product-slider-action',//
    'factor':'aio-shop-factor',//
    'factor-total':'aio-shop-factor-total',//
    'factor-products-discount':'aio-shop-factor-products-discount',//
    'factor-discount':'aio-shop-factor-discount',//
    'factor-extra':'aio-shop-factor-extra',//
    'factor-key':'aio-shop-factor-key',//
    'factor-value':'aio-shop-factor-value',//
    'factor-unit':'aio-shop-factor-unit',//
    'factor-plus':'aio-shop-factor-plus',//
    'factor-minus':'aio-shop-factor-minus',//
    'factor-max-discount':'aio-shop-factor-max-discount',//
    'factor-couninue':'aio-shop-factor-continue',//
    'factor-payment':'aio-shop-factor-payment',//
    'factor-payment-text':'aio-shop-factor-payment-text',//
    'factor-payment-value':'aio-shop-factor-payment-value',//
    'factor-payment-unit':'aio-shop-factor-payment-unit',//
    'factor-discount-code':'aio-shop-factor-discount-code',//
    'factor-discount-code-error':'aio-shop-factor-discount-code-error',//
}
export default classes;