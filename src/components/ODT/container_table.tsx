import { useState, useEffect } from 'react';
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables"
import { Scoby } from "../../typings/papahana";
import Button from '@mui/material/Button';
import { make_scoby_table } from '../../api/utils';
import DropDown from '../drop_down'


interface Props {
    observer_id: string
}


interface CTProps {
    containers: string[],
    selectedRows: any
}

const CustomToolbarSelect = (props: CTProps) => {
    const [container, setContainer] = useState('')
    const handleChange = (selectedContainer: string) => {
        console.log('changed', selectedContainer)
        setContainer(selectedContainer)
    }

    const setSelectedToContainer = () => {
        console.log('setting selected to container')
        console.log(props.selectedRows.data)
    }

    const removeSelectedFromContainers = () => {
        console.log('removing selected from all containers')
        console.log(props.selectedRows.data)
    }

    return (
        <div className={"custom-toolbar-select"}>
            <Button onClick={setSelectedToContainer}>Add selected to Container</Button>
            <Button onClick={removeSelectedFromContainers}>remove selected from containers</Button>
            <DropDown arr={props.containers} handleChange={handleChange} value={container} placeholder={'container'} label={'available containers'} />
        </div>
    );
}

const ContainerTable = (props: Props) => {

    const [ rows, setRows ] = useState([] as Scoby[])
    const [ containers, setContainers ] = useState([] as string[])


    useEffect(() => {
        make_scoby_table(props.observer_id).then( (scoby: Scoby[]) => {
            setRows(scoby)
            const contSet = new Set()
            scoby.forEach((sc: Scoby) => contSet.add(sc.container_id))
            setContainers(Array.from(contSet) as string[])
        })
    }, [])

    const handleSelect = (indexes: any) => {
        console.log('idxs selected', indexes)
    }

    const columns = [
        "sem_id",
        "container_id",
        "ob_id",
        "name"
    ]

    const options: MUIDataTableOptions = {
        filterType: 'dropdown',
        onRowsDelete: () => false,
        selectableRows: 'multiple',
        customToolbarSelect: (selectedRows) => (
            <CustomToolbarSelect selectedRows={selectedRows} containers={containers}/>
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