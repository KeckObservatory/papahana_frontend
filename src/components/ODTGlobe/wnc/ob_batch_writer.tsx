import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';


import { OBComponent, State as ParentState } from './wnc_stepper_dialog_content'
import { ObservationBlock } from '../../../typings/papahana';
import { ob_api_funcs } from '../../../api/ApiRoot';
import ComponentCompare from './component_compare';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

interface Props {
    parentState: ParentState
    rows: Array<any>
}

interface State { }

const infer_component_key = (templateName: string) => {

    if (templateName.includes('sci')) {
        return 'observations'
    }
    if (templateName.includes('target')) {
        return 'target'
    }
    if (templateName.includes('acq')) {
        return 'acquisition'
    }
    else {
        throw 'name not found'
    }

}

const OBBatchWriter = function (props: Props) {

    const [idx, setIdx] = useState(0)
    const [ob, setOB] = useState({} as ObservationBlock)
    const [progress, setProgress] = React.useState(0);
    const [overwrite, setOverwrite] = useState(false)
    const rowLen = props.rows.length
    const componentKey = infer_component_key(props.parentState.id)
    const isSequence = componentKey === 'observations';
    console.log('n rows', rowLen, 'componentKey', componentKey)

    useEffect(() => {
        //get ob component
        if (idx >= rowLen) {
            return
        }
        const row = props.rows[idx]
        const ob_id = row.ob_id
        console.log('row', row, 'obComponent', props.parentState.obComponent)
        //get and display ob
        ob_api_funcs.get(ob_id).then((aob: ObservationBlock) => {
            setOB(aob)
            if (Object.keys(ob).includes(componentKey)) {
                setOverwrite(true)
            }
            else {
                setOverwrite(false)
            }
        })
    }, [idx])

    const handleConfirm = () => {

        setProgress( Math.min( 100 * ( idx + 1) / rowLen, 100 ))
        if (idx < rowLen) {
            setIdx((prevIdx) => prevIdx + 1)
            console.log('adding new ob component to ob', ob)
            let newOB: ObservationBlock
            if (isSequence) {
                let seq = {
                    ...props.parentState.obComponent
                }
                const sequences = ob.observations
                if (sequences) { //append to existing sequences
                    const seqNumber = sequences.length
                    seq.metadata.sequence_number = seqNumber
                    newOB = { ...ob, [componentKey]: [...sequences, seq] }
                }
                else { //create new observations array 
                    const seqNumber = 0
                    seq.metadata.sequence_number = seqNumber
                    newOB = { ...ob, [componentKey]: [seq] }
                }
            }
            else {
                newOB = { ...ob, [componentKey]: props.parentState.obComponent }
            }

            ob_api_funcs.put(newOB._id, newOB)
        }
    }


    const handleSkip = () => {
        if (idx < rowLen) {
            setIdx((prevIdx) => prevIdx + 1)
        }
    }

    return (
        <React.Fragment>
            <Box sx={{ width: '100%' }}>
                <LinearProgress variant="determinate" value={progress} />
            </Box>
            {idx < rowLen ? (
                <React.Fragment>
                    {overwrite && (
                        <ComponentCompare
                            isSequence={isSequence}
                            currentComponent={ob[componentKey] as OBComponent}
                            proposedComponent={props.parentState.obComponent}
                        />
                    )}
                    {/* <div>{JSON.stringify(props.rows[idx])}</div> */}
                    <Button onClick={handleConfirm}>Confirm overwrite row {idx + 1}</Button>
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