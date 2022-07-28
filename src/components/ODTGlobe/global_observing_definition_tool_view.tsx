import React, { useEffect, useState } from 'react';
import { semid_api_funcs } from '../../api/ApiRoot';
import { get_sem_id_list } from '../../api/utils';
import { ObservationBlock, Science } from '../../typings/papahana';
import OBTable from './ob_table'
import { OBTableRow, GlobalTableRow } from '../../typings/ddoi_api'

interface Props {

}


const get_all_ob_rows_bak = async (): Promise<GlobalTableRow[]> => {

    let rows: GlobalTableRow[] = []
    const sem_ids = await get_sem_id_list()
    for (let idx = 0; idx < sem_ids.associations.length; idx++) {
        const sem_id = sem_ids.associations[idx]
        const obs = await semid_api_funcs.get_semester_obs(sem_id)
        const obRows = obs_to_rows(obs)
        rows = [...rows, ...obRows]
        console.log('ob rows length: ', rows.length)
    }

    console.log('final ob rows length: ', rows.length)
    return (rows)
}

const get_all_ob_rows = async (): Promise<GlobalTableRow[]> => {
    let rows: GlobalTableRow[] = []
    const sem_ids = await get_sem_id_list()
    for (let idx = 0; idx < sem_ids.associations.length; idx++) {
        const sem_id = sem_ids.associations[idx]
        const obs = await semid_api_funcs.get_semester_obs(sem_id)
        const obRows = obs_to_rows(obs)
        rows = [...rows, ...obRows]
        console.log('ob rows length: ', rows.length)
    }

    console.log('final ob rows length: ', rows.length)
    return (rows)
}

const obs_to_rows = (obs: ObservationBlock[]) => {
    let rows: GlobalTableRow[] = []
    obs.forEach((ob: ObservationBlock) => {
        let nseq: number = 0
        ob.observations?.forEach((seq: Science) => {
            nseq++
        }
        )
        const seqLabel = `Num. sequences: ${nseq}`
        let row: GlobalTableRow = {
            ob_id: ob._id,
            name: ob.metadata.name,
            ob_type: ob.metadata.ob_type,
            sem_id: ob.metadata.sem_id,
            instrument: ob.metadata.instrument,
            tags: ob.metadata.tags as string[],
            target: ob.target?.metadata.name,
            acquisition: ob.acquisition?.metadata.ui_name,
            common_parameters: ob.common_parameters?.metadata.ui_name,
            observations: seqLabel
        }
        rows.push(row)
    })
    return rows
}

export default function ODTGlobeView(props: Props) {

    const [rows, setRows] = useState([] as object[])

    useEffect(() => {
        const get_rows = async () => {
            const obRows = await get_all_ob_rows ()
            console.log(obRows)
            setRows(obRows)
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