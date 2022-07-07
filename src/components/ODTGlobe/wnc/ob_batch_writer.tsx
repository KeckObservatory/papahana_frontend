import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';


import { State as ParentState } from './wnc_stepper_dialog_content'
interface Props {
    parentState: ParentState
    rows: Array<object>
}

interface State { }

const OBBatchWriter = function (props: Props) {

    const [idx, setIdx] = useState(0)
    const rowLen = props.rows.length
    console.log('n rows', rowLen)

    const handleConfirm = () => {
        setIdx((prevIdx) => prevIdx + 1)
    }


    const handleSkip = () => {
        setIdx((prevIdx) => prevIdx + 1)
    }

    return (
        <React.Fragment>
            {idx < rowLen ? (
                <React.Fragment>
                    <div>Warning! Overwriting components is irreversible</div>
                    <div>{JSON.stringify(props.rows[idx])}</div>
                    <Button onClick={handleConfirm}>Confirm overwrite row {idx}</Button>
                    <Button onClick={handleSkip}>Skip</Button>
                </React.Fragment>
            ) : (
                <div>Completed Batch Overwrite</div>
            )
            }


        </React.Fragment>
    )
}

export default OBBatchWriter