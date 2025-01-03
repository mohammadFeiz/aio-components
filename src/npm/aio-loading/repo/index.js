function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import './index.css';
export default class AIOLoading {
  constructor(loader) {
    _defineProperty(this, "loader", '0');
    _defineProperty(this, "getLoader_0", () => {
      return `
            <div class="aio-loading-container-0">
                <div class="aio-loading-0">
                    ${new Array(5).fill(0).map((o, i) => this.getLoaderItem_0(`0.${i}`))}
                </div>
            </div>
        `;
    });
    _defineProperty(this, "getLoaderItem_0", ease => {
      return `<div class="aio-loading-item-0" style="animation: 1s ease-in-out ${ease}s infinite normal none running aioloading0;"></div>`;
    });
    _defineProperty(this, "getLoader", id => {
      let content = '';
      if (this.loader === '0') {
        content = this.getLoader_0();
      } else if (typeof this.loader === 'string') {
        content = this.loader;
      }
      return `<div class="aio-loading" id="aio-loading-${id}">${content}</div>`;
    });
    _defineProperty(this, "show", (id, parentSelector) => {
      parentSelector = parentSelector || 'body';
      let loadingStr = this.getLoader(id);
      let parent = document.querySelector(parentSelector);
      if (parent) {
        parent.insertAdjacentHTML('beforeend', loadingStr);
      }
    });
    _defineProperty(this, "hide", id => {
      let loadingDom = document.getElementById('aio-loading-' + id);
      if (!loadingDom) {
        loadingDom = document.querySelector('.aio-loading');
      }
      if (loadingDom) {
        loadingDom.remove();
      }
    });
    if (typeof loader === 'string') {
      this.loader = loader;
    }
  }
}