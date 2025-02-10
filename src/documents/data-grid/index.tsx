import { FC, createContext, useCallback, useContext, useState } from "react";
import './index.css';
import { AISlider } from "../../npm/aio-input";
type I_status = 'not-started' | 'in-progress' | 'completed';
type I_col = '0' | '1' | '2'
type I_part = 'wall' | 'ceiling' | 'roof'

type I_row = {
    floor: string,
    lastCapture: string,
    parts: I_parts
}
type I_parts = {
    [part in I_part]: I_partData
}
type I_partData = {
    [col in I_col]: I_colData
}
type I_colData = {
    status: I_status,
    progress: number
}
type I_grid = I_row[]

const data: I_grid = [
    {
        floor: 'طبقه همکف', lastCapture: '1403/6/8',
        parts: {
            wall: {
                '0': {
                    status: 'not-started',
                    progress: 0
                },
                '1': {
                    status: 'in-progress',
                    progress: 90
                },
                '2': {
                    status: 'in-progress',
                    progress: 60
                },
            },
            ceiling: {
                '0': {
                    status: 'in-progress',
                    progress: 10
                },
                '1': {
                    status: 'in-progress',
                    progress: 40
                },
                '2': {
                    status: 'completed',
                    progress: 100
                },

            },
            roof: {
                '0': {
                    status: 'in-progress',
                    progress: 20
                },
                '1': {
                    status: 'in-progress',
                    progress: 80
                },
                '2': {
                    status: 'in-progress',
                    progress: 60
                },

            },

        }
    },
    {
        floor: 'طبقه اول', lastCapture: '1403/6/12',
        parts: {
            wall: {
                '0': {
                    status: 'not-started',
                    progress: 0
                },
                '1': {
                    status: 'in-progress',
                    progress: 67
                },
                '2': {
                    status: 'completed',
                    progress: 100
                },

            },
            ceiling: {
                '0': {
                    status: 'in-progress',
                    progress: 20
                },
                '1': {
                    status: 'in-progress',
                    progress: 80
                },
                '2': {
                    status: 'in-progress',
                    progress: 60
                },

            },
            roof: {
                '0': {
                    status: 'in-progress',
                    progress: 20
                },
                '1': {
                    status: 'in-progress',
                    progress: 80
                },
                '2': {
                    status: 'in-progress',
                    progress: 60
                },

            },

        }
    }
]

