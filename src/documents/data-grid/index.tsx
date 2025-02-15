import { FC, createContext, useCallback, useContext, useState } from "react";
import './index.css';
import { AIButtons, AIDate, AISlider } from "../../npm/aio-input";
type I_status = 'not-started' | 'in-progress' | 'completed';
type I_col = 'soft' | 'hard' | 'transport'
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
                'soft': {
                    status: 'not-started',
                    progress: 0
                },
                'hard': {
                    status: 'in-progress',
                    progress: 90
                },
                'transport': {
                    status: 'in-progress',
                    progress: 60
                },
            },
            ceiling: {
                'soft': {
                    status: 'in-progress',
                    progress: 10
                },
                'hard': {
                    status: 'in-progress',
                    progress: 40
                },
                'transport': {
                    status: 'completed',
                    progress: 100
                },

            },
            roof: {
                'soft': {
                    status: 'in-progress',
                    progress: 20
                },
                'hard': {
                    status: 'in-progress',
                    progress: 80
                },
                'transport': {
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
                'soft': {
                    status: 'not-started',
                    progress: 0
                },
                'hard': {
                    status: 'in-progress',
                    progress: 67
                },
                'transport': {
                    status: 'completed',
                    progress: 100
                },

            },
            ceiling: {
                'soft': {
                    status: 'in-progress',
                    progress: 20
                },
                'hard': {
                    status: 'in-progress',
                    progress: 80
                },
                'transport': {
                    status: 'in-progress',
                    progress: 60
                },

            },
            roof: {
                'soft': {
                    status: 'in-progress',
                    progress: 20
                },
                'hard': {
                    status: 'in-progress',
                    progress: 80
                },
                'transport': {
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
            <DataGrid
                data={data}
                cols={[
                    { text: 'نازک کاری', value: 'soft' },
                    { text: 'سفت کاری', value: 'hard' },
                    { text: 'انتقال مصالح', value: 'transport' }
                ]}
                parts={[
                    { text: 'دیوار', value: 'wall' },
                    { text: 'کف', value: 'ceiling' },
                    { text: 'سقف', value: 'roof' },
                ]}
                statuses={[
                    { text: 'تکمیل شده', value: 'completed' },
                    { text: 'در حال انجام', value: 'in-progress' },
                    { text: 'شروع نشده', value: 'not-started' },
                ]}
            />
        </div>
    )
}
export default App
type I_GridContext = {
    filter: I_filter,
    statuses: { text: string, value: I_status }[],
    cols: { text: string, value: I_col }[],
    parts: { text: string, value: I_part }[],
    changeFilter: (key: keyof I_filter, value: any) => void
}
type I_filter = {
    cellType: 'progress' | 'status',
    date:string
}
const GridContext = createContext({ filter: { cellType: 'status' } } as I_GridContext)
const DataGrid: FC<{
    data: I_grid,
    cols: { text: string, value: I_col }[],
    parts: { text: string, value: I_part }[],
    statuses: { text: string, value: I_status }[]
}> = ({ data, cols, parts, statuses }) => {
    const [filter, setFilter] = useState<I_filter>({
        cellType: 'status',
        date:''
    })
    const changeFilter = (key: keyof I_filter, value: any) => {
        setFilter({ ...filter, [key]: value })
    }
    return (
        <GridContext.Provider value={{ filter, changeFilter, statuses, cols, parts }}>
            <div className="data-grid">
                <DataGridHeader />
                <div className="data-grid-body">
                    <GridDetails data={data} />
                    <GridParts data={data} />
                </div>
            </div>
        </GridContext.Provider>
    )
}
const DataGridHeader: FC = () => {
    const { filter,changeFilter }: I_GridContext = useContext(GridContext)
    const cellTypeOptions: I_filter["cellType"][] = ['status', 'progress']
    const cellTypeDic: { [key in I_filter["cellType"]]: string } = {
        'status': 'وضعیت',
        'progress': 'پیشرفت'
    }
    return (
        <div className="data-grid-header">
            <div className="data-grid-label">نمایش بر اساس</div>
            <AIButtons
                options={cellTypeOptions}
                option={{
                    text: (option) => (cellTypeDic[option as I_filter["cellType"]]),
                    value: (option) => option
                }}
                value={filter.cellType}
                onChange={(cellType) =>changeFilter('cellType',cellType)}
            />
            <div className="data-grid-label">نمایش تا تاریخ</div>
            <AIDate
                jalali={true}
                value={filter.date}
                onChange={(date) =>changeFilter('date',date)}
            />
        </div>
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
    const { parts }: I_GridContext = useContext(GridContext)
    return (
        <div className="grid-parts">
            {
                parts.map((part) => {
                    return (
                        <GridPart
                            key={part.value}
                            partText={part.text}
                            partValue={part.value}
                            rows={data}
                        />
                    )
                })
            }
        </div>
    )
}
const GridPart: FC<{ partText: string, partValue: I_part, rows: I_row[] }> = ({ partText, partValue, rows }) => {
    return (
        <div className="w-fit-">
            <div className="grid-part">{partText}</div>
            <GridPartCols />
            <GridPartTotalRow partValue={partValue} rows={rows} />
            {
                rows.map((row: I_row) => {
                    return <GridPartRow partData={row.parts[partValue] as I_partData} />
                })
            }

        </div>
    )
}
type I_grid_report = {
    [key in I_status]: number
}
const GridPartTotalRow: FC<{ partValue: I_part, rows: I_grid }> = ({ partValue, rows }) => {
    const { cols }: I_GridContext = useContext(GridContext)
    return (
        <div className="grid-total-row">
            {cols.map((col) => <GridTotalCell partValue={partValue} colValue={col.value} rows={rows} />)}
        </div>
    )
}
const GridTotalCell: FC<{ partValue: I_part, colValue: I_col, rows: I_grid }> = ({ partValue, colValue, rows }) => {
    const { statuses }: I_GridContext = useContext(GridContext)
    const getReport = (): I_grid_report => {
        let report: I_grid_report = {
            'completed': 0,
            'in-progress': 0,
            'not-started': 0,
        }
        for (let i = 0; i < rows.length; i++) {
            const row: I_row = rows[i];
            const partData = row.parts[partValue]
            const { status } = partData[colValue];
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
                statuses.map((status) => {
                    return (
                        <div className="status-detail">
                            <div className="status-detail-label">
                                {`${status.text} :`}
                            </div>
                            <div className={`status-detail-value color-${status}`}>
                                {report[status.value]}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
const GridPartCols: FC = () => {
    const { cols }: I_GridContext = useContext(GridContext);
    return (
        <div className="grid-cols">
            {cols.map((col) => <div className="grid-col">{col.text}</div>)}
        </div>
    )
}
const GridPartRow: FC<{ partData: I_partData }> = ({ partData }) => {
    const { cols }: I_GridContext = useContext(GridContext);
    return (
        <div className="grid-row">
            {
                cols.map((col) => {
                    return (
                        <GridPartCell
                            colData={partData[col.value] as I_colData}
                        />
                    )
                })
            }
        </div>
    )
}
const GridPartCell: FC<{ colData: I_colData }> = ({ colData }) => {
    const { status, progress } = colData;
    const { filter, statuses }: I_GridContext = useContext(GridContext)
    const statusObj = statuses.find((o) => o.value === status)
    if (!statusObj) { return null }
    return (
        <div className="grid-cell">
            {
                filter.cellType === 'status' &&
                <div
                    className={`cell-status color-${status} border-${status}`}
                >{statusObj.text}</div>
            }
            {
                filter.cellType === 'progress' &&
                <div className={`grid-slider grid-slider-${status}`}>
                    <AISlider
                        size={24}
                        start={0}
                        end={100}
                        value={progress}
                    />
                    <div className="grid-slider-value">{`${progress}%`}</div>
                </div>
            }
        </div>
    )
}