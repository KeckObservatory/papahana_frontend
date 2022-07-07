
import { useState, useEffect } from 'react';
import MUIDataTable, { DisplayData, MUIDataTableOptions } from "mui-datatables"
import { Container, ObservationBlock, Scoby } from "../../typings/papahana";
import Button from '@mui/material/Button';
import { useOBSelectContext } from './../ODT/side_menu'
import { container_api_funcs, ob_api_funcs } from '../../api/ApiRoot'
import ChipInput from 'material-ui-chip-input'
import Dialog from '@mui/material/Dialog';
import WNCStepperDialogContent from './wnc/wnc_stepper_dialog_content';

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
    const rows = rowData.map( (rd) => {
        let row: any = {}
        columnNames.map( (n: string, idx: number) => {
            let val = rd[idx] 
            if (typeof val === 'object') {
                val = val.props.children
            }
            row[n] = val
        }) 
        return row
    })
    return rows
}


const CustomToolbarSelect = (props: CTProps) => {

    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

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

    const open_new_stepper = () => {

    }

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

const TagsInput = (value: string, tableMeta: any, updateValue: any) => {
    // console.log('Inputs', value, tableMeta.rowData, updateValue)

    return (
        <ChipInput />
    )
}

const ComponentInput = (value: string, tableMeta: any, updateValue: any) => {

    const editComponent = () => {
        // console.log('value', value, 'tableMeta', tableMeta, 'updateValue', updateValue)
        const ob_id = tableMeta.rowData[0]
        const comp = tableMeta.columnData.name
        console.log('id', ob_id, 'component:', comp, 'component name:', value)
        ob_api_funcs.get(ob_id).then((ob: any) => {
            console.log('component', ob[comp] as any)
        })
    }

    return (
        <Button onClick={editComponent}>{value}</Button>
    )
}

const columnNames = [
    'ob_id', 'name', 'sem_id', 'instrument', 'ob_type', 'target', 'acquisition', 'observations', 'common_parameters', 'tags'
]

const columns = [
    { name: 'ob_id', label: 'OB ID', options: { display: false } },
    { name: 'name', label: 'OB Name' },
    { name: 'sem_id', label: 'Semid' },
    { name: 'instrument', label: 'Instrument' },
    { name: 'ob_type', label: 'OB Type' },
    {
        name: 'target', label: 'Target',
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
        name: 'observations', label: 'Sequences',
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