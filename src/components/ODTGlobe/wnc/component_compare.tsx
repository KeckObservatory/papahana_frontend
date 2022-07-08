import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-view';
import { Science } from '../../../typings/papahana';
import { OBComponent } from './wnc_stepper_dialog_content';

interface Props {
    proposedComponent: OBComponent
    currentComponent: OBComponent
    isSequence: boolean
}

const ComponentCompare = function (props: Props) {
    console.log('component', props.proposedComponent, 'replacing', props.currentComponent)

    const check_if_sequence = () => {
        let proposed = props.proposedComponent
        if (props.isSequence) {
            let seq = {
                ...props.proposedComponent
            }
            const sequences = props.currentComponent as any as Science[]
            if (sequences) { //append to existing sequences
                const seqNumber = sequences.length
                seq.metadata.sequence_number = seqNumber
                proposed = [...sequences, seq] as any
            }
            else { //create new observations array 
                const seqNumber = 0
                seq.metadata.sequence_number = seqNumber
                proposed = [seq] as any
            }
        }
        return proposed
    }

    const proposed = check_if_sequence()
    return (
        <React.Fragment>
            <div>Warning! Overwriting components is irreversible</div>
            { props.isSequence ?? (
                <div>Note: sequence _appends_ to exisiting observations</div>
            )}
            <div>
                <Typography>Proposed</Typography>
                <ReactJson
                    src={proposed as object}
                    iconStyle={'circle'}
                    theme={'bespin'}
                    collapsed={1}
                    collapseStringsAfterLength={15}
                    enableClipboard={true}
                />
                <Typography>Existing</Typography>
                <ReactJson
                    src={props.currentComponent as object}
                    iconStyle={'circle'}
                    theme={'bespin'}
                    collapsed={1}
                    collapseStringsAfterLength={15}
                    enableClipboard={true}
                />
            </div>
        </React.Fragment>
    )
}

export default ComponentCompare