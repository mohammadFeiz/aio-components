import React, { useState } from "react"
import DOC from "../../resuse-components/doc"
import RangeExamples from "./range-examples"
import './index.css';
export default function DOC_Tree(props:any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items:()=>[
                    { text: 'Range', id: 'range', render: () => <RangeExamples /> },
                ]
            }}
        />
    )
}