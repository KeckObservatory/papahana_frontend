import React, { useState } from 'react';
import { ObservationBlock } from "../../../typings/papahana";
import EditDialog from './edit_dialog';
import EditCPDialog from './edit_cp_dialog';
import EditSeqDialog from './edit_seq_dialog';


const ComponentInput = (value: string, tableMeta: any, updateValue: any) => {

    const compKey = tableMeta.columnData.name as keyof ObservationBlock

    const component_dialog = (compKey: string) => {
        if (compKey === 'number_sequences') {
            return (
                <EditSeqDialog value={value} tableMeta={tableMeta} />
            )
        }
        else if (compKey === 'common_parameters') {
            return (
                <EditCPDialog value={value} tableMeta={tableMeta} />
            )
        }
        else {
            return (
                <EditDialog value={value} tableMeta={tableMeta} />
            )
        }
    }
    return (
        value &&
        component_dialog(compKey)
    )
}

export default ComponentInput