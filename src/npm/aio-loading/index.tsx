import './index.css';
export default class AIOLoading {
    loader:any = '0';
    constructor(loader?:string){
        if(typeof loader === 'string'){this.loader = loader}
    }
    private getLoader_0 = () => {
        return (`
            <div class="aio-loading-container-0">
                <div class="aio-loading-0">
                    ${new Array(5).fill(0).map((o,i)=>this.getLoaderItem_0(`0.${i}`)).join(' ')}
                </div>
            </div>
        `)
    }
    private getLoaderItem_0 = (ease:string)=>{
        return `<div class="aio-loading-item-0" style="animation: 1s ease-in-out ${ease}s infinite normal none running aioloading0;"></div>`
    }
    getLoader = (id:string)=>{
        let content = ''
        if(this.loader === '0'){content = this.getLoader_0()}
        else if (typeof this.loader === 'string'){content = this.loader}
        return (`<div class="aio-loading" id="aio-loading-${id}">${content}</div>`)
    }
    show = (id:string, parentSelector?:string) => {
        parentSelector = parentSelector || 'body'
        let loadingStr = this.getLoader(id);
        let parent = document.querySelector(parentSelector);
        if (parent) {parent.insertAdjacentHTML('beforeend', loadingStr);}
    }
    hide = (id:string) => {
        let loadingDom = document.getElementById('aio-loading-' + id);
        if (!loadingDom) {loadingDom = document.querySelector('.aio-loading');}
        if (loadingDom) {loadingDom.remove();}
    }
}