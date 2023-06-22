import { useState, useEffect } from 'react';
import MUIDataTable, { DisplayData, MUIDataTableOptions } from "mui-datatables"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { get_all_targets } from '../../api/utils';
import { ObservationBlock, Target } from '../../typings/papahana';
import { useOBContext } from './observation_data_tool_view';

interface Props {
    addSeq: Function
}

interface SelectedRowData { index: number; dataIndex: number }

export interface SelectedRows {
    data: Array<SelectedRowData>; lookup?: { [key: number]: boolean }
}

interface CTProps {
    targets: Target[],
    addSeq: Function,
    selectedRows: SelectedRows,
    displayData: DisplayData,
}

const CustomToolbarSelect = (props: CTProps) => {

    const handle_target_add = () => {
        const dataIndex = props.selectedRows.data[0].dataIndex
        const tgt = props.targets[dataIndex]
        props.addSeq(tgt)
    }

    return (
        <div className={"custom-toolbar-select"}>
            <Button onClick={handle_target_add}>Add Target to OB</Button>
        </div>
    );
}

const columnNames = [
    'Target Name', 'RA', 'DEC'
]

const columns = [
    { name: 'target_name', label: 'Target Name' },
    { name: 'target_info', label: 'Info' },
    { name: 'ra', label: 'RA' },
    { name: 'dec', label: 'DEC' },
]

const targets_to_rows = (targets: Target[]) => {
    let rows = [] as object[]
    targets.forEach((target: Target) => {
        const row = {
            target_name: target.metadata.name,
            target_info: target.parameters.target_info_name,
            ra: target.parameters.target_coord_ra,
            dec: target.parameters.target_coord_dec,
        }
        rows.push(row)

    })
    return rows
}

const TargetTable = (props: Props) => {

    const [rows, setRows] = useState([] as object[])
    const [targets, setTargets] = useState([] as Target[])

    useEffect(() => {
        const make_targets = async () => {
            const tgts = await get_all_targets()
            setTargets(tgts)
            const rows = targets_to_rows(tgts)
            setRows(rows)
        }

        make_targets()

    }, []
    )

    const options: MUIDataTableOptions = {
        filterType: 'dropdown',
        onRowsDelete: () => false,
        responsive: "standard",
        selectableRows: 'single',
        customToolbarSelect: (selectedRows: SelectedRows, displayData: DisplayData) => (
            <CustomToolbarSelect
                addSeq={props.addSeq}
                selectedRows={selectedRows}
                targets={targets}
                displayData={displayData}
            />
        ),
        setRowProps: (row, dataIndex, rowIndex) => {
            return {
                style: { padding: '0px' },
            };
        },
        setTableProps: () => {
            return {
                padding: 'none',
            };
        },
    }

    return (
        <MUIDataTable
            data={rows}
            columns={columns}
            options={options}
            title={'Target Table'} />
    )
}

export default TargetTable 
