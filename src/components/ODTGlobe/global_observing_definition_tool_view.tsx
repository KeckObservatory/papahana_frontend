import React, { useEffect, useState } from 'react';
import { get_all_obs } from '../../api/utils';
import { ObservationBlock, Science } from '../../typings/papahana';
import OBTable from './ob_table'

interface Props {

}


const obs_to_rows = (obs: ObservationBlock[]) => {
    let rows: object[] = []
    obs.forEach((ob: ObservationBlock) => {
        let nseq: number = 0 
        ob.observations?.forEach((seq: Science) => {
            nseq++
        }
        )

        const seqLabel = `Num. sequences: ${nseq}` 

        let row = {
            ob_id: ob._id,
            name: ob.metadata.name,
            ob_type: ob.metadata.ob_type,
            sem_id: ob.metadata.sem_id,
            instrument: ob.metadata.instrument,
            tags: ob.metadata.tags as string[],
            target: ob.target?.metadata.name,
            acquisition: ob.acquisition.metadata.ui_name,
            common_parameters: ob.common_parameters?.metadata.ui_name,
            observations: seqLabel 
        }
        rows.push(row)
    })
    return rows
}

export default function ODTGlobeView(props: Props) {

    const [obs, setObs] = useState([] as ObservationBlock[])
    const [rows, setRows] = useState([] as object[])


    useEffect(() => {
        const get_rows = async () => {
            const rows = obs_to_rows(await get_all_obs())
            console.log(rows)
            setRows(rows)
        }
        get_rows()
    }, [])


    return (
        <React.Fragment>
            <div>
                ODT Global View
            </div>
            <OBTable rows={rows} />
        </React.Fragment>
    )
}