import './index.css';
export default class AIOLoading {
    loader: any;
    constructor(loader?: string);
    private getLoader_0;
    private getLoaderItem_0;
    getLoader: (id: string) => string;
    show: (id: string, parentSelector?: string) => void;
    hide: (id: string) => void;
}
