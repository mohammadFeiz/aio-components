export function CssGenerator() {
    let res = '';
    res += getGenralCss();
    res += getMediaCss();
    res += getCursorCss();
    res += getScrollbarCss();
    res += getPaddingMarginCss();
    res += getBorderRadiusCss();
    res += getDistanceCss();
    res += getSizesCss();
    res += getColorsCss();
    res += getBordersCss();
    res += getFontSizeCss();
    res += getOverflowCss();
    res += getOpacityCss();
    res += getFlexCss();
    res += getWrapCss();
    res += getLoadingCss();
    res += getBackdropFilterCss();
    return res
}
function getGenralCss() {
    let res = '';
    res += `* {box-sizing: border-box;} button,input {font-family: inherit;}`
    res += `
        .fullscreen- {position: fixed !important;left: 0 !important;top: 0 !important;width: 100% !important;height: 100% !important;overflow: hidden;}
        .relative- {position: relative !important;}
        .absolute- {position: absolute !important;}
        .rtl- {direction: rtl !important;}
        .ltr- {direction: ltr !important;}
        .bold- {font-weight: bold !important;}
        .sel-off- {user-select: none !important;}
        .hide-scroll-::-webkit-scrollbar {width: 0px !important;height: 0px !important;}
        .no-spin-::-webkit-outer-spin-button,
        .no-spin-::-webkit-inner-spin-button {-webkit-appearance: none !important;margin: 0 !important;}
        .no-spin-[type=number] {-moz-appearance: textfield !important;}
        .b-b- {box-sizing: border-box !important;}
        .t-a-right- {text-align: right !important;}
        .t-a-left- {text-align: left !important;}
        .t-a-center- {text-align: center !important;}
        .resize-vh- {resize: both !important;}
        .resize-v- {resize: vertical !important;}
        .resize-h- {resize: horizontal !important;}
        .resize-none- {resize: none !important;}
        .ff-inh- {font-family: inherit !important;}
        .break-space- {white-space: break-space !important;}
        .text-rotate- {writing-mode: vertical-lr !important;}
    `
    return res
}
function getMediaCss() {
    let res = '';
    const mediaSizes = [768, 992, 1200];
    const mediaNames = ['xs', 'sm', 'md', 'lg']
    for (let i = 0; i < mediaNames.length; i++) {
        const s = mediaSizes[i];
        const n = mediaNames[i];
        if (i === 0) { res += `@media screen and (max-width: ${mediaSizes[0]}px) {.hide-${mediaNames[0]}- {display: none !important;}}` }
        else if (i === mediaNames.length - 1) { res += `@media screen and (min-width: ${s}px) {.hide-${n}- {display: none !important;}}` }
        else { res += `@media screen and (min-width: ${mediaSizes[i - 1]}px) and (max-width: ${mediaSizes[i]}px) {.hide-${n}- {display: none !important;}}` }
    }
    return res
}
function getCursorCss() {
    let res = '';
    const cursors = ['pointer', 'col-resize', 'row-resize', 'not-allowed']
    for (let x of cursors) { res += `.${x}- {cursor: ${x};}` }
    return res
}
function getScrollbarCss() {
    return `
*::-webkit-scrollbar {width: 10px !important;height: 10px !important;}
*::-webkit-scrollbar-track {background-color: transparent;}
*::-webkit-scrollbar-thumb {background-color: #cdd4e0;border-radius: 20px;border: 3px solid transparent;background-clip: content-box;}
*::-webkit-scrollbar-thumb {background-color: #b1b9ca;}
*::-webkit-scrollbar-thumb:hover {background-color: #6f7888;}
    `;
}
function getPaddingMarginCss() {
    const numbers = ['0', '3', '6', '8', '12', '16', '24', '36', '48', '60', '72', '84', 'none']
    let res = ''
    for (let n of numbers) {
        const val = n === 'none' ? n : n + 'px'
        res += `.p-${n}- {padding: ${val} !important;}`;
        res += `.p-t-${n}- {padding-top: ${val} !important;}`;
        res += `.p-b-${n}- {padding-bottom: ${val} !important;}`;
        res += `.p-l-${n}-,.ltr- .p-s-${n}-,.rtl- .p-e-${n}- {padding-left: ${val} !important;}`;
        res += `.p-r-${n}-,.ltr- .p-e-${n}-,.rtl- .p-s-${n}- {padding-right: ${val} !important;}`;
        res += `.p-h-${n}- {padding-left: ${n}px !important; padding-right: ${val} !important;}`;
        res += `.p-v-${n}- {padding-top: ${n}px !important; padding-bottom: ${val} !important;}`;
        res += `.m-${n}- {margin: ${val} !important;}`;
        res += `.m-t-${n}- {margin-top: ${val} !important;}`;
        res += `.m-b-${n}- {margin-bottom: ${val} !important;}`;
        res += `.m-l-${n}-,.ltr- .m-s-${n}-,.rtl- .m-e-${n}- {margin-left: ${val} !important;}`;
        res += `.m-r-${n}-,.ltr- .m-e-${n}-,.rtl- .m-s-${n}- {margin-right: ${val} !important;}`;
        res += `.m-h-${n}- {margin-left: ${n}px !important; margin-right: ${val} !important;}`;
        res += `.m-v-${n}- {margin-top: ${n}px !important; margin-bottom: ${val} !important;}`;
    }
    return res
}
function getBorderRadiusCss() {
    const numbers = ['0', '1', '2', '3', '4', '6', '8', '12', '16', '24', '36', '48']
    let res = ''
    for (let n of numbers) {
        res += `.br-${n}-{border-radius:${n}px !important;}`;
    }
    res += `.br-100{border-radius:100% !important;}`;
    res += `
        .br-b-0- {border-bottom-left-radius: 0;border-bottom-right-radius: 0;}
        .br-t-0- {border-top-left-radius: 0;border-top-right-radius: 0;}
        .br-l-0- {border-top-left-radius: 0;border-bottom-left-radius: 0;}
        .br-r-0- {border-top-right-radius: 0;border-bottom-right-radius: 0;}
    `
    return res
}
function getDistanceCss() {
    const numbers = ['0', '1', '2', '3', '4', '6', '8', '12', '16', '24', '36', '48', '60', '72', '84', '96', '108', '120', '132', '144', '156', '168', '180', '192', '204', '216', '228', '240', '252', '264', '276', '288', '300', 'none']
    let res = ''
    for (let n of numbers) {
        const val = n === 'none' ? 'unset' : n + 'px'
        res += `.t-${n}-{top:${val} !important;}`;
        res += `.b-${n}-{bottom:${val} !important;}`;
        res += `.l-${n}-{left:${val} !important;}`;
        res += `.r-${n}-{right:${val} !important;}`;
        res += `.gap-${n}-{gap:${val} !important}`
    }
    const percents = ['0', '5', '10', '15', '20', '25', '30', '33', '40', '50', '60', '66', '70', '75', '80', '90', '100']
    for (let n of percents) {
        const val = n + '%'
        res += `.t-p${n}-{top:${val} !important;}`;
        res += `.b-p${n}-{bottom:${val} !important;}`;
        res += `.l-p${n}-{left:${val} !important;}`;
        res += `.r-p${n}-{right:${val} !important;}`;
    }
    return res
}
function getSizesCss() {
    const numbers = ['0', '1', '2', '3', '4', '6', '8', '12', '16', '24', '36', '48', '60', '72', '84', '96', '108', '120', '132', '144', '156', '168', '180', '192', '204', '216', '228', '240', '252', '264', '276', '288', '300', 'none']
    let res = ''
    for (let n of numbers) {
        const val = n === 'none' ? 'unset' : n + 'px'
        res += `.h-${n}-{height:${val} !important;}`;
        res += `.w-${n}-{width:${val} !important;}`;
    }
    const percents = ['0', '5', '10', '15', '20', '25', '30', '33', '40', '50', '60', '66', '70', '75', '80', '90', '100']
    for (let n of percents) {
        const val = n + '%'
        res += `.w-p${n}-{width:${val} !important;}`;
        res += `.h-p${n}-{height:${val} !important;}`;
    }
    res += `.w-100-{width:100% !important;}`;
    res += `.h-100-{height:100% !important;}`;
    res += `.w-fit-{width:fit-content !important;}`;
    res += `.h-fit-{height:fit-content !important;}`;
    return res
}
function getFontSizeCss() {
    const numbers = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '36', '48', '60']
    let res = ''
    for (let n of numbers) {
        const val = n + 'px'
        res += `.fs-${n}-{font-size:${val} !important;}`;
    }
    const percents = ['50', '55', '60', '65', '70', '75', '80', '85', '90', '95', '100']
    for (let n of percents) {
        const val = n + '%'
        res += `.fs-p${n}-{font-size:${val} !important;}`;
    }
    return res
}
function getColorsCss() {
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', 'none']
    let res = ''
    for (let n of numbers) {
        const val = n === 'none' ? 'none' : `rgb(${n},${n},${n})`
        res += `.bg-${n}-{background:${val} !important;}`;
        res += `.c-${n}-{color:${val} !important;}`;
    }
    const percents = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95', '100']
    for (let n of percents) {
        res += `.bg-l-${n}-{background:rgba(255, 255, 255, .${n}) !important;}`;
        res += `.bg-d-${n}-{background:rgba(0, 0, 0, .${n}) !important;}`;
        res += `.c-l-${n}-{color:rgba(255, 255, 255, .${n}) !important;}`;
        res += `.c-d-${n}-{color:rgba(0, 0, 0, .${n}) !important;}`;
    }
    res += `.c-inh-{color:inherit !important;}`;
    res += `.bg-inh-{background:inherit !important;}`;
    return res
}
function getBordersCss() {
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']
    let res = ''
    for (let n of numbers) {
        const val = n === 'none' ? 'none' : `1px solid rgb(${n},${n},${n})`;
        res += `.brd-c-${n}-{border:${val} !important;}`;
    }
    const withes = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12']
    for (let n of withes) {
        res += `.brd-w-${n}- {border-width: ${n}px !important;}`;
    }
    res += `.brd-none- {border: none !important}`;
    res += `.brd-dashed- {border-style: dashed !important;}`;
    res += `.brd-dotted- {border-style: dotted !important;}`;
    res += `.brd-l-0- {border-left: none !important;}`;
    res += `.brd-r-0- {border-right: none !important}`;
    res += `.brd-t-0- {border-top: none !important;}`;
    res += `.brd-b-0- {border-bottom: none !important;}`;
    res += `.brd-l- {border-top: none !important;border-right: none !important;border-bottom: none !important;}`;
    res += `.brd-r- {border-left: none !important;border-top: none !important;border-bottom: none !important;}`;
    res += `.brd-t- {border-left: none !important;border-right: none !important;border-bottom: none !important;}`;
    res += `.brd-b- {border-left: none !important;border-top: none !important;border-right: none !important;}`;
    return res
}
function getOverflowCss(){
    let res = ''
    const as = ['','x','y'];
    const bs = ['visible','hidden','auto']
    for(let a of as){
        for(let b of bs){
            res += `.of${a}-${b}- {overflow${a?'-' + a:''}: ${b};}`
        }    
    }
    return res
}
function getOpacityCss() {
    const numbers = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55','60','65','70','75','80','85','90','95','100']
    let res = ''
    for (let n of numbers) {
        let val = '';
        if(n === '0'){val = '0'}
        else if(n === '100'){val = '1'}
        else if(n === '5'){val = '0.05'}
        else if(n[1] === '0'){val = n[0]}
        res += `.op-${n}-{opacity:${val} !important;}`;
    }
    return res
}
function getFlexCss() {
    let res = ''
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11','12']
    for (let n of numbers) {
        res += `.flex-${n}-{flex:${n} !important;}`;
    }
    res += `
        .flex-row- {display: flex;}
        .flex-col- {display: flex;flex-direction: column}
        .flex-row-.align-v-,.flex-col-.align-h- {display: flex !important;align-items: center !important;}
        .flex-row-.align-h-,.flex-col-.align-v- {display: flex !important;justify-content: center !important;}
        .flex-col-.align-h-,.flex-row-.align-v- {display: flex !important;align-items: center !important;}
        .align-v-h {display: flex !important;align-items: center !important;justify-content: center !important;}
        .flex-row-.align-h-end-,.flex-col-.align-v-end- {display: flex !important;justify-content: flex-end !important;}
        .flex-col-.align-h-end-,.flex-row-.align-v-end- {display: flex !important;align-items: flex-end !important;}
        .flex-row-.align-between- {display: flex !important;justify-content: space-between !important;}
        .flex-row-.align-around- {display: flex !important;justify-content: space-around !important;}
        .flex-row-.align-evenly- {display: flex !important;justify-content: space-evenly !important;}
        .shrink-0- {flex-shrink: 0 !important;}
    `
    return res
}

