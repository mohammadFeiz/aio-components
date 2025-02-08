import React, { useState } from "react"
import DOC from "../../resuse-components/Doc/index"
import RangeExamples from "./range-examples"
import InputExamples from "./input-examples"
import './index.css';
import TreeExamples from "./tree-examples";
import TableExamples from "./table-examples";
import AcardionExamples from "./acardion-examples";
import ListExamples from "./list-examples";
import SelectExamples from "./select-examples";
import GaugeExamples from "./gauge-examples";
export default function DOC_Tree(props:any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            items={[
                { text: '1 - slider', value: 'slider', render: () => <RangeExamples type='slider' key='slider'/> },
                { text: '2 - spinner', value: 'spinner', render: () => <RangeExamples type='spinner' key='spinner'/> },
                { text: '3 - text', value: 'text', render: () => <InputExamples type='text' key='text'/> },
                { text: '4 - number', value: 'number', render: () => <InputExamples type='number' key='number'/> },
                { text: '5 - textarea', value: 'textarea', render: () => <InputExamples type='textarea' key='textarea'/> },
                { text: '6 - password', value: 'password', render: () => <InputExamples type='password' key='password'/> },
                { text: '7 - checkbox', value: 'checkbox', render: () => <InputExamples type='checkbox' key='checkbox'/> },
                { text: '8 - date', value: 'date', render: () => <InputExamples type='date' key='date'/> },
                { text: '9 - time', value: 'time', render: () => <InputExamples type='time' key='time'/> },
                { text: '10 - tree', value: 'tree', render: () => <TreeExamples/> },
                { text: '11 - table', value: 'table', render: () => <TableExamples/> },
                { text: '12 - acardion', value: 'acardion', render: () => <AcardionExamples/> },
                { text: '13 - list', value: 'list', render: () => <ListExamples/> },
                { text: '15 - select', value: 'select', render: () => <SelectExamples type='select' key='select'/> },
                { text: '16 - radio', value: 'radio', render: () => <SelectExamples type='radio' key='radio'/> },
                { text: '17 - tabs', value: 'tabs', render: () => <SelectExamples type='tabs' key='tabs'/> },
                { text: '18 - buttons', value: 'buttons', render: () => <SelectExamples type='buttons' key='buttons'/> },
                { text: '19 - gauge', value: 'gauge', render: () => <GaugeExamples/> },
                { text: '20 - image', value: 'image', render: () => <InputExamples type='image' key='image'/> },
                { text: '21 - file', value: 'file', render: () => <InputExamples type='file' key='file'/> },
                { text: '23 - tags', value: 'tags', render: () => <SelectExamples type='tags' key='tags'/> },
                
            ]}
        />
    )
}