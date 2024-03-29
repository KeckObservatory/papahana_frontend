import { useState, useEffect } from 'react';
import MUIDataTable, { DisplayData, MUIDataTableOptions } from "mui-datatables"
import { Container, Scoby } from "../../typings/papahana";
import Button from '@mui/material/Button';
import DropDown from '../drop_down'
import { useOBSelectContext } from './../ODT/side_menu'
import { container_api_funcs } from '../../api/ApiRoot'
import { useOBContext } from '../ODT/observation_data_tool_view';

interface Props {
    rows: Scoby[]
    containerIdNames: object[]
}

interface SelectedRowData { index: number; dataIndex: number }

interface SelectedRows {
    data: Array<SelectedRowData>; lookup?: { [key: number]: boolean }
}

interface CTProps {
    containerIdNames: object[],
    selectedRows: SelectedRows,
    displayData: DisplayData,
}

interface SRD {
    dataIndex: number,
    index: number
}

interface DA {
    data: [string, string]
    dataIndex: number
}

const CustomToolbarSelect = (props: CTProps) => {
    const [cidname, setContainerName] = useState({ _id: '', name: '' })

    const ob_select_object = useOBSelectContext()
    const ob_context = useOBContext()

    const handleDropdownChange = (selName: string) => {
        console.log('changed', selName)
        //@ts-ignore
        const newcidname = props.containerIdNames.find((x) => { return x.name === selName })

        //@ts-ignore
        setContainerName(newcidname)
    }

    const add_obs_to_container = (rows: any[]) => {
        let obs = rows.map((r: any[]) => {
            const [_id ] = r // assumes _id is the first element of array
            return _id
        })
        container_api_funcs.get(cidname._id).then((cont: Container) => {
            obs.forEach((ob_id: string) => {
                cont.observation_blocks.push(ob_id)
            })
            return container_api_funcs.put(cidname._id, cont)
        }).finally(() => {
            console.log('resetting table')
            // ob_select_object.reset_container_and_ob_select()
            ob_select_object.setTrigger(ob_select_object.trigger + 1)
        })
    }

    const setSelectedToContainer = () => {
        if (cidname.name.length === 0) {
            console.log('container name not specified.')
            return
        }
        if (cidname.name === 'All OBs') {
            console.log('can not add to All OBs synthetic container')
            return
        }

        const rows = props.selectedRows.data.map((x: SelectedRowData) => {
            return props.displayData[x.index].data
        })

        console.log('setting selected rows to container ', cidname.name)
        //add to container, the selected obs
        add_obs_to_container(rows)
    }

    //@ts-ignore
    const names = props.containerIdNames.map(x => x.name)

    const setSelectedOB = () => {
        const row: any = props.selectedRows.data[0] // select first entry of selected rows (should have 1 element)
        const data = props.displayData[row.index].data
        console.log('selecting ob from row', data)
        const ob_id = data[0] //assumes ob_id is first element
        ob_context.handleOBSelect(ob_id)
    }

    return (
        <div className={"custom-toolbar-select"}>
            <Button onClick={setSelectedOB}>Edit selected OB</Button>
            <Button onClick={setSelectedToContainer}>Add selected to Container</Button>
            <DropDown arr={names} handleChange={handleDropdownChange} value={cidname.name} placeholder={'container'} label={'available containers'} />
        </div>
    );
}

const ContainerTable = (props: Props) => {

    const handleSelect = (indexes: any) => {
    }

    const columns = [
        { name: 'ob_id', label: 'OB ID', options: { display: false } },
        { name: 'name', label: 'OB Name' },
        { name: 'container_name', label: 'Container Name' },
        { name: 'ob_type', label: 'OB Type' },
        { name: 'version', label: 'Version', options: { display: false } },
        { name: 'comment', label: 'Comment', options: { display: false } },
        { name: 'ra', label: 'RA', options: { display: false } },
        { name: 'dec', Label: 'Dec', options: { display: false } },
        { name: 'sem_id', Label: 'Semid', options: { display: false } },
    ]

    const onRowClick = (rowData: string[], rowMeta: { dataIndex: number, rowIndex: number }) => {
        console.log('rowData', rowData, 'rowMeta', rowMeta)
        //todo include node popover componnet
    }

    const options: MUIDataTableOptions = {
        filterType: 'dropdown',
        onRowsDelete: () => false,
        responsive: "standard",
        selectableRows: 'single', //bug multiple will not remove all selected obs from container
        customToolbarSelect: (selectedRows: SelectedRows, displayData: DisplayData) => (
            <CustomToolbarSelect
                selectedRows={selectedRows}
                displayData={displayData}
                containerIdNames={ props.containerIdNames }
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

export default ContainerTable 