function getWrapCss(){
    return `
        .wrap- {flex-wrap: wrap !important;white-space: wrap !important;}
        .nowrap- {flex-wrap: nowrap !important;white-space: nowrap !important;}
        .wrap-reverse- {flex-wrap: wrap-reverse !important;}
    `
}
function getLoadingCss(){
    return `
        .loading- {background: #fff;color: transparent !important;}
        .loading- * {text-decoration: none !important;}
        .loading- .load-item- {
            background: linear-gradient(90deg, #eee, #eee, #eee, #eee, #fff, #eee, #eee, #eee, #eee) !important;
            background-size: 600% 600% !important;
            animation: loading 1.4s linear !important;
            animation-iteration-count: infinite !important;
            animation-timing-function: ease-in-out !important;
            animation-direction: normal !important;
            animation-fill-mode: forwards !important;
            border-radius: 8px !important;
            color: transparent !important;
        }
        .loading- .load-item-text- {max-height: 16px !important;}
        .loading- .load-item-text- * {color: transparent !important}
        .loading- .load-item-padding- {padding: 12px !important;}
        .loading- .load-item-border- {border: 1px solid #eee !important;}
        @keyframes loading {
            0% {background-position: 0% 0%}
            100% {background-position: 100% 0%}
        }
        .rotate-card- {
            transform: rotateX(180deg) !important;
            opacity: 0 !important;
        }

        .rotate-card.mounted- {
            transform: rotateX(0deg) !important;
            opacity: 1 !important;
            transition: 1s !important;
        }
    `
}
function getBackdropFilterCss() {
    let res = ''
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11','12']
    for (let n of numbers) {
        res += `.bf-${n}-{backdrop-filter:blur${n}px !important;}`;
    }
    return res
}