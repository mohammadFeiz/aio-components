import { FC, useState } from "react";
import DOC, { I_DOC } from "../../../resuse-components/Doc";
import './index.css';
import { AICheckbox, AIDate, AIFormInput, AISelect, AISlider, AIText, AITree } from "../../../npm/aio-input";
import { mdiMagnify } from "@mdi/js";
import Icon from "@mdi/react";
const Kits: FC<I_DOC> = (props) => {
    return (
        <DOC
            {...props}
            items={[
                { text: 'Dark 1', value: 'dark1', render: () => <Dark1 /> }
            ]}
        />
    )
}
export default Kits
const Dark1: FC = () => {
    const switch1 = { width: 48, buttonSize: 24, borderSize: 0, padding: 2 }
    const switch2 = { width: 54, buttonSize: 24, borderSize: 0, padding: 2,grooveSize:4,attrs:{className:'switch2'} }
    const [data, setData] = useState<any>({
        switch1: false, slider1: 40, text1: 'mohammad', select1: 'option2', date: '2025/2/4',
        tree: [
            {
                name: 'row-0', id: 'row-0',
                childs: [
                    { name: 'row0-0', id: 'row0-0', active: true },
                    { name: 'row0-1', id: 'row0-1' },
                    {
                        name: 'row0-2', id: 'row0-2',
                        childs: [
                            { name: 'row0-2-0', id: 'row0-2-0' },
                            { name: 'row0-2-1', id: 'row0-2-1', active: true },
                            { name: 'row0-2-2', id: 'row0-2-2' }
                        ]
                    },
                    { name: 'row0-3', id: 'row0-3' }
                ]
            },
            { name: 'row-1', id: 'row-1' },
            { name: 'row-2', id: 'row-2', active: true },
            { name: 'row-3', id: 'row-3' }
        ]
    })
    return (
        <div className="example aio-kit-d1 flex-col- gap-24-">
            <div className="flex-row- gap-12-">
                <AIFormInput
                    className='w-fit-'
                    input={<AICheckbox
                        value={data.switch1}
                        onChange={(v) => setData({ ...data, switch1: v })}
                        switch={switch1}
                    />}
                    label='Switch' required={false}
                />
                <AIFormInput
                    className='w-fit-'
                    input={<AICheckbox
                        value={data.switch1}
                        onChange={(v) => setData({ ...data, switch1: v })}
                        switch={switch2}
                    />}
                    label='.switch2' required={false}
                />
                <AIFormInput
                    input={<AISlider
                        start={0}
                        end={100}
                        size={36}
                        value={data.slider1}
                        onChange={(v) => setData({ ...data, slider1: v })}
                    />}
                    label='Slider' required={false}
                />
                <AIFormInput
                    input={
                        <AIText
                            value={data.text1}
                            onChange={(v) => setData({ ...data, text1: v })}
                            after={<Icon path={mdiMagnify} size={0.8} />}
                        />
                    }
                    label='Text' required={false}
                />

            </div>
            <div className="flex-row- gap-12-">
                <AIFormInput
                    input={
                        <AISelect
                            value={data.select1} popover={{ fitHorizontal: true }}
                            onChange={(v) => setData({ ...data, select1: v })}
                            after={<Icon path={mdiMagnify} size={0.8} />}
                            options={[
                                'option1', 'option2', 'option3', 'option4'
                            ]}
                            option={{
                                text: 'option',
                                value: 'option'
                            }}
                        />
                    }
                    label='Select' required={false}
                />
                <AIFormInput
                    input={
                        <AIDate
                            value={data.date}
                            size={14}
                        />
                    }
                    label='date' required={false}
                />
            </div>
            <div className="flex-row- gap-12-">
                <div className="shadow1 bg-dark flex-1- h-144- br-16- flex-row- align-vh- p-12- t-a-center-">bg-dark shadow1</div>
                <div className="shadow1 bg-dished flex-1- h-144- br-16- flex-row- align-vh- p-12- t-a-center-">bg-dished shadow1</div>
                <div className="shadow2 bg-light flex-1- h-144- br-16- flex-row- align-vh- p-12- t-a-center- c-0-">bg-light shadow2</div>
                <div className="shadow1 bg-dark-grad flex-1- h-144- br-16- flex-row- align-vh- p-12- t-a-center-">bg-dark-grad shadow1</div>
                <div className="shadow2 bg-blue flex-1- h-144- br-16- flex-row- align-vh- p-12- t-a-center-">bg-blue shadow2</div>
                <div className="shadow2 bg-dark-blue flex-1- h-144- br-16- flex-row- align-vh- p-12- t-a-center-">bg-dark-blue shadow2</div>
                <div className="shadow2 bg-green flex-1- h-144- br-16- flex-row- align-vh- p-12- t-a-center-">bg-green shadow2</div>
                
            </div>
            <AITree
                value={[...data.tree]}
                option={{ text: 'option.name', value: 'option.id' }}
            />

        </div>
    )
}
