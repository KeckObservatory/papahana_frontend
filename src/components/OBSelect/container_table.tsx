import { useState, useEffect } from 'react';
import MUIDataTable, { DisplayData, MUIDataTableOptions } from "mui-datatables"
import { Container, Scoby } from "../../typings/papahana";
import Button from '@mui/material/Button';
import DropDown from '../drop_down'
import { useOBSelectContext } from './ob_select'
import { container_api_funcs } from '../../api/ApiRoot'

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
    displayData: DisplayData
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

    const handleDropdownChange = (selName: string) => {
        console.log('changed', selName)
        //@ts-ignore
        const newcidname = props.containerIdNames.find((x) => { return x.name === selName })

        //@ts-ignore
        setContainerName(newcidname)
    }

    const remove_row_references = async (r: { data: any[]; dataIndex: number }) => {
        //TODO: get all containers, filter the ones that need to update,
        // create new containers, and then
        const [ob_id, container_name] = r.data
        //get container
        //@ts-ignore
        const cidname = props.containerIdNames.find(x => { return x.name === container_name })

        //@ts-ignore
        await container_api_funcs.get(cidname._id).then((container: Container) => {
            //make new container that is missing ob
            const oldLength = container.observation_blocks.length
            const new_observation_blocks =
                container.observation_blocks.filter((_id: string) => {
                    return _id !== ob_id
                })
            console.log()
            console.log('old container obs', container.observation_blocks, 'new container obs', new_observation_blocks)
            container.observation_blocks = new_observation_blocks
            if (container.observation_blocks.length !== oldLength) {

                //@ts-ignore
                console.log('container', cidname.name, cidname._id, 'changing to', container)
                //@ts-ignore
                return container_api_funcs.put(cidname._id, container)
            }
        })
    }

    const add_obs_to_container = (rows: DA[]) => {
        let obs = rows.map((r: DA) => {
            const [_id, cont_name] = r.data
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
        if (cidname.name === 'all obs') {
            console.log('can not add to all obs synthetic container')
            return
        }

        const rows = props.selectedRows.data.map((x: SelectedRowData) => {
            return props.displayData[x.index]
        })

        console.log('setting selected rows to container ', cidname.name)
        //remove ob reference from each container
        rows.forEach( remove_row_references )
        //add to container, the selected obs
        add_obs_to_container(rows as DA[])
    }

    //@ts-ignore
    const names = props.containerIdNames.map(x => x.name)

    return (
        <div className={"custom-toolbar-select"}>
            <Button onClick={setSelectedToContainer}>Add selected to Container</Button>
            <DropDown arr={names} handleChange={handleDropdownChange} value={cidname.name} placeholder={'container'} label={'available containers'} />
        </div>
    );
}

const ContainerTable = (props: Props) => {

    const handleSelect = (indexes: any) => {
    }

    const columns = [
        "name",
        "container_name",
        "ob_type"
    ]

    const onRowClick = (rowData: string[], rowMeta: { dataIndex: number, rowIndex: number }) => {
        console.log('rowData', rowData, 'rowMeta', rowMeta)
    }

    const options: MUIDataTableOptions = {
        filterType: 'dropdown',
        onRowsDelete: () => false,
        selectableRows: 'single', //bug multiple will not remove all selected obs from container
        customToolbarSelect: (selectedRows: SelectedRows, displayData: DisplayData) => (
            <CustomToolbarSelect
                selectedRows={selectedRows}
                displayData={displayData}
                containerIdNames={props.containerIdNames}
            />
        ),
        onRowSelectionChange: handleSelect,
        onRowClick: onRowClick
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