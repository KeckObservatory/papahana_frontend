import { useState, useEffect } from 'react';
import MUIDataTable, { DisplayData, MUIDataTableOptions } from "mui-datatables"
import Button from '@mui/material/Button';
import TagEditor from './tag_editor'
import Dialog from '@mui/material/Dialog';
import WNCStepperDialogContent from './wnc/wnc_stepper_dialog_content';
import ComponentInput from './EditComponent/component_input';
import EditOBInput from './EditComponent/edit_ob_input';

interface Props {
    rows: object[]
}

interface SelectedRowData { index: number; dataIndex: number }

export interface SelectedRows {
    data: Array<SelectedRowData>; lookup?: { [key: number]: boolean }
}

interface CTProps {
    selectedRows: SelectedRows,
    displayData: DisplayData,
    handleOBSelect: Function
}

const format_rows = (rowData: Array<Array<any>>) => {
    const rows = rowData.map((rd) => {
        let row: any = {}
        columnNames.forEach((colName: string, idx: number) => {
            let val = rd[idx]
            if (typeof val !== 'object') {
                row[colName] = val
            }
        })
        return row
    })
    return rows
}


const CustomToolbarSelect = (props: CTProps) => {

    const [open, setOpen] = useState(false);
    const selRows = props.selectedRows.data.map((idxDidx: SelectedRowData) => {
        const selRow = props.displayData.find(dd => dd.dataIndex === idxDidx.dataIndex) as any
        return selRow.data
    })
    const rows = format_rows(selRows)

    const handle_click_open = () => {
        console.log(rows)
        setOpen(true);
    };

    const handle_close = () => {
        setOpen(false);
    };

    return (
        <div className={"custom-toolbar-select"}>
            <Button onClick={handle_click_open}>Write new component</Button>
            <Dialog open={open} onClose={handle_close}>
                <WNCStepperDialogContent
                    rows={rows}
                    handle_close={handle_close}
                />
            </Dialog>
        </div>
    );
}

const TagsInput = (value: string[], tableMeta: any, updateValue: any) => {
    // console.log('Inputs', value, tableMeta.rowData, updateValue)

    return (
        <TagEditor
          tags={value}
          tableMeta={tableMeta}
        />
    )
}

const columnNames = [
    '_id', 'edit ob', 'ob_name', 'sem_id', 'instrument', 'ob_type', 'target_name', 'acquisition', 'number_sequences', 'common_parameters', 'tags'
]

const columns = [
    { name: '_id', label: 'OB ID', options: { display: false } },
    { name: 'edit_ob', label: 'Edit OB', options: { 
        customBodyRender: EditOBInput,
    } },
    { name: 'ob_name', label: 'OB Name' },
    { name: 'sem_id', label: 'Semid' },
    { name: 'instrument', label: 'Instrument' },
    { name: 'ob_type', label: 'OB Type' },
    {
        name: 'target_name', label: 'Target',
        options: {
            customBodyRender: ComponentInput,
        }
    },
    {
        name: 'acquisition', label: 'Acquisition',
        options: {
            customBodyRender: ComponentInput,
        }
    },
    {
        name: 'number_sequences', label: 'Sequences',
        options: {
            customBodyRender: ComponentInput,
        }
    },
    {
        name: 'common_parameters', label: 'Configuration',
        options: {
            customBodyRender: ComponentInput,
        }
    },
    {
        name: 'tags', label: 'Tags',
        options: {
            customBodyRender: TagsInput,
        }
    },
]

const OBTable = (props: Props) => {

    const handleSelect = (indexes: any) => {
    }


    const onRowClick = (rowData: string[], rowMeta: { dataIndex: number, rowIndex: number }) => {
        // console.log('rowData', rowData, 'rowMeta', rowMeta)
        //todo include node popover componnet
    }

    const handleOBSelect = () => {
        console.log('ob selected')
    }

    const options: MUIDataTableOptions = {
        filterType: 'dropdown',
        onRowsDelete: () => false,
        responsive: "standard",
        selectableRows: 'multiple',
        customToolbarSelect: (selectedRows: SelectedRows, displayData: DisplayData) => (
            <CustomToolbarSelect
                selectedRows={selectedRows}
                displayData={displayData}
                handleOBSelect={handleOBSelect}
            />
        ),
        onRowSelectionChange: handleSelect,
        onRowClick: onRowClick,
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
            data={props.rows}
            columns={columns}
            options={options}
            title={'Observation Block Table'} />
    )
}

export default OBTable 