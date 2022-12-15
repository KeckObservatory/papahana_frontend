import React, { useEffect, useState } from 'react';
import { ob_table_funcs, semid_api_funcs } from '../../api/ApiRoot';
import { get_sem_id_list } from '../../api/utils';
import { ObservationBlock, Science } from '../../typings/papahana';
import OBTable from './ob_table'
import { OBTableRow, GlobalTableRow } from '../../typings/ddoi_api'

interface Props {

}

const get_all_ob_rows = async (): Promise<OBTableRow[]> => {
    const rows = await ob_table_funcs.get_ob_table()
    console.log('final ob rows length: ', rows.length)
    return (rows)
}

export default function ODTGlobeView(props: Props) {

    const [rows, setRows] = useState([] as OBTableRow[])

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