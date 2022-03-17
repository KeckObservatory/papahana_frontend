import { useState, useEffect } from 'react';
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables"
import { Container, Scoby } from "../../typings/papahana";
import Button from '@mui/material/Button';
import { make_semid_scoby_table } from '../../api/utils';
import DropDown from '../drop_down'
import { useObserverContext } from '../App'
import { useSemIDContext } from './ob_select'
import { container_api_funcs } from '../../api/ApiRoot'

interface Props {
}


interface CTProps {
    containers: string[],
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

    const handleChange = (selectedContainer: string) => {
        console.log('changed', selectedContainer)
        setContainer(selectedContainer)
    }

    const [_, reset_container_and_ob_select] = useSemIDContext()

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
            reset_container_and_ob_select()
        })

    }

    // const removeSelectedFromContainers = () => {
    //     console.log('removing selected from all containers')
    //     console.log(props.selectedRows.data)
    // }

    return (
        <div className={"custom-toolbar-select"}>
            <Button onClick={setSelectedToContainer}>Add selected to Container</Button>
            {/* <Button onClick={removeSelectedFromContainers}>remove selected from containers</Button> */}
            <DropDown arr={props.containers} handleChange={handleChange} value={cid} placeholder={'container'} label={'available containers'} />
        </div>
    );
}

const ContainerTable = (props: Props) => {

    const [rows, setRows] = useState([] as Scoby[])
    const [containers, setContainers] = useState([] as string[])

    const observer_id = useObserverContext()
    const [sem_id, reset_container_and_ob_select] = useSemIDContext()

    useEffect(() => {
        make_semid_scoby_table(sem_id, observer_id).then((scoby: Scoby[]) => {
            setRows(scoby)
            const contSet = new Set()
            scoby.forEach((sc: Scoby) => contSet.add(sc.container_id))
            setContainers(Array.from(contSet) as string[])
        })
    }, [])

    const handleSelect = (indexes: any) => {
    }

    const columns = [
        "name",
        "ob_id",
        "container_id",
    ]

    const options: MUIDataTableOptions = {
        filterType: 'dropdown',
        onRowsDelete: () => false,
        selectableRows: 'multiple',
        customToolbarSelect: (selectedRows, displayData) => (
            <CustomToolbarSelect selectedRows={selectedRows} displayData={displayData} containers={containers} />
        ),
        onRowSelectionChange: handleSelect
    }

    return (
        <MUIDataTable
            data={rows}
            columns={columns}
            options={options}
            title={'Observation Block Table'} />
    )
}

export default ContainerTable 