const App: FC = () => {
    return (
        <div className="example">
            <DataGrid data={data} />
        </div>
    )
}
export default App
type I_cellType = 'progress' | 'status'
type I_GridContext = { cellType: I_cellType, dic: { [key: string]: string },statuses:I_status[] }
const GridContext = createContext({ cellType: 'status' } as I_GridContext)
const DataGrid: FC<{ data: I_grid }> = ({ data }) => {
    const [cellType, setCellType] = useState<I_cellType>('status')
    const statuses:I_status[] = ['completed','in-progress','not-started']
    const dic = {
        '0': 'نازک کاری',
        '1': 'سفت کاری',
        '2': 'انتقال مصالح',
        'wall': 'دیوار',
        'ceiling': 'کف',
        'roof': 'سقف',
        'completed':'تکمیل شده',
        'in-progress':'در حال انجام',
        'not-started':'شروع نشده',
    }
    return (
        <GridContext.Provider value={{ cellType, dic,statuses }}>
            <div className="data-grid">
                <GridDetails data={data} />
                <GridParts data={data} />
            </div>
        </GridContext.Provider>
    )
}
const GridDetails: FC<{ data: I_grid }> = ({ data }) => {
    return (
        <div className="msf">
            <div className="grid-part"></div>
            <div className="grid-cols">
                <div className="grid-col">طبقه</div>
                <div className="grid-col">آخرین بروزرسانی</div>
            </div>
            <div className="grid-total-row"></div>
            {
                data.map((row: I_row) => {
                    return (
                        <div className="grid-row">
                            <div className="grid-cell">{row.floor}</div>
                            <div className="grid-cell">{row.lastCapture}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}
const GridParts: FC<{ data: I_grid }> = ({ data }) => {
    const cols: I_col[] = ['0', '1', '2']
    const partNames: I_part[] = ['wall', 'ceiling', 'roof']
    return (
        <div className="grid-parts">
            {
                partNames.map((partName: I_part) => {
                    return (
                        <GridPart part={partName} cols={cols} rows={data} />
                    )
                })
            }
        </div>
    )
}
const GridPart: FC<{ part: I_part, rows: I_row[], cols: I_col[] }> = ({ part, cols, rows }) => {
    const { dic }: I_GridContext = useContext(GridContext);
    return (
        <div className="w-fit-">
            <div className="grid-part">{dic[part]}</div>
            <GridPartCols cols={cols as string[]} />
            <GridPartTotalRow part={part} rows={rows} />
            {
                rows.map((row: I_row) => {
                    return <GridPartRow partData={row.parts[part] as I_partData} cols={cols} />
                })
            }

        </div>
    )
}
type I_grid_report = {
    [key in I_status]: number
}
const GridPartTotalRow: FC<{ part: I_part, rows: I_grid }> = ({ part, rows }) => {
    const cols: I_col[] = ['0', '1', '2']
    return (
        <div className="grid-total-row">
            {cols.map((col) => <GridTotalCell part={part} col={col} rows={rows} />)}
        </div>
    )
}
const GridTotalCell: FC<{ part: I_part, col: I_col, rows: I_grid }> = ({ part, col, rows }) => {
    const {statuses,dic}:I_GridContext = useContext(GridContext)
    const getReport = (): I_grid_report => {
        let report: I_grid_report = {
            'completed': 0,
            'in-progress': 0,
            'not-started': 0,
        }
        for (let i = 0; i < rows.length; i++) {
            const row: I_row = rows[i];
            const partData = row.parts[part]
            const { status } = partData[col];
            report[status] += 1
        }
        return report
    }
    const report: I_grid_report = getReport()
    return (
        <div className="grid-total-cell">
            <AISlider
                start={0}
                size={36}
                end={rows.length}
                multiple={true}
                point={false}
                fill={false}
                ranges={[
                    [report['completed'], { thickness: 6, offset: 0, className: 'bg-completed', color: '' }],
                    [report['in-progress'], { thickness: 6, offset: 0, className: 'bg-in-progress', color: '' }],
                    [report['not-started'], { thickness: 6, offset: 0, className: 'bg-not-started', color: '' }],

                ]}
            />
            {
                statuses.map((status:I_status)=>{
                    return (
                        <div className="status-detail">
                            <div className="status-detail-label">
                                {`${dic[status]} :`}
                            </div>
                            <div className={`status-detail-value color-${status}`}>
                                {report[status]}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
const GridPartCols: FC<{ cols: string[] }> = ({ cols }) => {
    const { dic }: I_GridContext = useContext(GridContext);
    return (
        <div className="grid-cols">
            {cols.map((col) => <div className="grid-col">{dic[col]}</div>)}
        </div>
    )
}
const GridPartRow: FC<{ partData: I_partData, cols: I_col[] }> = ({ partData, cols }) => {
    return (
        <div className="grid-row">
            {
                cols.map((col: I_col) => {
                    return <GridPartCell colData={partData[col] as I_colData} />
                })
            }
        </div>
    )
}
const GridPartCell: FC<{ colData: I_colData }> = ({ colData }) => {
    const { status, progress } = colData;
    const { cellType,dic }: I_GridContext = useContext(GridContext)
    const getContent = () => {
        if (cellType === "status") {
            return (<div className={`cell-status color-${status} border-${status}`}>{dic[status]}</div>)
        }
        if (cellType === "progress") {
            return (
                <div className={`grid-slider grid-slider-${status}`}>
                    <AISlider
                        size={24}
                        start={0}
                        end={100}
                        value={progress}
                    />
                    <div className="grid-slider-value">{`${progress}%`}</div>
                </div>
            )
        }
    }
    return (
        <div className="grid-cell">{getContent()}</div>
    )
}