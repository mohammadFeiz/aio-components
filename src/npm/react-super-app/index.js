"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var index_tsx_1 = require("../aio-utils/index.tsx");
var react_2 = require("@mdi/react");
var js_1 = require("@mdi/js");
var index_tsx_2 = require("../react-virtual-dom/index.tsx");
var index_tsx_3 = require("./../../npm/aio-popup/index.tsx");
require("./index.css");
var RSA = /** @class */ (function () {
    function RSA(props) {
        var _this = this;
        RSAValidate(props || {});
        var rtl = props.rtl;
        this.rootProps = props;
        this.backButtonCallBack = true;
        this.popup = new index_tsx_3.default({ rtl: rtl });
        this.removeModal = function (obj) { return _this.popup.removeModal(obj); };
        this.addModal = function (obj) { return _this.popup.addModal(obj); };
        this.setBackButtonCallBack = function (backButtonCallBack) { return _this.backButtonCallBack = backButtonCallBack; };
        this.getNavId = function () { return ''; };
        this.closeSide = function () { };
        this.setNavId = function () { };
        this.openSide = function () { };
        this.render = function () { return <ReactSuperApp rootProps={_this.rootProps} popup={_this.popup} getActions={function (_a) {
                var getNavId = _a.getNavId, setNavId = _a.setNavId, openSide = _a.openSide, closeSide = _a.closeSide;
                _this.getNavId = getNavId;
                _this.setNavId = setNavId;
                _this.openSide = openSide;
                _this.closeSide = closeSide;
            }}/>; };
        this.addAlert = function (obj) { return _this.popup.addAlert(obj); };
        this.addSnackebar = function (obj) { return _this.popup.addSnackebar(obj); };
        this.addConfirm = function (obj) { return _this.popup.addConfirm(obj); };
        this.addPrompt = function (obj) { return _this.popup.addPrompt(obj); };
        window.history.pushState({}, '');
        window.onpopstate = function () {
            setTimeout(function () { return window.history.pushState({}, ''); }, 100);
            try {
                if (_this.backButtonCallBack === true) {
                    _this.removeModal();
                }
                else if (typeof _this.backButtonCallBack === 'function') {
                    _this.backButtonCallBack();
                }
            }
            catch (_a) { }
        };
    }
    return RSA;
}());
exports.default = RSA;
function ReactSuperApp(props) {
    var rootProps = props.rootProps, getActions = props.getActions, popup = props.popup;
    var splash = rootProps.splash, _a = rootProps.splashTime, splashTime = _a === void 0 ? 7000 : _a, id = rootProps.id, nav = rootProps.nav, header = rootProps.header, headerContent = rootProps.headerContent, side = rootProps.side, title = rootProps.title, _b = rootProps.subtitle, subtitle = _b === void 0 ? function () { return ''; } : _b, rtl = rootProps.rtl, cls = rootProps.className, body = rootProps.body, maxWidth = rootProps.maxWidth;
    var _c = (0, react_1.useState)(!!splash), showSplash = _c[0], setShowSplash = _c[1];
    var storage = (0, react_1.useState)(new index_tsx_1.Storage('rsa-cache-' + id))[0];
    var navItems = typeof nav.items === 'function' ? nav.items() : nav.items;
    var _d = (0, react_1.useState)(false), navId = _d[0], SETNAVID = _d[1];
    (0, react_1.useEffect)(function () {
        var navId = (nav.cache ? initNavId(storage.load('navId', initNavId())) : initNavId());
        SETNAVID(navId);
        if (splash) {
            setTimeout(function () { return setShowSplash(false); }, splashTime);
        }
        getActions({ openSide: openSide, closeSide: closeSide, setNavId: setNavId, getNavId: getNavId });
    }, []);
    function initNavId(id) {
        if (id) {
            if (getNavById(id) !== false) {
                return id;
            }
        }
        if (nav.id) {
            if (getNavById(nav.id) !== false) {
                return nav.id;
            }
        }
        return navItems.filter(function (_a) {
            var _b = _a.show, show = _b === void 0 ? function () { return true; } : _b;
            return show();
        })[0].id;
    }
    function getNavId() { return navId; }
    function setNavId(navId) {
        if (nav.cache) {
            storage.save('navId', navId);
        }
        SETNAVID(navId);
    }
    function header_node(activeNav) {
        var Header = typeof header === 'function' ? header() : header;
        if (Header === false) {
            return {};
        }
        if (Header) {
            return { style: { flex: 'none', width: '100%' }, className: 'rsa-header of-visible align-v', html: Header };
        }
        var Title;
        if (activeNav === false) {
            Title = '';
        }
        else {
            if (title) {
                Title = title(activeNav);
            }
            else {
                if (typeof activeNav.text === 'function') {
                    Title = activeNav.text();
                }
                else {
                    Title = activeNav.text;
                }
            }
        }
        var Subtitle = subtitle(nav);
        if (!Title && !side && !headerContent) {
            return {};
        }
        return {
            style: { flex: 'none' }, className: 'rsa-header of-visible align-v w-100',
            row: [
                { size: 60, show: !!side, html: <react_2.Icon path={js_1.mdiMenu} size={1}/>, className: 'align-vh', onClick: function () { return openSide(); } },
                {
                    show: !!Title,
                    column: [
                        { html: Title, className: 'rsa-header-title' },
                        { show: !!Subtitle, html: Subtitle, className: 'rsa-header-subtitle' }
                    ]
                },
                { show: !!title || !!side, flex: 1 },
                { flex: !!title || !!side ? undefined : 1, show: !!headerContent, html: function () { return headerContent(); }, className: 'of-visible' },
            ]
        };
    }
    var navResult = false;
    function getNavById(id) {
        navResult = false;
        getNavById_req(navItems, id);
        return navResult;
    }
    function getNavById_req(items, id) {
        if (navResult) {
            return;
        }
        for (var i = 0; i < items.length; i++) {
            if (navResult) {
                return;
            }
            var item = items[i];
            var _a = item.show, show = _a === void 0 ? function () { return true; } : _a;
            if (!show()) {
                continue;
            }
            if (item.id === id) {
                navResult = item;
                break;
            }
            var navItems_1 = item.items;
            if (navItems_1) {
                getNavById_req(navItems_1, id);
            }
        }
    }
    function navigation_node(type) {
        if (!nav || !navItems || !navItems.length || navId === false) {
            return {};
        }
        var props = { nav: nav, navId: navId, setNavId: setNavId, type: type, rtl: !!rtl, navItems: navItems };
        return { className: 'of-visible' + (type === 'bottom' ? ' rsa-bottom-menu-container' : ''), html: (<Navigation {...props} navItems={navItems}/>) };
    }
    function page_node(navItem) {
        var content = body(navItem);
        var activeNav = typeof navId === 'string' ? getNavById(navId) : false;
        return {
            flex: 1,
            column: [
                header_node(activeNav),
                { flex: 1, html: <div className='rsa-body'>{content}</div> },
                navigation_node('bottom')
            ]
        };
    }
    function renderMain() {
        if (typeof navId !== 'string') {
            return null;
        }
        var navItem = getNavById(navId);
        var className = 'rsa-main';
        className += cls ? ' ' + cls : '';
        className += rtl ? ' rtl' : ' ltr';
        var rootNode = { className: className };
        rootNode.row = [navigation_node('side'), page_node(navItem)];
        return (<index_tsx_2.default rootNode={rootNode}/>);
    }
    function openSide() {
        popup.addModal({
            position: rtl ? 'right' : 'left', id: 'rsadefaultsidemodal',
            setAttrs: function (key) { if (key === 'backdrop') {
                return { className: 'rsa-sidemenu-backdrop' };
            } },
            body: function (_a) {
                var close = _a.close;
                return renderSide(close);
            },
        });
    }
    function closeSide() { popup.removeModal('rsadefaultsidemodal'); }
    function renderSide(close) {
        if (!side) {
            return null;
        }
        var items = typeof side.items === 'function' ? side.items() : side.items;
        var props = __assign(__assign({}, side), { attrs: side.attrs, items: items, onClose: function () { return close(); } });
        return <SideMenu {...props}/>;
    }
    return (<div className={"rvd-container ai rsa-container" + (cls ? ' ' + cls : '')} style={{ direction: rtl ? 'rtl' : 'ltr' }}>
      <div className='rsa' style={{ maxWidth: maxWidth }}>
        {renderMain()}
        {popup.render()}
        {showSplash && !!splash && splash()}
      </div>
    </div>);
}
function Navigation(props) {
    var nav = props.nav, navId = props.navId, setNavId = props.setNavId, rtl = props.rtl, navItems = props.navItems, type = props.type;
    var _a = (0, react_1.useState)({}), openDic = _a[0], setOpenDic = _a[1];
    function header_node() {
        if (!nav.header) {
            return { size: 12 };
        }
        return { html: nav.header() };
    }
    function footer_node() {
        if (!nav.footer) {
            return { size: 12 };
        }
        return { html: nav.footer() };
    }
    function items_node(navItems, level) {
        return {
            flex: 1, className: 'ofy-auto',
            column: navItems.filter(function (_a) {
                var _b = _a.show, show = _b === void 0 ? function () { return true; } : _b;
                return show();
            }).map(function (o, i) {
                if (o.items) {
                    var open_1 = openDic[o.id] === undefined ? true : openDic[o.id];
                    var column = [item_node(o, level)];
                    if (open_1) {
                        column.push(items_node(o.items, level + 1));
                    }
                    return { column: column };
                }
                return item_node(o, level);
            })
        };
    }
    function toggle(id) {
        var _a;
        var open = openDic[id] === undefined ? true : openDic[id];
        setOpenDic(__assign(__assign({}, openDic), (_a = {}, _a[id] = !open, _a)));
    }
    function text_node(navItem, type) {
        var text = navItem.text, marquee = navItem.marquee;
        text = typeof text === 'function' ? text() : text;
        var html;
        if (!marquee) {
            html = text;
        }
        else {
            html = <marquee behavior='scroll' scrollamount={3} direction='right'>{text}</marquee>;
        }
        if (type === 'side') {
            return { html: html, className: 'align-v' };
        }
        if (type === 'bottom') {
            return { html: html, className: 'rsa-bottom-menu-item-text align-vh' };
        }
        return {};
    }
    function item_node(o, level) {
        if (level === void 0) { level = 0; }
        var id = o.id, icon = o.icon, items = o.items, disabled = o.disabled;
        var active = id === navId;
        var open = openDic[id] === undefined ? true : openDic[id];
        return {
            className: 'rsa-navigation-item' + (active ? ' active' : ''), onClick: disabled ? undefined : function () { return items ? toggle(id) : setNavId(id); },
            row: [
                { size: level * 16 },
                { show: nav.nested === true, size: 24, html: items ? <react_2.Icon path={open ? js_1.mdiChevronDown : (rtl ? js_1.mdiChevronLeft : js_1.mdiChevronRight)} size={1}/> : '', className: 'align-vh' },
                { show: !!icon, size: 48, html: function () { return typeof icon === 'function' ? icon() : icon; }, className: 'align-vh' },
                text_node(o, 'side')
            ]
        };
    }
    function bottomMenu_node(o) {
        var icon = o.icon, id = o.id, disabled = o.disabled;
        var active = id === navId;
        return {
            flex: 1, className: 'rsa-bottom-menu-item of-visible' + (active ? ' active' : ''), onClick: disabled ? undefined : function () { return setNavId(id); },
            column: [
                { show: !icon, flex: 1 },
                { show: !!icon, flex: 2 },
                { show: !!icon, html: function () { return typeof icon === 'function' ? icon() : icon; }, className: 'of-visible rsa-bottom-menu-item-icon align-vh' },
                { show: !!icon, flex: 1 },
                text_node(o, 'bottom'),
                { flex: 1 }
            ]
        };
    }
    if (type === 'bottom') {
        return (<index_tsx_2.default rootNode={{ className: 'rsa-bottom-menu', hide_sm: true, hide_md: true, hide_lg: true, row: navItems.filter(function (_a) {
                var _b = _a.show, show = _b === void 0 ? function () { return true; } : _b;
                return show();
            }).map(function (o) { return bottomMenu_node(o); }) }}/>);
    }
    return (<index_tsx_2.default rootNode={{ hide_xs: true, className: 'rsa-navigation', column: [header_node(), items_node(navItems, 0), footer_node()] }}/>);
}
function SideMenu(props) {
    var _a = props.attrs, attrs = _a === void 0 ? {} : _a, header = props.header, items = props.items, onClose = props.onClose, footer = props.footer;
    function header_node() {
        if (!header) {
            return {};
        }
        return { html: header(), className: 'rsa-sidemenu-header' };
    }
    function items_node() {
        return {
            flex: 1,
            column: items.map(function (o, i) {
                var _a = o.icon, icon = _a === void 0 ? function () { return <div style={{ width: 12 }}></div>; } : _a, text = o.text, _b = o.attrs, attrs = _b === void 0 ? {} : _b, _c = o.onClick, onClick = _c === void 0 ? function () { } : _c, _d = o.show, show = _d === void 0 ? function () { return true; } : _d;
                var Show = show();
                return {
                    style: attrs.style,
                    show: Show !== false, size: 36, className: 'rsa-sidemenu-item' + (attrs.className ? ' ' + attrs.className : ''), onClick: function () { onClick(o); onClose(); },
                    row: [
                        { size: 48, html: typeof icon === 'function' ? icon() : icon, className: 'align-vh' },
                        { html: text, className: 'align-v' }
                    ]
                };
            })
        };
    }
    function footer_node() {
        if (!footer) {
            return {};
        }
        return { html: footer(), className: 'rsa-sidemenu-footer' };
    }
    return (<index_tsx_2.default rootNode={{
            attrs: attrs,
            className: 'rsa-sidemenu' + (attrs.className ? ' ' + attrs.className : ''),
            column: [header_node(), items_node(), footer_node()]
        }}/>);
}
var RSANavInterface = "\n{\n  id?:string,\n  items:[],\n  header?:()=>React.ReactNode,\n  footer?:()=>React.ReactNode,\n  cache?:boolean,\n  disabled?:boolean\n}\n";
var RSANavItemInterface = "\n{\n  id:string,\n  text:string | ()=>string,\n  icon?:React.ReactNode || ()=>React.ReactNode,\n  items?:[],\n  show?:()=>boolean\n}\n";
function RSAValidate(props) {
    var error = RSAValidateError(props);
    if (error) {
        alert(error);
    }
}
function RSAValidateError(props) {
    var validProps = ['id', 'rtl', 'title', 'nav', 'subtitle', 'body', 'header', 'headerContent', 'maxWidth', 'side', 'theme'];
    for (var prop in props) {
        if (validProps.indexOf(prop) === -1) {
            return "\n        react-super-app error => invalid props (".concat(prop, "). \n        valid properties are 'id','rtl','title','nav','subtitle','body','header','headerContent','maxWidth','side','theme'\n      ");
        }
    }
    if (props.rtl !== undefined && typeof props.rtl !== 'boolean') {
        return "\n        react-super-app error => rtl props should be boolean. \n      ";
    }
    if (!props.id || typeof props.id !== 'string') {
        return "\n        react-super-app error => id props should be an string but is ".concat(props.id, ". \n      ");
    }
    if (props.title !== undefined && typeof props.title !== 'function') {
        return "\n        react-super-app error => title props should be a functon that get nav item as parameter and returns string. \n      ";
    }
    if (props.subtitle !== undefined && typeof props.subtitle !== 'function') {
        return "\n        react-super-app error => subtitle props should be a functon that get nav item as parameter and returns string. \n      ";
    }
    if (props.headerContent !== undefined && typeof props.headerContent !== 'function') {
        return "\n      react-super-app error => headerContent props should be a functon that returns html. \n    ";
    }
    if (typeof props.body !== 'function') {
        return "\n        react-super-app error => body props should be a funtion that returns html. \n      ";
    }
    var navError = RSAValidateNav(props.nav);
    if (navError) {
        return navError;
    }
    var sideError = RSAValidateSide(props.side);
    if (sideError) {
        return sideError;
    }
}
function RSAValidateSide(side) {
    //type I_Sidemenu_props = {items:I_SideMenu_props_item[],header:()=>React.ReactNode,footer:()=>React.ReactNode,attrs:object}
    //type I_SideMene_props_item = {icon?:React.ReactNode | ()=>React.ReactNode,text:String,className?:String,style?:Object,onClick?:()=>void,show?:()=>boolean}
    if (!side) {
        return;
    }
    var side_validProps = ['items', 'header', 'footer', 'attrs'];
    for (var prop in side) {
        if (side_validProps.indexOf(prop) === -1) {
            return "\n        react-super-app error => invalid side property (".concat(prop, "). \n        valid side properties are 'items','header','footer','attrs'\n      ");
        }
    }
    var sideItemError = 'each side item should be an object cointan {icon?:React.ReactNode | ()=>React.ReactNode,text:String,attrs?:object,show?:()=>boolean,onClick:function|undefined}';
    if (!side.items || (!Array.isArray(side.items) && typeof side.items !== 'function')) {
        return "\n      react-super-app error => side.items should be an array of objects or function that returns array of objects \n      ".concat(sideItemError, "\n    ");
    }
    for (var i = 0; i < side.items.length; i++) {
        var I = side.items;
        var items = typeof I === 'function' ? I() : I;
        var item = items[i];
        var text = item.text, _a = item.show, show = _a === void 0 ? function () { return true; } : _a, _b = item.attrs, attrs = _b === void 0 ? {} : _b;
        var sideItem_validProps = ['text', 'icon', 'attrs', 'show', 'onClick'];
        for (var prop in item) {
            if (sideItem_validProps.indexOf(prop) === -1) {
                return "\n          react-super-app error => side.items[".concat(i, "].").concat(prop, " is not a valid side item property.\n          ").concat(sideItemError, "\n        ");
            }
        }
        if (typeof show !== 'function') {
            return "\n        react-super-app error => side.items[".concat(i, "].show should be a function that returns boolean.\n        ").concat(sideItemError, "\n      ");
        }
        if (typeof attrs !== 'object' || Array.isArray(attrs)) {
            return "\n        react-super-app error => side.items[".concat(i, "].attrs should be an object contain dom attributes.\n        ").concat(sideItemError, "\n      ");
        }
        if (!text || typeof text !== 'string') {
            return "react-super-app error => side.items[".concat(i, "].text should be an string");
        }
    }
}
function RSAValidateNav(nav) {
    if (typeof nav !== 'object' || Array.isArray(nav)) {
        return "\n      react-super-app error => nav props should be an object contain ".concat(RSANavInterface, ".\n      each nav item should be an object contain ").concat(RSANavItemInterface, "\n    ");
    }
    var nav_validProps = ['id', 'items', 'header', 'footer', 'cache', 'nested'];
    for (var prop in nav) {
        if (nav_validProps.indexOf(prop) === -1) {
            return "\n        react-super-app error => invalid nav property (".concat(prop, "). \n        valid nav properties are ").concat(nav_validProps.join(' - '), "\n      ");
        }
    }
    if (nav.id && typeof nav.id !== 'string') {
        return "react-super-app error => exist nav.id should be an string";
    }
    if (!nav.items || typeof nav.items !== 'function') {
        return "\n    react-super-app error => nav.items should be a function that returns array of nav items.\n    each nav item type is:\n    ".concat(RSANavItemInterface, "\n  ");
    }
    var navItems = typeof nav.items === 'function' ? nav.items() : nav.items;
    var itemsError = RSAValidateNavItems(navItems || []);
    if (itemsError) {
        return itemsError;
    }
}
function RSAValidateNavItems(items, path) {
    path = path || 'nav';
    items = items || [];
    var navItemError = "\n    nav item should be an object contain \n    ".concat(RSANavItemInterface, "\n  ");
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var id = item.id, text = item.text, _a = item.show, show = _a === void 0 ? function () { return true; } : _a, render = item.render;
        var usedIds = [];
        var navItem_validProps = ['id', 'items', 'icon', 'show', 'text', 'render', 'disabled'];
        for (var prop in item) {
            if (navItem_validProps.indexOf(prop) === -1) {
                return "\n          react-super-app error => ".concat(path, ".items[").concat(i, "].").concat(prop, " is not a valid nav item property.\n          ").concat(navItemError, "\n        ");
            }
        }
        if (render && typeof render !== 'function') {
            return "\n        react-super-app error => ".concat(path, ".items[").concat(i, "].render should be a function that returns html.\n        ").concat(navItemError, "\n      ");
        }
        if (typeof show !== 'function') {
            return "\n        react-super-app error => ".concat(path, ".items[").concat(i, "].show should be a function that returns boolean.\n        ").concat(navItemError, "\n      ");
        }
        if (!id || typeof id !== 'string') {
            return "\n        react-super-app error => ".concat(path, ".items[").concat(i, "].id should be an string.\n        ").concat(navItemError, "\n      ");
        }
        if (usedIds.indexOf(id) !== -1) {
            return "\n        react-super-app error => ".concat(path, ".items[").concat(i, "].id is duplicate.\n        ").concat(navItemError, "\n      ");
        }
        usedIds.push(item.id);
        if (!text || typeof text !== 'string') {
            return "react-super-app error => ".concat(path, ".items[").concat(i, "].text should be an string");
        }
        var ITEMS = item.items || [];
        var itemsError = RSAValidateNavItems(ITEMS, path + ".items[".concat(i, "]"));
        if (itemsError) {
            return itemsError;
        }
    }
}
