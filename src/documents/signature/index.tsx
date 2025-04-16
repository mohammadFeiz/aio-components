import React, { useRef, useEffect, useState, FC } from 'react';
import { Signature } from '../../npm/aio-component-utils';


const DOCSignature: FC = () => {
    return (
        <Signature
            attrs={{
                style: {
                    width: 400,
                    height: 400
                }
            }}
            onSave={(file) => {
                debugger
            }}
        />
    )
}
export default DOCSignature;

