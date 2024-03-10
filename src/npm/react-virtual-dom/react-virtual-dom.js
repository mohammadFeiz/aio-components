import ReactVirtualDom,{
    animate as _animate,
    renderCards as _renderCards,
    renderCardsRow as _renderCardsRow,
    renderCard as _renderCard,
} from './index.tsx';
export default ReactVirtualDom ;
export function animate(type,selector, callback){return _animate(type,selector, callback)}
export function renderCards({ items, gap, attrs }) {return _renderCards({ items, gap, attrs })}
export function renderCardsRow(rows, gap) {return _renderCardsRow(rows, gap)}
export function renderCard({ text, subtext, uptext, attrs, before, after, header, footer, justify,classes }) {
    return _renderCard({ text, subtext, uptext, attrs, before, after, header, footer, justify,classes })
}