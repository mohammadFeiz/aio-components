"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
//import AIOShopBackOffice from './back-office';
var aio_storage_1 = require("./../../npm/aio-storage/aio-storage");
var aio_popup_1 = require("./../../npm/aio-popup/aio-popup");
var react_2 = require("@mdi/react");
var js_1 = require("@mdi/js");
var react_virtual_dom_1 = require("./../../npm/react-virtual-dom/react-virtual-dom");
var aio_input_1 = require("./../../npm/aio-input/aio-input");
var aio_utils_1 = require("./../../npm/aio-utils/aio-utils");
var mobx_1 = require("mobx");
var mobx_react_lite_1 = require("mobx-react-lite");
require("./index.css");
var AIOSHOP = /** @class */ (function () {
    function AIOSHOP(props) {
        var _this = this;
        this.shipping = {};
        this.popup = {};
        this.getCartItem = function (productId, variantId) { return _this.cart.find(function (o) { return o.product.id === productId && o.variantId === variantId; }); };
        this.getCartItems = function (productId) { return productId ? _this.cart.filter(function (o) { return o.product.id === productId; }) : _this.cart; };
        this.getCartCount = function (productId, variantId) {
            if (variantId !== undefined) {
                var cartItem = _this.getCartItem(productId, variantId);
                return cartItem ? cartItem.count : 0;
            }
            var cartItems = _this.getCartItems(productId) || [], sum = 0;
            for (var i = 0; i < cartItems.length; i++) {
                var _a = cartItems[i].count, count = _a === void 0 ? 0 : _a;
                sum += count;
            }
            return sum;
        };
        this.removeCartItem = function (productId, variantId) {
            var newCart = [];
            if (variantId) {
                newCart = _this.cart.filter(function (cartItem) { return cartItem.product.id !== productId || cartItem.variantId !== variantId; });
            }
            else {
                newCart = _this.cart.filter(function (cartItem) { return cartItem.product.id !== productId; });
            }
            _this.cart = newCart;
        };
        this.getState = function () {
            return {
                id: _this.id,
                unit: _this.unit,
                addToCartText: _this.addToCartText,
                importHTML: _this.importHTML,
                getShippingOptions: _this.getShippingOptions,
                getDiscounts: _this.getDiscounts,
                getExtras: _this.getExtras,
                cartCache: _this.cartCache,
                checkDiscountCode: _this.checkDiscountCode,
                payment: _this.payment,
                shipping: _this.shipping,
                storage: _this.storage,
                cart: _this.cart,
                factor: _this.factor,
                popup: _this.popup
            };
        };
        this.getShopProps = function () {
            return;
        };
        this.setCartCount = function (_a) {
            var product = _a.product, variantId = _a.variantId, count = _a.count;
            if (count === 0) {
                _this.removeCartItem(product.id, variantId);
            }
            else {
                var newCart = [];
                var cartItem = _this.getCartItem(product.id, variantId);
                if (!cartItem) {
                    newCart = _this.cart.concat({ product: product, variantId: variantId, count: count });
                }
                else {
                    newCart = _this.cart.map(function (o) { return o.product.id === product.id && o.variantId === variantId ? __assign(__assign({}, o), { count: count }) : o; });
                }
                _this.cart = newCart;
            }
            if (_this.cartCache) {
                if (typeof _this.cartCache === 'function') {
                    _this.cartCache('set', _this.cart);
                }
                else if (_this.storage) {
                    _this.storage.save({ name: 'cart', value: _this.cart });
                }
            }
            _this.updateFactor();
        };
        this.updateShipping = function (shipping) { return _this.shipping = shipping; };
        this.updateFactor = function () { return __awaiter(_this, void 0, void 0, function () {
            var discount, total, amount, factors, discountItems, discounts, i, _a, title, _b, discountPercent, maxDiscount, discount_1, extras, i, Amount, factor;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        discount = 0;
                        total = 0;
                        amount = 0;
                        factors = this.cart.map(function (cartItem) {
                            var _a = cartItem.count, count = _a === void 0 ? 1 : _a, product = cartItem.product, variantId = cartItem.variantId;
                            var price = _this.getProp({ product: product, variantId: variantId, prop: 'price', def: 0 });
                            var discountPercent = _this.getProp({ product: product, variantId: variantId, prop: 'discountPercent', def: 0 });
                            var sum = _this.getDiscountPercent(discountPercent);
                            var itemTotal = count * price;
                            total += itemTotal;
                            var itemDiscount = itemTotal * sum / 100;
                            discount += itemDiscount;
                            var itemAmount = itemTotal - itemDiscount;
                            amount += itemAmount;
                            return { product: product, variantId: variantId, discountPercent: sum, total: itemTotal, discount: itemDiscount, amount: itemAmount };
                        });
                        return [4 /*yield*/, this.getDiscounts(this)];
                    case 1:
                        discountItems = _c.sent();
                        discounts = [];
                        for (i = 0; i < discountItems.length; i++) {
                            _a = discountItems[i], title = _a.title, _b = _a.discountPercent, discountPercent = _b === void 0 ? 0 : _b, maxDiscount = _a.maxDiscount;
                            if (discountPercent) {
                                discount_1 = amount * discountPercent / 100;
                                amount -= discount_1;
                                if (maxDiscount !== undefined && discount_1 > maxDiscount) {
                                    discount_1 = maxDiscount;
                                }
                                discounts.push({ discountPercent: discountPercent, maxDiscount: maxDiscount, title: title });
                            }
                        }
                        return [4 /*yield*/, this.getExtras(this)];
                    case 2:
                        extras = (_c.sent()) || [];
                        for (i = 0; i < extras.length; i++) {
                            Amount = extras[i].amount;
                            amount += Amount;
                        }
                        factor = { discount: discount, discounts: discounts, total: total, amount: amount, factors: factors, extras: extras };
                        this.factor = factor;
                        return [2 /*return*/, factor];
                }
            });
        }); };
        this.getProp = function (_a) {
            var product = _a.product, variantId = _a.variantId, prop = _a.prop, def = _a.def;
            if (!product) {
                debugger;
            }
            var result;
            if (!variantId) {
                result = product[prop];
            }
            else {
                var variant = _this.getVariant(product, variantId);
                result = variant && variant[prop] !== undefined ? variant[prop] : product[prop];
            }
            if (result === undefined) {
                result = def;
            }
            return result;
        };
        this.copy = function (value) {
            return JSON.parse(JSON.stringify(value));
        };
        this.getFirstVariant = function (product, variantId) {
            var variants = product.variants, defaultVariantId = product.defaultVariantId;
            if (!variants || !variants.length) {
                return;
            }
            if (variantId) {
                var variant = _this.getVariant(product, variantId);
                if (variant) {
                    return variant;
                }
            }
            if (defaultVariantId) {
                var variant = _this.getVariant(product, defaultVariantId);
                if (variant) {
                    var _a = variant.inStock, inStock = _a === void 0 ? Infinity : _a, _b = variant.max, max = _b === void 0 ? Infinity : _b;
                    if (inStock && max) {
                        return variant;
                    }
                }
            }
            for (var i = 0; i < variants.length; i++) {
                var variant = variants[i];
                var _c = variant.inStock, inStock = _c === void 0 ? Infinity : _c, _d = variant.max, max = _d === void 0 ? Infinity : _d;
                if (inStock && max) {
                    return variant;
                }
            }
        };
        this.getExistVariantsByOptionValues = function (product, values) {
            function isMatch(key) {
                var keyList = key.split('_');
                for (var j = 0; j < values.length; j++) {
                    if (keyList[j] !== values[j]) {
                        return false;
                    }
                }
                return true;
            }
            var res = [];
            if (product.variants) {
                for (var i = 0; i < product.variants.length; i++) {
                    var variant = product.variants[i];
                    var key = variant.key;
                    if (!isMatch(key)) {
                        continue;
                    }
                    res.push(variant);
                }
            }
            return res;
        };
        this.getVariantLabel = function (product, variantId) {
            var _a = product.optionTypes, optionTypes = _a === void 0 ? [] : _a;
            var variant = _this.getVariant(product, variantId);
            if (!variant) {
                return '';
            }
            var key = variant.key;
            var variantValues = key.split('_');
            return optionTypes.map(function (optionType, i) {
                var optionValues = optionType.optionValues, name = optionType.name;
                var variantValue = variantValues[i];
                var optionValue = optionValues.find(function (o) { return o.id === variantValue; });
                return optionValue ? "".concat(name, " : ").concat(optionValue.name) : '';
            }).join(' - ');
        };
        this.getVariant = function (product, variantId) {
            var _a = product.variants, variants = _a === void 0 ? [] : _a;
            return variants.find(function (o) { return o.id === variantId; });
        };
        this.getVariantByKey = function (product, variantKey) {
            if (!product || !product.variants || variantKey === undefined) {
                return;
            }
            return product.variants.find(function (o) { return o.key === variantKey; });
        };
        this.isVariantKeyExist = function (product, variantKey) {
            var variant = _this.getVariantByKey(product, variantKey);
            if (!variant) {
                return false;
            }
            var _a = variant.inStock, inStock = _a === void 0 ? Infinity : _a, _b = variant.max, max = _b === void 0 ? Infinity : _b;
            return !!inStock && !!max;
        };
        this.renderList = function (props) {
            var products = props.products, before = props.before, after = props.after, popup = props.popup;
            if (popup) {
                var render = function () { return <div className='aio-shop-popup'>{_this.renderList({ products: products, before: before, after: after })}</div>; };
                _this.popup.addModal(__assign(__assign({}, popup), { body: __assign(__assign({}, popup.body), { render: render }) }));
            }
            else {
                return <List products={products} actions={_this.actions} getState={_this.getState.bind(_this)} before={before} after={after}/>;
            }
        };
        this.renderPopups = function () { return _this.popup.render(); };
        this.renderCartCountButton = function (_a) {
            var product = _a.product, variantId = _a.variantId, type = _a.type, addToCart = _a.addToCart;
            return <CartCountButton {...{ key: product.id + ' ' + variantId, product: product, variantId: variantId, type: type, actions: _this.actions, getState: _this.getState.bind(_this), addToCart: addToCart }}/>;
        };
        this.renderFactor = function () { return <Factor actions={_this.actions} getState={_this.getState.bind(_this)}/>; };
        this.renderPrice = function (obj) {
            var product = obj.product, variantId = obj.variantId, type = obj.type;
            return <Price actions={_this.actions} getState={_this.getState.bind(_this)} product={product} variantId={variantId} type={type}/>;
        };
        this.renderShipping = function (popup) {
            if (popup) {
                var render = function () { return _this.renderShipping(); };
                _this.popup.addModal(__assign(__assign({}, popup), { header: __assign(__assign({}, popup.header), { title: 'ثبت نهایی خرید' }), body: __assign(__assign({}, popup.body), { render: render }) }));
            }
            return <Shipping actions={_this.actions} getState={_this.getState.bind(_this)}/>;
        };
        this.renderCart = function (popup) {
            if (popup) {
                var render = function () { return <div className='aio-shop-popup'>{_this.renderCart()}</div>; };
                _this.popup.addModal(__assign(__assign({}, popup), { header: __assign({ title: 'سبد خرید' }, popup.header), body: __assign(__assign({}, popup.body), { render: render }) }));
            }
            return <Cart actions={_this.actions} getState={_this.getState.bind(_this)} onSubmit={function () { return _this.renderShipping({}); }}/>;
        };
        this.renderProductSlider = function (props) {
            var items = props.items, before = props.before, after = props.after;
            return (<Slider items={items} actions={_this.actions} getState={_this.getState.bind(_this)} before={before} after={after}/>);
        };
        this.renderCartButton = function (icon) {
            if (icon === void 0) { icon = <react_2.Icon path={js_1.mdiCart} size={1}/>; }
            var cartLength = _this.getCartItems().length;
            return (<div onClick={function () { return _this.renderCart({}); }} className='as-cart-button'>
                {typeof icon === 'function' ? icon() : icon}
                {!!cartLength && <div className='as-badge-1'>{cartLength}</div>}
            </div>);
        };
        this.renderProductCard = function (props) {
            var product = props.product, variantId = props.variantId, html = props.html, imageSize = props.imageSize, _a = props.type, type = _a === void 0 ? 'horizontal' : _a, floatHtml = props.floatHtml, addToCart = props.addToCart, onClick = props.onClick, footer = props.footer;
            if (onClick === false) {
                onClick = undefined;
            }
            else if (onClick === undefined) {
                onClick = function () { return _this.renderProductPage({ product: product, variantId: variantId, popup: { id: product.id } }); };
            }
            return (<ProductCard actions={_this.actions} getState={_this.getState.bind(_this)} key={product.id + ' ' + variantId} product={product} variantId={variantId} {...{ html: html, imageSize: imageSize, type: type, floatHtml: floatHtml, addToCart: addToCart, footer: footer }} onClick={function () { return _this.renderProductPage({ product: product, variantId: variantId, popup: { id: product.id } }); }}/>);
        };
        this.renderProductPage = function (_a) {
            var product = _a.product, variantId = _a.variantId, importHtml = _a.importHtml, popup = _a.popup;
            if (popup) {
                _this.popup.addModal(__assign({ header: __assign(__assign({}, popup.header), { title: product.name }), body: __assign(__assign({}, popup.body), { render: function () { return <div className='h-100'>{_this.renderProductPage({ product: product, variantId: variantId, importHtml: importHtml })}</div>; } }) }, popup));
            }
            else {
                return (<ProductPage actions={_this.actions} getState={_this.getState.bind(_this)} product={product} variantId={variantId} importHtml={importHtml}/>);
            }
        };
        this.renderBackOffice = function (_a) {
            var product = _a.product, category = _a.category, popup = _a.popup;
            if (popup) {
                _this.popup.addModal(__assign({ header: __assign(__assign({}, popup.header), { title: 'پنل ادمین' }), body: __assign(__assign({}, popup.body), { render: function () { return <div className='h-100'>{_this.renderBackOffice({ product: product, category: category, popup: undefined })}</div>; } }) }, popup));
            }
            else {
                return (<BackOffice product={product} category={category} actions={_this.actions} getState={_this.getState.bind(_this)}/>);
            }
        };
        this.actions = {
            renderBackOffice: this.renderBackOffice.bind(this),
            renderList: this.renderList.bind(this),
            renderCartCountButton: this.renderCartCountButton.bind(this),
            renderFactor: this.renderFactor.bind(this),
            renderPrice: this.renderPrice.bind(this),
            renderShipping: this.renderShipping.bind(this),
            renderCart: this.renderCart.bind(this),
            renderProductSlider: this.renderProductSlider.bind(this),
            renderCartButton: this.renderCartButton.bind(this),
            renderProductCard: this.renderProductCard.bind(this),
            renderProductPage: this.getCartCount.bind(this),
            getCartItem: this.getCartItem.bind(this),
            getCartItems: this.getCartItems.bind(this),
            getCartCount: this.getCartCount.bind(this),
            removeCartItem: this.removeCartItem.bind(this),
            setCartCount: this.setCartCount.bind(this),
            updateShipping: this.updateShipping.bind(this),
            updateFactor: this.updateFactor.bind(this),
            getProp: this.getProp.bind(this),
            copy: this.copy.bind(this),
            getFirstVariant: this.getFirstVariant.bind(this),
            getExistVariantsByOptionValues: this.getExistVariantsByOptionValues.bind(this),
            getVariantLabel: this.getVariantLabel.bind(this),
            getVariant: this.getVariant.bind(this),
            getVariantByKey: this.getVariantByKey.bind(this),
            isVariantKeyExist: this.isVariantKeyExist.bind(this),
            getDiscountPercent: this.getDiscountPercent.bind(this)
        };
        var id = props.id, _a = props.unit, unit = _a === void 0 ? '$' : _a, _b = props.addToCartText, addToCartText = _b === void 0 ? 'Add To Cart' : _b, _c = props.getDiscounts, getDiscounts = _c === void 0 ? function () { return []; } : _c, _d = props.getExtras, getExtras = _d === void 0 ? function () { return []; } : _d, _e = props.getShippingOptions, getShippingOptions = _e === void 0 ? function () { return []; } : _e, _f = props.cartCache, cartCache = _f === void 0 ? false : _f, checkDiscountCode = props.checkDiscountCode, payment = props.payment, importHTML = props.importHTML;
        if (id === undefined) {
            console.error('aio shop error=> missing id props');
        }
        this.id = id;
        this.importHTML = importHTML;
        this.unit = unit;
        this.addToCartText = addToCartText;
        this.getDiscounts = getDiscounts;
        this.getExtras = getExtras;
        this.getShippingOptions = getShippingOptions;
        this.cartCache = cartCache;
        this.checkDiscountCode = checkDiscountCode;
        this.payment = payment;
        this.storage = (0, aio_storage_1.default)('aioshop' + id);
        if (this.cartCache) {
            if (typeof this.cartCache === 'function') {
                this.cart = this.cartCache('get') || [];
            }
            else if (this.storage) {
                this.cart = this.storage.load({ name: 'cart', def: [] });
            }
            else {
                this.cart = [];
            }
        }
        else {
            this.cart = [];
        }
        this.factor = { total: 0, discount: 0, discounts: [], amount: 0, extras: [], factors: [] };
        this.shipping = {};
        this.popup = new aio_popup_1.default();
        (0, mobx_1.makeAutoObservable)(this);
    }
    //{ count:Number, product:Object,productId:any,variantId:any,type:'product' | 'variant' }
    AIOSHOP.prototype.getDiscountPercent = function (dp) {
        if (dp === void 0) { dp = 0; }
        function validate(v) {
            if (v === void 0) { v = 0; }
            v = +v;
            if (isNaN(v)) {
                v = 0;
            }
            return v;
        }
        ;
        var list = (!Array.isArray(dp) ? [dp] : dp);
        var sum = 0;
        for (var i = 0; i < list.length; i++) {
            sum += validate(list[i]);
        }
        return sum;
    };
    return AIOSHOP;
}());
exports.default = AIOSHOP;
var ProductCard = (0, mobx_react_lite_1.observer)(function (props) {
    var variantId = props.variantId, actions = props.actions, getState = props.getState, product = props.product, onClick = props.onClick, type = props.type, _a = props.floatHtml, floatHtml = _a === void 0 ? '' : _a, addToCart = props.addToCart, footer = props.footer, header = props.header;
    var variantLabel = (0, react_1.useState)(variantId ? actions.getVariantLabel(product, variantId) : undefined)[0];
    var description = (0, react_1.useState)(variantLabel || getProp('description'))[0];
    function getProp(prop) { return actions.getProp({ product: product, variantId: variantId, prop: prop }); }
    function getImage() {
        var _a;
        var props = (_a = {
                src: getProp('image'),
                onClick: onClick
            },
            _a[type === 'vertical' ? 'height' : 'width'] = '100%',
            _a);
        return <img {...props}/>;
    }
    function name_layout() { return { html: product.name, className: 'as-product-card-name' }; }
    function description_layout() { return description ? { html: description, className: 'as-product-card-description' } : false; }
    function image_layout() { return { className: 'as-product-card-image', align: type === 'vertical' ? 'vh' : undefined, html: (<>{getImage()}{floatHtml}</>) }; }
    function cartButton_layout() {
        return { className: 'of-visible', html: actions.renderCartCountButton({ product: product, variantId: variantId, type: type, addToCart: addToCart }) };
    }
    function getLayout_horizontal() {
        return {
            className: "as-product-card ".concat(type),
            column: [
                { show: !!header, html: function () { return header; }, className: 'w-100' },
                {
                    row: [
                        image_layout(),
                        { size: 6 },
                        {
                            flex: 1,
                            column: [
                                {
                                    flex: 1,
                                    column: [
                                        { size: 6 },
                                        name_layout(),
                                        description_layout(),
                                        {
                                            className: 'of-visible',
                                            row: [
                                                cartButton_layout(),
                                                { flex: 1 },
                                                { html: actions.renderPrice({ product: product, variantId: variantId, type: 'v', actions: actions, getState: getState }) },
                                                { size: 12 }
                                            ]
                                        },
                                        { size: 6 }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                { show: !!footer, html: function () { return footer; }, className: 'w-100' }
            ]
        };
    }
    function getLayout_vertical() {
        return {
            className: "as-product-card ".concat(type),
            column: [
                image_layout(),
                {
                    flex: 1, className: 'p-6',
                    column: [
                        {
                            flex: 1,
                            column: [
                                { size: 6 },
                                name_layout(),
                                description_layout(),
                                { flex: 1 },
                                { html: actions.renderPrice({ product: product, variantId: variantId, type: 'v', actions: actions, getState: getState }) },
                                { size: 6 },
                                { row: [cartButton_layout()] }
                            ]
                        }
                    ]
                }
            ]
        };
    }
    function getLayout_shipping() {
        var className = "as-product-card ".concat(type);
        return {
            className: className,
            row: [
                image_layout(),
                { size: 6 },
                {
                    flex: 1, align: 'v',
                    column: [
                        name_layout(),
                        { size: 24, className: 'fs-10', align: 'v', show: !!variantLabel, html: variantLabel },
                        { size: 24, className: 'fs-10', align: 'v', show: !variantLabel, html: getProp('description') },
                        { row: [{ html: actions.renderPrice({ product: product, variantId: variantId, type: 'h', actions: actions, getState: getState }), flex: 1 }, cartButton_layout()] }
                    ]
                }
            ]
        };
    }
    var layout;
    if (type === 'horizontal') {
        layout = getLayout_horizontal();
    }
    else if (type === 'vertical') {
        layout = getLayout_vertical();
    }
    else if (type === 'shipping') {
        layout = getLayout_shipping();
    }
    return (<react_virtual_dom_1.default layout={layout}/>);
});
var ProductPage = (0, mobx_react_lite_1.observer)(function (props) {
    var product = props.product, variantId = props.variantId, actions = props.actions, getState = props.getState;
    var _a = (0, react_1.useState)(''), variantKey = _a[0], setVariantKey = _a[1];
    var optionValuesDic = (0, react_1.useState)(getOptionValuesDic())[0];
    var _b = (0, react_1.useState)(''), error = _b[0], setError = _b[1];
    var _c = (0, react_1.useState)({}), toggle = _c[0], setToggle = _c[1];
    (0, react_1.useEffect)(function () {
        if (variantId !== undefined) {
            if (!actions.getVariant(product, variantId)) {
                setError('محصول مورد نظر یافت نشد');
            }
        }
    }, []);
    (0, react_1.useEffect)(function () {
        var _a = product.variants, variants = _a === void 0 ? [] : _a;
        if (variants.length) {
            var firstVariant = actions.getFirstVariant(product, variantId);
            var variantKey_1 = firstVariant ? firstVariant.key : undefined;
            setVariantKey(variantKey_1);
        }
    }, []);
    function getOptionValuesDic() {
        var _a = product.optionTypes, optionTypes = _a === void 0 ? [] : _a, _b = product.variants, variants = _b === void 0 ? [] : _b;
        function getOptionValue(id, index) {
            var _a;
            var optionValues = optionTypes[index].optionValues;
            var optionValueId = id;
            var optionValueName = ((_a = optionValues.find(function (o) { return o.id === id; })) === null || _a === void 0 ? void 0 : _a.name) || '';
            return { optionValueId: optionValueId, optionValueName: optionValueName };
        }
        var res = [];
        var _loop_1 = function (i) {
            var variant = variants[i];
            var key = variant.key, variantId_1 = variant.id;
            var inStock = actions.getProp({ product: product, variantId: variantId_1, prop: 'inStock', def: Infinity });
            if (!inStock) {
                return "continue";
            }
            var keyList = key.split('_');
            var _loop_2 = function (j) {
                res[j] = res[j] || [];
                if (!res[j].find(function (o) { return o.optionValueId === keyList[j]; })) {
                    res[j].push(getOptionValue(keyList[j], j));
                }
            };
            for (var j = 0; j < keyList.length; j++) {
                _loop_2(j);
            }
        };
        for (var i = 0; i < variants.length; i++) {
            _loop_1(i);
        }
        return res;
    }
    function changeVariantKey(optionTypeIndex, optionValueId) {
        var optionValueIds = variantKey.split('_');
        optionValueIds[optionTypeIndex] = optionValueId;
        var ev = actions.getExistVariantsByOptionValues(product, optionValueIds.slice(0, optionTypeIndex + 1));
        var newVariantKey = ev[0].key;
        setVariantKey(newVariantKey);
    }
    function getImage(image) { return <img src={image} height='100%' alt=''/>; }
    function getProp(prop, def) {
        var variant = variantKey ? actions.getVariantByKey(product, variantKey) : undefined;
        return actions.getProp({ product: product, variantId: variant ? variant.id : undefined, prop: prop, def: def });
    }
    function image_layout() {
        var name = getProp('name');
        var rate = getProp('rate');
        var image = getProp('image');
        return {
            html: (<Box content={(<react_virtual_dom_1.default layout={{
                        className: 'as-product-page-image',
                        column: [
                            { align: 'vh', html: (<>{getImage(image)}{rate_layout(rate)}</>) },
                            name_layout(name)
                        ]
                    }}/>)}/>)
        };
    }
    function rate_layout(rate) {
        if (rate === undefined) {
            return false;
        }
        return <div className='as-product-page-rate-container'><Rate rate={rate} singleStar={true}/></div>;
    }
    function name_layout(name) { return { className: 'as-fs-l as-fc-d as-bold', html: name }; }
    function variant_layout() {
        var _a = product.variants, variants = _a === void 0 ? [] : _a, _b = product.optionTypes, optionTypes = _b === void 0 ? [] : _b;
        if (!optionTypes.length || !variants.length || !variantKey) {
            return false;
        }
        if (variantId !== undefined) {
            return { html: (<Box content={<react_virtual_dom_1.default layout={{ html: actions.getVariantLabel(product, variantId) }}/>}/>) };
        }
        return {
            html: (<Box content={(<react_virtual_dom_1.default layout={{ column: [{ gap: 6, column: optionTypes.map(function (o, i) { return optionValues_layout(o, i); }) }] }}/>)}/>)
        };
    }
    function optionValues_layout(_a, index) {
        var name = _a.name;
        var selectedKeys = variantKey.split('_');
        var optionValues = optionValuesDic[index].filter(function (_a) {
            var optionValueId = _a.optionValueId;
            var values = selectedKeys.slice(0, index).concat(optionValueId);
            var res = actions.getExistVariantsByOptionValues(product, values) || [];
            return !!res.length;
        });
        return {
            className: 'as-product-page-option-type',
            column: [
                label_layout(name),
                { size: 6 },
                {
                    className: 'ofx-auto',
                    row: optionValues.map(function (_a) {
                        var optionValueName = _a.optionValueName, optionValueId = _a.optionValueId;
                        var active = selectedKeys[index] === optionValueId;
                        return optionButton_layout(optionValueName, optionValueId, active, index);
                    })
                }
            ]
        };
    }
    function optionButton_layout(text, value, active, index) {
        var className = 'as-product-page-option-type-button as-fs-m' + (active ? ' active' : '');
        return { html: (<button className={className} onClick={function () { return changeVariantKey(index, value); }}>{text}</button>) };
    }
    function label_layout(label, key) {
        var icon = false;
        if (key) {
            icon = { show: !!key, html: <react_2.Icon path={toggle[key] ? js_1.mdiChevronDown : js_1.mdiChevronLeft} size={1}/>, size: 30, align: 'vh' };
        }
        return {
            className: 'as-box-label',
            onClick: key ? function () {
                var _a;
                return setToggle(__assign(__assign({}, toggle), (_a = {}, _a[key] = !toggle[key], _a)));
            } : undefined,
            row: [
                icon,
                { html: label, align: 'v' },
            ]
        };
    }
    function review_layout() {
        var review = getProp('review');
        if (!review) {
            return false;
        }
        return { html: (<Box title={'توضیحات'} content={review} toggle={true}/>) };
    }
    function details_layout() {
        var details = [];
        var _a = product.details, productDetails = _a === void 0 ? [] : _a;
        details = __spreadArray([], productDetails, true);
        if (variantKey) {
            var variant = actions.getVariantByKey(product, variantKey);
            var _b = variant.details, variantDetails = _b === void 0 ? [] : _b;
            details = __spreadArray(__spreadArray([], variantDetails, true), details, true);
        }
        if (!details.length) {
            return false;
        }
        return {
            html: (<Box title={'مشخصات'} showAll={true} content={function (showAll) { return <Details details={details} showAll={showAll}/>; }}/>)
        };
    }
    function rates_layout() {
        var rates = getProp('rates', []);
        if (!rates.length) {
            return false;
        }
        return { html: <Box title='امتیاز کاربران' content={<RateItems rates={rates}/>}/> };
    }
    function import_layout(row) {
        var _a = getState().importHTML, importHTML = _a === void 0 ? function () { } : _a;
        ;
        var html = importHTML({ type: 'cart', position: row });
        if (!html) {
            return false;
        }
        return { html: <Box content={html}/>, className: 'as-fs-m as-fc-m' };
    }
    function footer_layout() {
        var variantId;
        if (product.variants) {
            if (!actions.isVariantKeyExist(product, variantKey)) {
                return { html: 'ناموجود', className: 'as-product-page-footer as-not-exist', align: 'v' };
            }
            var variant = actions.getVariantByKey(product, variantKey);
            variantId = variant.id;
        }
        return {
            className: 'as-product-page-footer',
            row: [
                { align: 'v', column: [cartCountButton_layout(product, variantId)] },
                { flex: 1 },
                { html: actions.renderPrice({ product: product, variantId: variantId, type: 'v', actions: actions, getState: getState }) }
            ]
        };
    }
    function cartCountButton_layout(product, variantId) {
        return {
            className: 'of-visible', align: 'v',
            html: actions.renderCartCountButton({ product: product, variantId: variantId, type: 'product page', addToCart: true })
        };
    }
    if (error) {
        return (<react_virtual_dom_1.default layout={{ className: 'as-product-page', html: error, align: 'vh' }}/>);
    }
    return (<react_virtual_dom_1.default layout={{
            className: 'as-product-page',
            column: [
                {
                    flex: 1, className: 'ofy-auto as-product-page-body',
                    column: [
                        image_layout(),
                        import_layout(0),
                        variant_layout(),
                        import_layout(1),
                        details_layout(),
                        import_layout(2),
                        review_layout(),
                        import_layout(3),
                        rates_layout(),
                        import_layout(4),
                    ]
                },
                footer_layout()
            ]
        }}/>);
});
var Details = /** @class */ (function (_super) {
    __extends(Details, _super);
    function Details() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Details.prototype.lowDetails_layout = function (details, showAll) {
        var _this = this;
        if (showAll) {
            return false;
        }
        var bolds = details.filter(function (_a) {
            var key = _a[0], value = _a[1], bold = _a[2];
            return bold;
        });
        if (bolds.length < 3) {
            for (var i = 0; i < details.length; i++) {
                var _a = details[i], key = _a[0], value = _a[1], bold = _a[2];
                if (bold) {
                    continue;
                }
                if (bolds.length >= 3) {
                    break;
                }
                bolds.push(details[i]);
            }
        }
        return {
            className: 'as-product-page-details',
            column: bolds.map(function (o) { return _this.detail_layout(o); })
        };
    };
    Details.prototype.fullDetails_layout = function (details, showAll) {
        var _this = this;
        if (!showAll) {
            return false;
        }
        return {
            className: 'as-product-page-details',
            column: details.map(function (o) { return _this.detail_layout(o); })
        };
    };
    Details.prototype.detail_layout = function (_a) {
        var key = _a[0], value = _a[1], bold = _a[2];
        var isList = Array.isArray(value);
        return {
            className: 'as-product-page-detail',
            row: [
                { html: key, className: 'as-fs-s as-fc-m as-detail-key' + (bold ? ' bold-key' : ''), align: 'v' },
                { show: !isList, html: value, className: 'as-fs-m as-fc-d as-detail-value' },
                {
                    show: !!isList, className: 'as-fs-m as-fc-d as-detail-value', column: function () { return value.map(function (v) {
                        return {
                            row: [
                                { html: <react_2.Icon path={js_1.mdiCircleSmall} size={.8}/> },
                                { html: v, flex: 1 }
                            ]
                        };
                    }); }
                }
            ]
        };
    };
    Details.prototype.render = function () {
        var _a = this.props, details = _a.details, showAll = _a.showAll;
        return (<react_virtual_dom_1.default layout={{
                column: [
                    this.fullDetails_layout(details, showAll),
                    this.lowDetails_layout(details, showAll),
                ]
            }}/>);
    };
    return Details;
}(react_1.Component));
function Price(props) {
    var product = props.product, variantId = props.variantId, type = props.type, actions = props.actions, getState = props.getState;
    function validateDiscountPercent(v) {
        if (v === void 0) { v = 0; }
        v = +v;
        if (isNaN(v)) {
            v = 0;
        }
        return v;
    }
    if (!product) {
        debugger;
    }
    var price = actions.getProp({ product: product, variantId: variantId, prop: 'price', def: 0 });
    var discountPercent = actions.getProp({ product: product, variantId: variantId, prop: 'discountPercent', def: 0 });
    var sum = actions.getDiscountPercent(discountPercent);
    function price_layout() { return { show: !!sum, html: function () { return (<del>{(0, aio_utils_1.SplitNumber)(price)}</del>); }, align: 'v', style: { fontSize: '80%' } }; }
    function finalPrice_layout() { return { html: "".concat((0, aio_utils_1.SplitNumber)(price - (price * sum / 100))), align: 'v', style: { fontWeight: 'bold' } }; }
    function unit_layout() { return { html: getState().unit, align: 'v', style: { fontSize: '70%' } }; }
    function discountPercent_layout() {
        return {
            show: !!sum, gap: 3, style: { fontSize: '85%' },
            row: function () {
                var list = !Array.isArray(discountPercent) ? [{ value: discountPercent }] : discountPercent.map(function (o) { return typeof o === 'object' ? o : { value: o }; });
                return list.map(function (_a) {
                    var value = _a.value, color = _a.color;
                    value = validateDiscountPercent(value);
                    return { show: !!value, html: value + '%', className: 'as-discount-box', align: 'v', style: { background: color } };
                });
            }
        };
    }
    var className = 'as-price-layout', layout;
    if (type === 'h') {
        layout = { className: className, gap: 3, row: [discountPercent_layout(), price_layout(), finalPrice_layout(), unit_layout()] };
    }
    else {
        var row1 = { gap: 3, show: !!sum, row: [{ flex: 1 }, price_layout(), discountPercent_layout()] };
        var row2 = { row: [{ flex: 1 }, finalPrice_layout(), unit_layout()] };
        layout = { className: className, align: 'v', column: [row1, row2] };
    }
    return <react_virtual_dom_1.default layout={layout}/>;
}
var Shipping = (0, mobx_react_lite_1.observer)(function (props) {
    var actions = props.actions, getState = props.getState;
    var _a = (0, react_1.useState)(''), discountCode = _a[0], setDiscountCode = _a[1];
    var _b = (0, react_1.useState)(0), discountCodeAmount = _b[0], setDiscountCodeAmount = _b[1];
    var _c = (0, react_1.useState)(''), discountCodeError = _c[0], setDiscountCodeError = _c[1];
    var _d = getState(), cart = _d.cart, getShippingOptions = _d.getShippingOptions, checkDiscountCode = _d.checkDiscountCode;
    function changeShipping(changeObject) {
        return __awaiter(this, void 0, void 0, function () {
            var newShipping;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newShipping = __assign(__assign({}, getState().shipping), changeObject);
                        actions.updateShipping(newShipping);
                        return [4 /*yield*/, actions.updateFactor()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    (0, react_1.useEffect)(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var shippingOptions, shipping, i, shippingOption, option, value, field;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shippingOptions = getShippingOptions();
                        shipping = {};
                        for (i = 0; i < shippingOptions.length; i++) {
                            shippingOption = shippingOptions[i];
                            option = typeof shippingOption === 'function' ? shippingOption() : shippingOption;
                            value = option.value, field = option.field;
                            if (!field) {
                                continue;
                            }
                            shipping[field] = value;
                        }
                        return [4 /*yield*/, changeShipping(shipping)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, []);
    function items_layout() {
        var cartItems_layout = cart.map(function (_a) {
            var product = _a.product, variantId = _a.variantId;
            var html = actions.renderProductCard({ product: product, variantId: variantId, type: 'shipping', actions: actions, getState: getState });
            return { className: 'of-visible', html: html };
        });
        return { html: (<Box content={(<react_virtual_dom_1.default layout={{ className: 'of-visible', column: [{ flex: 1, className: 'of-visible', column: cartItems_layout }] }}/>)}/>) };
    }
    function options_layout() {
        var shippingOptions = getShippingOptions();
        if (!shippingOptions.length) {
            return false;
        }
        return {
            column: shippingOptions.map(function (o, i) {
                var shippingOption = typeof o === 'function' ? o() : o;
                if (!shippingOption) {
                    return false;
                }
                var show = shippingOption.show;
                show = typeof show === 'function' ? show() : show;
                if (show === false) {
                    return false;
                }
                if (shippingOption.type === 'html') {
                    return html_layout(shippingOption);
                }
                return option_layout(shippingOption, i === shippingOptions.length - 1);
            })
        };
    }
    function option_layout(shippingOption, isLast) {
        var title = shippingOption.title, subtitle = shippingOption.subtitle, options = shippingOption.options, field = shippingOption.field, multiple = shippingOption.multiple;
        return {
            html: (<Box title={title} subtitle={subtitle} content={(<aio_input_1.default type='radio' className='as-shipping-item' multiple={multiple} options={options.map(function (o) { return __assign(__assign({}, o), { before: o.icon }); })} optionClassName="as-shipping-option" value={getState().shipping[field]} onChange={function (value) {
                    var _a;
                    return changeShipping((_a = {}, _a[field] = value, _a));
                }}/>)}/>)
        };
    }
    function html_layout(shippingOption) {
        var title = shippingOption.title, subtitle = shippingOption.subtitle, html = shippingOption.html;
        html = typeof html === 'function' ? html(function (obj) { return changeShipping(obj); }) : html;
        return { html: <Box title={title} subtitle={subtitle} content={html}/> };
    }
    function discountCode_layout() {
        var _this = this;
        if (!checkDiscountCode) {
            return false;
        }
        return {
            html: (<Box content={(<react_virtual_dom_1.default layout={{
                        className: 'as-discount-code',
                        row: [
                            {
                                flex: 1,
                                html: (<input disabled={!!discountCodeAmount} placeholder='کد تخفیف' type='text' value={discountCode} onChange={function (e) { setDiscountCode(e.target.value); setDiscountCodeError(''); }}/>)
                            },
                            {
                                html: (<button disabled={!!discountCodeAmount || !discountCode} onClick={function () { return __awaiter(_this, void 0, void 0, function () {
                                        var res;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!checkDiscountCode) {
                                                        return [2 /*return*/];
                                                    }
                                                    return [4 /*yield*/, checkDiscountCode(discountCode, getState())];
                                                case 1:
                                                    res = _a.sent();
                                                    if (typeof res === 'number') {
                                                        setDiscountCodeAmount(res);
                                                        setDiscountCodeError('');
                                                    }
                                                    else if (typeof res === 'string') {
                                                        setDiscountCodeAmount(0);
                                                        setDiscountCodeError(res);
                                                    }
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }}>ثبت کد تخفیف</button>)
                            }
                        ]
                    }}/>)}/>)
        };
    }
    function discountCodeError_layout() {
        if (!discountCodeError) {
            return false;
        }
        return { className: 'as-shipping-discount-code-error', html: discountCodeError };
    }
    function factor_layout() {
        if (!cart.length) {
            return false;
        }
        return { html: <Box content={function () { return actions.renderFactor(); }}/> };
    }
    function submit_layout() {
        var amount = getState().factor.amount;
        return {
            className: 'as-submit-button-container',
            html: (<button onClick={function () { return getState().payment(); }} className='as-submit-button'>{"\u067E\u0631\u062F\u0627\u062E\u062A ".concat((0, aio_utils_1.SplitNumber)(amount), " ").concat(getState().unit)}</button>)
        };
    }
    function import_layout(row) {
        var _a = getState().importHTML, importHTML = _a === void 0 ? function () { } : _a;
        var html = importHTML({ type: 'cart', position: row });
        if (!html) {
            return false;
        }
        return { html: <Box content={html}/>, className: 'as-fs-m as-fc-m' };
    }
    return (<react_virtual_dom_1.default layout={{
            style: { background: '#f4f4f4', height: '100%' }, className: 'as-shipping',
            column: [
                {
                    flex: 1, className: 'ofy-auto',
                    column: [
                        import_layout(0),
                        items_layout(),
                        import_layout(1),
                        options_layout(),
                        discountCode_layout(),
                        discountCodeError_layout(),
                        import_layout(2),
                        factor_layout(),
                    ]
                },
                submit_layout(),
            ]
        }}/>);
});
var Cart = (0, mobx_react_lite_1.observer)(function (props) {
    var actions = props.actions, getState = props.getState, onSubmit = props.onSubmit;
    var cart = getState().cart;
    function item_layout(_a) {
        var product = _a.product, variantId = _a.variantId;
        return { className: 'of-visible', html: actions.renderProductCard({ product: product, variantId: variantId, type: 'horizontal', addToCart: true, actions: actions, getState: getState }) };
    }
    function items_layout() {
        if (!cart.length) {
            return { html: 'سبد خرید شما خالی است', align: 'vh' };
        }
        return { className: 'of-visible p-h-12', column: cart.map(function (o) { return item_layout(o); }) };
    }
    function total_layout() {
        if (!cart.length) {
            return false;
        }
        var _a = getState().factor, total = _a.total, discount = _a.discount;
        var html = (<Box content={(<react_virtual_dom_1.default layout={{
                    className: 'as-fs-l as-fc-d',
                    row: [
                        { html: 'جمع سبد خرید', flex: 1 },
                        { html: (0, aio_utils_1.SplitNumber)(total - discount), align: 'v', className: 'bold m-h-3' },
                        { html: getState().unit, className: 'as-fs-s as-fc-l', align: 'v' }
                    ]
                }}/>)}/>);
        return { html: html };
    }
    function submit_layout() {
        if (!cart.length) {
            return false;
        }
        return {
            className: 'as-submit-button-container',
            html: <button onClick={function () { return onSubmit(); }} className='as-submit-button'>تکمیل خرید</button>
        };
    }
    function import_layout(row) {
        var _a = getState().importHTML, importHTML = _a === void 0 ? function () { } : _a;
        var html = importHTML({ type: 'cart', position: row });
        if (!html) {
            return false;
        }
        return { html: <Box content={html}/>, className: 'as-fs-m as-fc-m' };
    }
    return (<react_virtual_dom_1.default layout={{
            className: 'as-cart',
            column: [
                { flex: 1, className: 'ofy-auto', column: [import_layout(0), items_layout(), import_layout(1)] },
                { column: [total_layout(), submit_layout()] }
            ]
        }}/>);
});
function CartCountButton(props) {
    var actions = props.actions, getState = props.getState, product = props.product, variantId = props.variantId, type = props.type, addToCart = props.addToCart;
    function getInitialCount() { return actions.getCartCount(product.id, variantId); }
    var addToCartText = getState().addToCartText;
    var initialCount = getInitialCount();
    var _a = (0, react_1.useState)(initialCount), count = _a[0], setCount = _a[1];
    var _b = (0, react_1.useState)(initialCount), prevCount = _b[0], setPrevCount = _b[1];
    var changeTimeout;
    function validateCount(count) {
        if (count === 0) {
            return 0;
        }
        var min = actions.getProp({ product: product, variantId: variantId, prop: 'min', def: 0 });
        var max = actions.getProp({ product: product, variantId: variantId, prop: 'max', def: Infinity });
        if (count > max) {
            count = max;
        }
        if (count < min) {
            count = min;
        }
        return count;
    }
    function change(count) {
        count = +count;
        if (isNaN(count)) {
            count = 0;
        }
        count = validateCount(count);
        setCount(count);
        clearTimeout(changeTimeout);
        changeTimeout = setTimeout(function () { return actions.setCartCount({ product: product, variantId: variantId, count: count }); }, 500);
    }
    function handlePropsChanged() {
        var count = getInitialCount();
        if (count !== prevCount) {
            setTimeout(function () { setCount(count); setPrevCount(count); }, 0);
        }
    }
    function cartIcon_layout(count) {
        if (!count) {
            return false;
        }
        var icon = <react_2.Icon path={js_1.mdiCart} size={0.8}/>;
        return { align: 'vh', className: 'p-h-6', row: [{ html: icon, align: 'vh' }, { html: count, align: 'v' }] };
    }
    function getIcon(dir, count, min) {
        var path;
        if (dir === 1) {
            path = js_1.mdiPlus;
        }
        else {
            if (count - 1 < min || count === 1) {
                path = js_1.mdiTrashCanOutline;
            }
            else {
                path = js_1.mdiMinus;
            }
        }
        return <react_2.Icon path={path} size={dir === 1 ? .9 : (count === 1 ? .8 : .9)}/>;
    }
    function dirButton_layout(dir) {
        var min = actions.getProp({ product: product, variantId: variantId, prop: 'min', def: 0 });
        var max = actions.getProp({ product: product, variantId: variantId, prop: 'max', def: Infinity });
        var step = actions.getProp({ product: product, variantId: variantId, prop: 'step', def: 1 });
        var inStock = actions.getProp({ product: product, variantId: variantId, prop: 'inStock', def: Infinity });
        return {
            align: 'vh',
            html: (<button className='as-cart-count-button-step' onClick={function () { return change(count + (dir * step)); }} disabled={dir === 1 && (count >= max || count >= inStock)}>
                    {getIcon(dir, count, min)}
                </button>)
        };
    }
    function changeButton_layout() {
        if (!count) {
            return false;
        }
        var step = actions.getProp({ product: product, variantId: variantId, prop: 'step', def: 1 });
        var min = actions.getProp({ product: product, variantId: variantId, prop: 'min', def: 0 });
        var max = actions.getProp({ product: product, variantId: variantId, prop: 'max', def: Infinity });
        var inStock = actions.getProp({ product: product, variantId: variantId, prop: 'inStock', def: Infinity });
        if (count && count < min) {
            count = min;
        }
        var maxText = '', minText = '';
        if (max && inStock) {
            if (!!min) {
                minText = "\u062D\u062F\u0627\u0642\u0644 ".concat(min);
            }
            if (max && inStock) {
                if (count === max) {
                    maxText = "\u062D\u062F\u0627\u06A9\u062B\u0631 ".concat(max);
                }
                else if (count === inStock) {
                    maxText = "\u0633\u0642\u0641 \u0645\u0648\u062C\u0648\u062F\u06CC";
                }
            }
        }
        return {
            className: 'of-visible',
            column: [
                {
                    row: [
                        dirButton_layout(1),
                        { align: 'v', className: 'of-visible', html: (<div data-step={step > 1 ? "".concat(step, "+") : undefined} className='as-cart-count-button-input as-fs-m as-fc-d'>{count}</div>) },
                        dirButton_layout(-1)
                    ]
                },
                { show: !!minText || !!maxText, html: "".concat(minText, " ").concat(maxText), className: 'as-cart-button-text' },
            ]
        };
    }
    function getLayout() {
        //اگر این یک کارت کاستوم برای نمایش از خارج سیستم است
        var variants = product.variants;
        var step = actions.getProp({ product: product, variantId: variantId, prop: 'step', def: 1 });
        //اگر در حال نمایش صفحه یک محصول که در انبار موجود نیست هستیم
        if (!actions.getProp({ product: product, variantId: variantId, prop: 'inStock', def: Infinity })) {
            return { html: 'نا موجود', className: 'as-cart-count-button-not-exist' };
        }
        else if (type === 'product page') {
            //اگر در حال نمایش صفحه یک محصول واریانت دار هستیم و واریانت آی دی ارسالی معتبر نیست
            if (variants && !variantId) {
                return { html: 'نا موجود', className: 'as-cart-count-button-not-exist' };
            }
        }
        else {
            //اگر در حال نمایش کارت یک محصول واریانت دار هستیم 
            if (variants && !variantId) {
                return cartIcon_layout(actions.getCartCount(product.id));
            }
            //اگر در حال نمایش کارت یک محصول در صفحه شیپینگ هستیم
            if (type === 'shipping') {
                return cartIcon_layout(actions.getCartCount(product.id, variantId));
            }
        }
        if (addToCart) {
            if (!count) {
                return { html: <button onClick={function () { return change(step); }} className={'as-cart-count-button-add'}>{addToCartText}</button> };
            }
            if (count) {
                return changeButton_layout();
            }
        }
    }
    (0, react_1.useEffect)(function () { return handlePropsChanged(); });
    var layout = getLayout();
    if (!layout) {
        return null;
    }
    return (<react_virtual_dom_1.default layout={layout}/>);
}
var Factor = (0, mobx_react_lite_1.observer)(function (props) {
    var actions = props.actions, getState = props.getState;
    var unit = getState().unit;
    var _a = getState().factor, total = _a.total, discount = _a.discount, _b = _a.discounts, discounts = _b === void 0 ? [] : _b, amount = _a.amount, _c = _a.extras, extras = _c === void 0 ? [] : _c;
    function total_layout() {
        return {
            className: 'as-fs-m as-fc-m',
            row: [
                { html: 'مجموع قیمت' },
                { flex: 1 },
                { html: (0, aio_utils_1.SplitNumber)(total), align: 'v' },
                { size: 3 },
                { html: unit, className: 'as-fs-s as-fc-l', align: 'v' }
            ]
        };
    }
    function discount_layout() {
        if (!discount) {
            return false;
        }
        return {
            className: 'as-fs-m as-fc-m',
            row: [
                { html: 'مجموع تخفیف' },
                { flex: 1 },
                { html: (0, aio_utils_1.SplitNumber)(discount), align: 'v' },
                { size: 3 },
                { html: unit, className: 'as-fs-s as-fc-l', align: 'v' },
                { html: <react_2.Icon path={js_1.mdiMinus} size={0.7}/>, align: 'vh', style: { color: 'red' } }
            ]
        };
    }
    function discounts_layout() {
        if (!discounts.length) {
            return false;
        }
        return {
            gap: 12,
            column: discounts.map(function (_a) {
                var title = _a.title, _b = _a.discountPercent, discountPercent = _b === void 0 ? 0 : _b, discount = _a.discount;
                return row_layout({ title: title, percent: discountPercent, amount: discount, dir: -1 });
            })
        };
    }
    function row_layout(_a) {
        var title = _a.title, percent = _a.percent, amount = _a.amount, dir = _a.dir;
        return {
            row: [
                { html: title, className: 'as-fs-m as-fc-m' },
                { flex: 1 },
                { show: !!percent, html: "(".concat(percent, "%)"), className: 'm-h-3 as-fs-m as-fc-m' },
                { html: (0, aio_utils_1.SplitNumber)(amount), align: 'v', className: 'as-fs-m as-fc-m' },
                { size: 3 },
                { html: unit, className: 'as-fs-s as-fc-l', align: 'v' },
                { html: <react_2.Icon path={dir === -1 ? js_1.mdiMinus : js_1.mdiPlus} size={0.7}/>, align: 'vh', style: { color: dir === -1 ? 'red' : 'green' } }
            ]
        };
    }
    function extras_layout() {
        if (!extras.length) {
            return false;
        }
        return {
            gap: 12,
            column: extras.map(function (_a) {
                var title = _a.title, percent = _a.percent, amount = _a.amount;
                return row_layout({ title: title, percent: percent, amount: amount, dir: 1 });
            })
        };
    }
    function amount_layout() {
        return {
            className: 'as-fs-l as-fc-d',
            row: [
                { html: 'قابل پرداخت', className: 'bold' },
                { flex: 1 },
                { html: (0, aio_utils_1.SplitNumber)(amount), align: 'v', className: 'bold' },
                { size: 3 },
                { html: unit, className: 'as-fs-s as-fc-l', align: 'v' }
            ]
        };
    }
    return (<react_virtual_dom_1.default layout={{ gap: 12, column: [total_layout(), discount_layout(), discounts_layout(), extras_layout(), amount_layout()] }}/>);
});
function List(props) {
    var actions = props.actions, before = props.before, after = props.after, search = props.search, onChange = props.onChange, _a = props.totalCount, totalCount = _a === void 0 ? 0 : _a, products = props.products;
    var _b = (0, react_1.useState)(getPaging()), paging = _b[0], setPaging = _b[1];
    var _c = (0, react_1.useState)(''), searchValue = _c[0], setSeachValue = _c[1];
    function change(key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var newPaging, newSearchValue, pageSize, pageNumber, res_1, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!onChange) {
                            alert("\n                aio-shop error => in renderList props you set search:boolean and/or paging:boolean props \n                but missing set onChange:({pageSize?:number,pageNumber?:number,searchValue?:string})=>boolean props\n            ");
                            return [2 /*return*/];
                        }
                        newPaging = paging, newSearchValue = searchValue;
                        if (!(key === 'paging')) return [3 /*break*/, 2];
                        newPaging = __assign(__assign({}, paging), value);
                        pageSize = newPaging.size, pageNumber = newPaging.number;
                        return [4 /*yield*/, onChange({ pageSize: pageSize, pageNumber: pageNumber, searchValue: searchValue })];
                    case 1:
                        res_1 = _a.sent();
                        if (res_1 === true) {
                            setPaging(newPaging);
                        }
                        _a.label = 2;
                    case 2:
                        if (key === 'searchValue') {
                            newSearchValue = value;
                        }
                        return [4 /*yield*/, onChange({ pageSize: newPaging.size, pageNumber: newPaging.number, searchValue: newSearchValue })];
                    case 3:
                        res = _a.sent();
                        if (res === true) {
                            setPaging(newPaging);
                            setSeachValue(newSearchValue);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function getPaging() {
        if (typeof totalCount !== 'number') {
            alert("\n                aio-shop error => in renderList props you set paging:boolean props \n                but missing set totalCount:number props\n            ");
        }
        return {
            number: 1, size: 20, sizes: [10, 20, 40, 100], serverSide: true, length: totalCount, onChange: function (obj) { return change('paging', obj); }
        };
    }
    function search_layout() {
        if (!search) {
            return false;
        }
        return {
            className: 'as-list-search',
            html: (<aio_input_1.default type='text' after={<react_2.Icon path={js_1.mdiMagnify} size={0.8}/>} onChange={function (searchValue) { return change('searchValue', searchValue); }}/>)
        };
    }
    function before_layout() { return { show: !!before, html: function () { return typeof before === 'function' ? before() : before; } }; }
    function after_layout() { return { show: !!after, html: function () { return typeof after === 'function' ? after() : after; } }; }
    function items_layout() {
        return {
            className: 'of-visible',
            html: (<aio_input_1.default type='table' value={products} rowTemplate={function (_a) {
                var row = _a.row;
                return actions.renderProductCard(row);
            }} paging={props.paging ? paging : undefined}/>)
        };
    }
    return (<react_virtual_dom_1.default layout={{
            className: 'as-list of-visible',
            column: [
                search_layout(),
                { flex: 1, className: 'ofy-auto as-list-products', column: [before_layout(), items_layout(), after_layout()] }
            ]
        }}/>);
}
function Slider(_a) {
    var items = _a.items, actions = _a.actions, getState = _a.getState, before = _a.before, after = _a.after;
    function before_layout() { return { show: !!before, html: before, className: 'as-slider-before' }; }
    function after_layout() { return { show: !!after, html: after, className: 'as-slider-after' }; }
    function item_layout(product) { return { className: 'of-visible', html: actions.renderProductCard(__assign(__assign({}, product), { type: 'vertical' })) }; }
    function items_layout() { return { gap: 12, className: 'of-visible', row: items.map(function (item) { return item_layout(item); }) }; }
    function body_layout() { return { className: 'as-slider-body', gap: 12, row: [before_layout(), items_layout(), after_layout()] }; }
    return (<react_virtual_dom_1.default layout={{ className: 'as-slider', column: [body_layout()] }}/>);
}
function Rate(props) {
    var rate = props.rate, color = props.color, singleStar = props.singleStar;
    function getIcon(index) {
        var full = Math.floor(rate);
        var half = !!(rate - full);
        if (index < full) {
            return js_1.mdiStar;
        }
        else if (index === full && half) {
            return js_1.mdiStarHalfFull;
        }
        else {
            return js_1.mdiStarOutline;
        }
    }
    function icons_layout(list) { return { row: list.map(function (o, i) { return icon_layout(i); }) }; }
    function icon_layout(index) { return { style: { color: color }, className: 'as-rate-icon', html: <react_2.Icon path={getIcon(index)} size={0.6}/> }; }
    function text_layout() { return { html: rate, className: 'as-rate-text' }; }
    var list = Array(singleStar ? 1 : 5).fill(0);
    return (<react_virtual_dom_1.default layout={{ align: 'v', className: 'align-vh as-rate', row: [text_layout(), { size: 3 }, icons_layout(list)] }}/>);
}
function RateItems(_a) {
    var rates = _a.rates;
    function getRangeColor(value) { return ['red', 'orange', 'yellow', 'green', 'lightgreen'][value - 1]; }
    function text_layout(text) { return { html: text, className: 'as-fs-s as-fs-m w-96 no-wrap', align: 'v' }; }
    function slider_layout(value) { return { align: 'v', className: 'as-rate-item-slider', flex: 1, html: getSlider(value) }; }
    function value_laoyut(value) { return { align: 'vh', html: value, className: 'as-rate-item-value' }; }
    function getFillStyle(index) { if (index === 0) {
        return { background: 'green' };
    } }
    function getSlider(value) { return (<aio_input_1.default type='slider' start={0} end={5} step={0.1} value={[value]} direction='left' fillStyle={getFillStyle}/>); }
    function item_layout(_a) {
        var text = _a.text, value = _a.value;
        return { className: 'as-rate-items', row: [text_layout(text), slider_layout(value), value_laoyut(value)] };
    }
    return (<react_virtual_dom_1.default layout={{ column: rates.map(function (o) { return item_layout(o); }) }}/>);
}
var Box = /** @class */ (function (_super) {
    __extends(Box, _super);
    function Box(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { open: true, toggleShowAll: false };
        return _this;
    }
    Box.prototype.toggle_layout = function (toggle) {
        if (!toggle) {
            return false;
        }
        var open = this.state.open;
        return {
            size: 30, align: 'vh', html: <react_2.Icon path={open ? js_1.mdiChevronDown : js_1.mdiChevronLeft} size={1}/>
        };
    };
    Box.prototype.header_layout = function (title, subtitle, toggle, showAll) {
        var _this = this;
        var toggleShowAll = this.state.toggleShowAll;
        return {
            className: 'as-fs-l as-fc-d as-bold',
            onClick: toggle ? function () { return _this.setState({ open: !_this.state.open }); } : undefined,
            row: [
                this.toggle_layout(toggle),
                { show: !!title, html: title, align: 'v' },
                { show: !!subtitle, html: "( ".concat(subtitle, " )"), className: 'as-fs-s as-fc-l as-box-subtitle', align: 'v' },
                { flex: 1 },
                {
                    show: !!showAll,
                    html: toggleShowAll ? 'نمایش کمتر' : 'نمایش همه',
                    className: 'as-link',
                    onClick: function () { return _this.setState({ toggleShowAll: !toggleShowAll }); }
                }
            ]
        };
    };
    Box.prototype.render = function () {
        var _a = this.state, open = _a.open, toggleShowAll = _a.toggleShowAll;
        var _b = this.props, title = _b.title, subtitle = _b.subtitle, content = _b.content, toggle = _b.toggle, showAll = _b.showAll;
        return (<react_virtual_dom_1.default layout={{
                className: 'as-box',
                column: [
                    this.header_layout(title, subtitle, toggle, showAll),
                    { size: 12, show: !!open && !!title },
                    { show: !!open && !!content, html: typeof content === 'function' ? content(toggleShowAll) : content, className: 'as-fs-m as-fc-m as-box-content' }
                ]
            }}/>);
    };
    return Box;
}(react_1.Component));
function BackOffice(props) {
    var category = props.category, product = props.product, actions = props.actions, getState = props.getState;
    var getTabs = function () {
        var tabs = [];
        if (product) {
            tabs.push({ text: 'محصولات', value: 'products' });
        }
        if (category) {
            tabs.push({ text: 'دسته بندی ها', value: 'categories' });
        }
        return tabs;
    };
    var tabs = (0, react_1.useState)(getTabs())[0];
    var _a = (0, react_1.useState)('products'), tab = _a[0], setTab = _a[1];
    function tabs_layout(tab) { return { html: (<aio_input_1.default type='tabs' options={tabs} value={tab} onChange={function (tab) { return setTab(tab); }}/>) }; }
    function body_layout(tab) {
        if (tab === 'products') {
            return products_layout();
        }
        if (tab === 'categories') {
            return categories_layout();
        }
    }
    function products_layout() {
        var list = product.list, onAdd = product.onAdd, onRemove = product.onRemove, onEdit = product.onEdit, onChange = product.onChange, fields = product.fields, variantMode = product.variantMode;
        var p = { actions: actions, getState: getState, list: list, onAdd: onAdd, onRemove: onRemove, onEdit: onEdit, onChange: onChange, fields: fields, variantMode: variantMode };
        return { className: 'h-100 ofy-auto', flex: 1, html: (<ProductManager {...p}/>) };
    }
    function categories_layout() {
        var list = category.list, onChange = category.onChange, p = { actions: actions, getState: getState, categories: list, onChange: onChange };
        return { className: 'h-100 ofy-auto', flex: 1, html: (<CategoryManager {...p}/>) };
    }
    return <react_virtual_dom_1.default layout={{ className: 'aio-shop-back-office', column: [tabs_layout(tab), body_layout(tab)] }}/>;
}
function ProductManager(props) {
    var _this = this;
    var cls = 'as-bo-productmanager-productcard';
    var _a = props.list, list = _a === void 0 ? [] : _a, variantMode = props.variantMode, fields = props.fields, getState = props.getState, _b = props.onAdd, onAdd = _b === void 0 ? function () { return 'id' + Math.round(Math.random() * 1000000); } : _b, _c = props.onEdit, onEdit = _c === void 0 ? function () { return true; } : _c, _d = props.onRemove, onRemove = _d === void 0 ? function () { return true; } : _d;
    var popup = getState().popup;
    var _e = (0, react_1.useState)(''), searchValue = _e[0], setSearchValue = _e[1];
    function header_layout(searchValue) {
        return { gap: 12, className: 'as-bo-productmanager-header', row: [add_layout(), search_layout(searchValue)] };
    }
    function add_layout() { return { html: <button onClick={function () { return productFormPopup(undefined); }} className='as-bo-button'>افزودن</button> }; }
    function search_layout(searchValue) {
        return {
            flex: 1,
            html: (<aio_input_1.default placeholder='جستجو' className='as-bo-productmanager-search' type='text' value={searchValue} after={<react_2.Icon path={js_1.mdiMagnify} size={.9} style={{ margin: '0 6px' }}/>} onChange={function (searchValue) { return setSearchValue(searchValue); }}/>)
        };
    }
    var add = function (newProduct) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, onAdd(newProduct)];
            case 1:
                if ((_a.sent()) === true) {
                    popup.removeModal();
                }
                return [2 /*return*/];
        }
    }); }); };
    var remove = function (id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, onRemove(id)];
            case 1:
                if ((_a.sent()) === true) {
                    popup.removeModal();
                }
                return [2 /*return*/];
        }
    }); }); };
    var edit = function (newProduct) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, onEdit(newProduct)];
            case 1:
                if ((_a.sent()) === true) {
                    popup.removeModal();
                }
                return [2 /*return*/];
        }
    }); }); };
    function body_layout(searchValue) {
        return { flex: 1, className: 'ofy-auto', column: (0, aio_utils_1.Search)(list, searchValue, function (o) { return "".concat(o.name, " ").concat(o.id); }).map(function (o) { return card_layout(o); }) };
    }
    function card_layout(product) {
        var _a = product.variants, variants = _a === void 0 ? [] : _a, name = product.name, description = product.description, id = product.id, image = product.image;
        return {
            className: cls, align: 'v', onClick: function () { return productFormPopup(product); },
            row: [
                { html: <img src={image} width={56} height={56}/>, size: 60, align: 'vh', className: cls + '-image' },
                { html: variants.length, className: cls + '-variants-length', show: !!variants.length },
                { size: 6 },
                {
                    flex: 1,
                    column: [{ html: name, className: cls + '-name' }, { html: description, className: cls + '-description' }, { html: "\u06A9\u062F ".concat(id), className: cls + '-code' }]
                },
                { size: 6 },
                { html: <react_2.Icon path={js_1.mdiClose} size={.7}/>, align: 'vh', className: cls + '-remove', onClick: function (e) { e.stopPropagation(); remove(id); } },
                { size: 6 }
            ]
        };
    }
    function productFormPopup(o) {
        var product = o || { name: '', image: false, review: '', description: '', details: [], price: 0, discountPercent: 0 };
        var type = !!o ? 'edit' : 'add';
        var title = !!o ? 'ویرایش محصول' : 'افزودن محصول';
        popup.addModal({
            header: { title: title },
            body: {
                render: function () { return (<react_virtual_dom_1.default layout={{
                        style: { height: '100%', background: '#fff', display: 'flex' },
                        column: [
                            {
                                flex: 1,
                                html: (<ProductForm variantMode={variantMode} fields={fields} product={product} type={type === 'add' ? 'add' : 'edit'} onAdd={function (newProduct) { return add(newProduct); }} onEdit={function (newProduct) { return edit(newProduct); }} onRemove={function () { return remove(o.id); }}/>)
                            }
                        ]
                    }}/>); }
            }
        });
    }
    return (<><react_virtual_dom_1.default layout={{ className: 'product-manager', column: [header_layout(searchValue), body_layout(searchValue)] }}/></>);
}
function ProductForm(props) {
    var _a = (0, react_1.useState)(props.product), model = _a[0], setModel = _a[1];
    var variantMode = props.variantMode, _b = props.fields, fields = _b === void 0 ? [] : _b, onAdd = props.onAdd, onEdit = props.onEdit, onRemove = props.onRemove, type = props.type;
    function form() {
        var _a = model.optionTypes, optionTypes = _a === void 0 ? [] : _a;
        return (<aio_input_1.default className='as-bo-form' type='form' lang='fa' reset={true} value={__assign({}, model)} footer={function (obj) { return formFooter_layout(obj); }} onChange={function (model, errors) { return setModel(__assign({}, model)); }} inputs={{
                props: { gap: 12 },
                column: __spreadArray([
                    { input: { type: 'text', disabled: true }, field: 'value.id', label: 'آی دی', show: model.id !== undefined },
                    { input: { type: 'text' }, field: 'value.name', label: 'نام', validations: [['required']] },
                    {
                        row: [
                            { input: { type: 'number' }, field: 'value.price', label: 'قیمت', validations: [['required']] },
                            { input: { type: 'number' }, field: 'value.discountPercent', label: 'درصد تخفیف' }
                        ]
                    },
                    { input: { type: 'textarea' }, field: 'value.description', label: 'توضیحات', validations: [['required']] },
                    { input: { type: 'textarea' }, field: 'value.review', label: 'شرح', validations: [['required']] },
                    {
                        input: {
                            type: 'table', add: { text: '', value: '' }, remove: true,
                            columns: [{ title: 'نام', value: 'row.name' }, { title: 'آی دی', value: 'row.id' }]
                        },
                        field: 'value.optionTypes', show: !!variantMode, label: 'آپشن ها'
                    },
                    {
                        show: !!variantMode,
                        column: !variantMode ? undefined : optionTypes.map(function (_a, i) {
                            var name = _a.name;
                            return {
                                input: {
                                    type: 'table', remove: true, add: { name: '', id: '' },
                                    columns: [{ title: 'نام', value: 'row.name' }, { title: 'آی دی', value: 'row.id' }]
                                },
                                inlineLabel: "".concat(name, " \u0647\u0627"), field: "value.optionTypes[".concat(i, "].optionValues")
                            };
                        })
                    },
                    {
                        show: !!variantMode,
                        input: {
                            type: 'table',
                            add: { id: 'nv' + Math.round(Math.random() * 10000000) },
                            remove: true,
                            columns: !variantMode ? undefined : model.optionTypes.map(function (_a, i) {
                                var name = _a.name, id = _a.id, optionValues = _a.optionValues;
                                return {
                                    title: name, type: 'select', value: "row.key.split(\"_\")[".concat(i, "]"), optionTypeId: id,
                                    options: optionValues.map(function (_a) {
                                        var name = _a.name, id = _a.id;
                                        return { text: name, value: id };
                                    }),
                                    onChange: function (_a) {
                                        var row = _a.row, value = _a.value;
                                        var key = row.key;
                                        if (!key) {
                                            key = optionTypes.map(function () { return 'notset'; }).join('_');
                                        }
                                        var keyList = key.split('_');
                                        keyList[i] = value;
                                        row.key = keyList.join('_');
                                        setModel(model);
                                    }
                                };
                            })
                        },
                        inlineLabel: 'واریانت ها', field: 'value.variants'
                    },
                    {
                        row: [
                            {
                                field: 'value.image', flex: 'none',
                                input: {
                                    type: 'image', placeholder: 'افزودن تصویر', height: 120,
                                    onChange: function (_a) {
                                        var url = _a.url, file = _a.file;
                                        return setModel(__assign(__assign({}, model), { image: url, image_file: file }));
                                    }
                                }
                            },
                            { flex: 1 }
                        ]
                    }
                ], fields, true)
            }}/>);
    }
    function getErrorMessage(errors, errorKeys) {
        var firstError = errorKeys[0] ? errors[errorKeys[0]] : false;
        if (firstError) {
            return firstError;
        }
        if (!model.image) {
            return 'ثبت تصویر محصول ضروری است';
        }
    }
    function formFooter_layout(_a) {
        var errors = _a.errors, isModelChanged = _a.isModelChanged, onReset = _a.onReset;
        var errorKeys = Object.keys(errors);
        var showSubmit = !!onAdd;
        var showEdit = !!onEdit && isModelChanged;
        var errorMessage = getErrorMessage(errors, errorKeys);
        if (!showSubmit && !showEdit && !errorMessage && !onRemove) {
            return false;
        }
        return (<react_virtual_dom_1.default layout={{
                className: 'as-bo-product-form',
                row: [
                    {
                        show: type === 'add',
                        html: (<button disabled={!!errorMessage} className='as-bo-button as-bo-button-submit' onClick={function () { return onAdd(model); }}>ثبت</button>)
                    },
                    {
                        show: type === 'edit' && isModelChanged,
                        html: (<button className='as-bo-button as-bo-button-edit' onClick={function () { return onEdit(model); }}>ویرایش</button>)
                    },
                    {
                        show: !!onReset && !!isModelChanged,
                        html: (<button className='as-bo-button as-bo-button-reset' onClick={function () { return onReset(model); }}>بازنشانی تغییرات</button>)
                    },
                    {
                        show: type === 'edit',
                        html: (<button className='as-bo-button as-bo-button-remove' onClick={function () { return onRemove(); }}>حذف</button>)
                    },
                    { flex: 1 },
                    { show: !!errorMessage, html: function () { return errorMessage; }, align: 'v', style: { color: 'red', fontSize: 10 } }
                ]
            }}/>);
    }
    return <react_virtual_dom_1.default layout={{ className: 'p-12', style: { background: '#eee' }, html: form() }}/>;
}
function CategoryManager(props) {
    var _a = (0, react_1.useState)({
        categories: JSON.parse(JSON.stringify(props.categories || [])),
        editId: false,
        temp: ''
    }), state = _a[0], setState = _a[1];
    function header_layout(state) { return toolbar_layout(state, undefined); }
    function items_layout(state, items, level) {
        return { column: items.map(function (o) { return item_layout(state, o, level); }) };
    }
    function item_layout(state, item, level) {
        if (level === void 0) { level = 0; }
        var column = [toolbar_layout(state, item)];
        var _a = item.childs, childs = _a === void 0 ? [] : _a;
        if (childs.length) {
            column.push(items_layout(state, item.childs, level + 1));
        }
        return { style: { marginRight: level === 0 ? 0 : 24 }, column: column };
    }
    function toolbar_layout(state, item) {
        var style = { marginBottom: 6 };
        if (!item) {
            style.background = 'lightblue';
            style.fontWeight = 'bold';
        }
        return {
            size: 36,
            style: style,
            row: [
                plus_layout(state, item),
                name_layout(state, item),
                { show: !item, html: <react_2.Icon path={js_1.mdiContentSave} size={1}/>, size: 36, align: 'vh' },
                { show: !!item, html: <react_2.Icon path={js_1.mdiDelete} size={0.8}/>, size: 36, align: 'vh' }
            ]
        };
    }
    function change(state, item, field, value) {
        item[field] = value;
        setState(state);
    }
    function add(state, parent) {
        var newItem = { id: 'cat' + Math.round(Math.random() * 100000000), name: '', childs: [] };
        if (!parent) {
            state.categories.push(newItem);
        }
        else {
            parent.childs = parent.childs || [];
            parent.childs.push(newItem);
        }
        setState(state);
    }
    function name_input(state, item) {
        if (!item) {
            return 'مدیریت دسته بندی';
        }
        var editId = state.editId, temp = state.temp, categories = state.categories;
        if (editId !== item.id) {
            return (<div style={{ border: 'none', background: 'none', width: '100%', height: '100%', padding: '0 12px' }} className='align-v' onClick={function () { return setState(__assign(__assign({}, state), { editId: item.id, temp: item.name })); }}>{item.name}</div>);
        }
        return (<input className='category-manager-input' type='text' value={temp} onBlur={function (e) { return change(categories, item, 'name', e.target.value); }} onChange={function (e) { return setState(__assign(__assign({}, state), { temp: e.target.value })); }}/>);
    }
    function name_layout(state, item) {
        return { flex: 1, html: name_input(state, item), style: { border: '1px solid #ddd', height: '100%' }, align: 'v' };
    }
    function plus_layout(state, item) {
        return { className: 'category-manmager-add', onClick: function () { return add(state, item); }, html: <react_2.Icon path={js_1.mdiPlusThick} size={0.8}/>, align: 'vh' };
    }
    return <react_virtual_dom_1.default layout={{ className: 'category-manager', column: [header_layout(state), items_layout(state, 0, undefined)] }}/>;
}
