import { useState, useEffect } from 'react';
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables"
import { Container, Scoby } from "../../typings/papahana";
import Button from '@mui/material/Button';
import DropDown from '../drop_down'
import { useObserverContext } from '../App'
import { useOBSelectContext } from './ob_select'
import { container_api_funcs } from '../../api/ApiRoot'

interface Props {
    rows: Scoby[]
    containerNames: string[]
}


interface CTProps {
    containerNames: string[],
    selectedRows: any
    displayData: any
}

interface SRD {
    dataIndex: number,
    index: number
}

interface DA {
    data: [string, string, string]
    dataIndex: number
}

const CustomToolbarSelect = (props: CTProps) => {
    const [cid, setContainer] = useState('')

    const ob_select_object = useOBSelectContext()

    const handleChange = (selectedContainer: string) => {
        console.log('changed', selectedContainer)
        setContainer(selectedContainer)
    }

    const setSelectedToContainer = () => {
        if (cid.length === 0) {
            console.log('container id not specified.')
            return
        }
        const rows = props.selectedRows.data.map((x: SRD) => {
            return props.displayData[x.index]
        })

        console.log('setting selected to container', cid)
        console.log('rows', rows)
        //remove ob reference from each container
        //TODO: get all containers, filter the ones that need to update,
        // create new containers, and then
        // PUT 
        rows.forEach(async (r: DA) => {
            const [name, _id, cont] = r.data
            //get container
            await container_api_funcs.get(cont).then((container: Container) => {
                //make new container that is missing ob
                const oldLength = container.observation_blocks.length
                container.observation_blocks =
                    container.observation_blocks.filter((ob_id: string) => {
                        return ob_id !== _id
                    })
                if (container.observation_blocks.length !== oldLength) {
                    return container_api_funcs.put(cont, container)
                }
            })
        })

        //add to container, the selected obs
        let obs = rows.map((r: DA) => {
            const [name, _id, cont] = r.data
            return _id
        })
        container_api_funcs.get(cid).then((cont: Container) => {
            obs.forEach((ob_id: string) => {
                cont.observation_blocks.push(ob_id)
            })
            return container_api_funcs.put(cid, cont)
        }).finally( () => {
            console.log('resetting table')
            // ob_select_object.reset_container_and_ob_select()
            ob_select_object.setTrigger(ob_select_object.trigger+1)
        })

    }

    return (
        <div className={"custom-toolbar-select"}>
            <Button onClick={setSelectedToContainer}>Add selected to Container</Button>
            <DropDown arr={props.containerNames} handleChange={handleChange} value={cid} placeholder={'container'} label={'available containers'} />
        </div>
    );
}

const ContainerTable = (props: Props) => {


    const observer_id = useObserverContext()
    const ob_select_object = useOBSelectContext()


    useEffect(() => {
        console.log('init container table')
    }, [])

    useEffect(() => {
        console.log('container table triggered')
    }, [ob_select_object.trigger])

    const handleSelect = (indexes: any) => {
    }

    const columns = [
        // "name",
        "ob_id",
        "container_name",
    ]

    const options: MUIDataTableOptions = {
        filterType: 'dropdown',
        onRowsDelete: () => false,
        selectableRows: 'multiple',
        customToolbarSelect: (selectedRows, displayData) => (
            <CustomToolbarSelect 
            selectedRows={selectedRows}
            displayData={displayData}
            containerNames={props.containerNames} />

        ),
        onRowSelectionChange: handleSelect
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