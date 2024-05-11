import React, { useState } from "react"
import DOC from "../../resuse-components/doc"
import RangeExamples from "./range-examples"
import InputExamples from "./input-examples"
import './index.css';
import TreeExamples from "./tree-examples";
import TableExamples from "./table-examples";
import AcardionExamples from "./acardion-examples";
import ListExamples from "./list-examples";
import MapExamples from "./map-examples";
import SelectExamples from "./select-examples";
import GaugeExamples from "./gauge-examples";
export default function DOC_Tree(props:any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items:()=>[
                    { text: '1 - slider', id: 'slider', render: () => <RangeExamples type='slider' key='slider'/> },
                    { text: '2 - spinner', id: 'spinner', render: () => <RangeExamples type='spinner' key='spinner'/> },
                    { text: '3 - text', id: 'text', render: () => <InputExamples type='text' key='text'/> },
                    { text: '4 - number', id: 'number', render: () => <InputExamples type='number' key='number'/> },
                    { text: '5 - textarea', id: 'textarea', render: () => <InputExamples type='textarea' key='textarea'/> },
                    { text: '6 - password', id: 'password', render: () => <InputExamples type='password' key='password'/> },
                    { text: '7 - checkbox', id: 'checkbox', render: () => <InputExamples type='checkbox' key='checkbox'/> },
                    { text: '8 - date', id: 'date', render: () => <InputExamples type='date' key='date'/> },
                    { text: '9 - time', id: 'time', render: () => <InputExamples type='time' key='time'/> },
                    { text: '10 - tree', id: 'tree', render: () => <TreeExamples/> },
                    { text: '11 - table', id: 'table', render: () => <TableExamples/> },
                    { text: '12 - acardion', id: 'acardion', render: () => <AcardionExamples/> },
                    { text: '13 - list', id: 'list', render: () => <ListExamples/> },
                    { text: '14 - map', id: 'map', render: () => <MapExamples/> },
                    { text: '15 - select', id: 'select', render: () => <SelectExamples type='select' key='select'/> },
                    { text: '16 - radio', id: 'radio', render: () => <SelectExamples type='radio' key='radio'/> },
                    { text: '17 - tabs', id: 'tabs', render: () => <SelectExamples type='tabs' key='tabs'/> },
                    { text: '18 - buttons', id: 'buttons', render: () => <SelectExamples type='buttons' key='buttons'/> },
                    { text: '19 - gauge', id: 'gauge', render: () => <GaugeExamples/> },
                    { text: '20 - image', id: 'image', render: () => <InputExamples type='image' key='image'/> },
                    { text: '21 - file', id: 'file', render: () => <InputExamples type='file' key='file'/> },
                    
                ]
            }}
        />
    )
}