import { createRef, FC, ReactNode, useEffect, useState } from "react";
import $ from 'jquery';
import './index.css';
type I_Beenet = { gap: number, rowCount: number, colCount: number, className?: string, getHtml: (className: string,size:number) => ReactNode, onClick?: (className: string) => void }
const Beenet: FC<I_Beenet> = (props) => {
    const [calc, setCalc] = useState<any>();
    let [tm] = useState<any>();
    const [ref] = useState<any>(createRef());
    function getCalc() {
        const containerSize = getContainerSize();
        const size = getSizeByRowCount(containerSize[0]);
        const rect = [size, 2 * Math.sqrt(((3 / 2) * Math.pow(size, 2)) / 2)];
        const gapDelta = getGapDelta();
        const rowDistance = 3 * rect[0] + 2 * gapDelta[0];
        const nearDelta = [1.5 * rect[0], rect[1] / 2 + gapDelta[1] / 2];
        return {rect,gapDelta,containerSize,rowDistance,nearDelta};
    }
    function getContainerSize(): [number, number] {
        const container: any = $(ref.current);
        const res: [number, number] = [container.width(), container.height()];
        return res;
    }
    function getGapDelta(): [number, number] { return [props.gap / Math.sin((30 * Math.PI) / 180), (props.gap / Math.sin((60 * Math.PI) / 180)) * 2]; }
    function getSizeByRowCount(containerWidth:number): number {
        const gapDelta = getGapDelta();
        const sizeCount = props.rowCount * 2 - (props.rowCount - 1) / 2;
        const totalGap = (props.rowCount - 1) * gapDelta[0];
        return (containerWidth - totalGap) / sizeCount;
    }
    function resize() {
        clearTimeout(tm);
        tm = setTimeout(() => {console.log('resize'); setCalc(getCalc());}, 500);
    }
    function row_layout(rowIndex: number) {
        const left = rowIndex % 2 === 0 ? 2.5 * calc.rect[0] + calc.gapDelta[0] : calc.rect[0];
        const top = rowIndex * calc.nearDelta[1] + calc.rect[1] / 2;
        const rowLength = ((props.rowCount + 1) / 2) - (rowIndex % 2 === 0 ? 1 : 0);
        return (
            <div style={{ position: 'absolute', left, top }}>
                {new Array(rowLength).fill(0).map((o, colIndex) => cell_layout(rowIndex,colIndex))}
            </div>
        );
    }
    function cell_layout(rowIndex:number,colIndex:number) {
        const className = `beenet-item-${rowIndex}-${colIndex}`;
        return (
            <div className={`beenet-item ${className}`} style={{ left:colIndex * calc.rowDistance }} onClick={() => {if(props.onClick)props.onClick(className)}}>
                {rect_layout(0)} {rect_layout(60)} {rect_layout(-60)}
                <div className="beenet-item-html" style={{ minWidth: calc.rect[0] * 1.4, minHeight: calc.rect[0] * 1.4 }}>{props.getHtml(className,calc.rect[0])}</div>
            </div>
        );
    }
    function rect_layout(deg:number){
        const s = {width: calc.rect[0],height: calc.rect[1],top: `calc(50% - ${calc.rect[1] / 2}px)`,left: `calc(50% - ${calc.rect[0] / 2}px)`};
        return (<div className="beenet-item" style={{ ...s, transform: `rotate(${deg}deg)` }}></div>)
    }
    useEffect(() => {
        window.addEventListener('resize', resize);
        setCalc(getCalc());
        console.log('resize');
    }, []);
    return (
        <div ref={ref} className={`beenet${props.className ? ' ' + props.className : ''}`}>
            {!!calc && new Array(props.colCount).fill(0).map((o, rowIndex) => row_layout(rowIndex))}
        </div>
    );
}

export default Beenet