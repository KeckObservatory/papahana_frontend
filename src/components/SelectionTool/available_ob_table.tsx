
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables"
import { OBCell } from "../../typings/papahana"
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton';
import FilterIcon from '@mui/icons-material/Filter';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    rows: OBCell[],
    setSelObs: Function
}

const columns = [
    {
        name: "id",
        label: "ID",
        options: {
            filter: true,
            sort: true
        }
    },
    {
        name: "name",
        label: "Name",
        options: {
            filter: true,
            sort: true
        }
    },
    {
        name: "type",
        label: "OB Type",
        options: {
            filter: true,
            sort: true
        }
    },
    {
        name: "ra",
        label: "RA",
        options: {
            filter: true,
            sort: true
        }
    },
    {
        name: "dec",
        label: "DEC",
        options: {
            filter: true,
            sort: true
        }
    },
    {
        name: "cid",
        label: "CID",
        options: {
            filter: true,
            sort: true
        }
    },
]

interface CTProps {
    selectedRows: any,
    setSelObs: Function,
    rows: OBCell[]
}

const CustomToolbarSelect = (props: CTProps) => {
    const handleClick = () => {
        //set selected rows here
        const selectedIdxs = Object.keys(props.selectedRows.lookup)
        //@ts-ignore
        const selObs = selectedIdxs.map(idx => props.rows[idx])
        console.log("click! current selected rows", props.selectedRows);
        props.setSelObs(selObs)
    };
    return (
        <div className={"custom-toolbar-select"}>
            <Tooltip title={"icon 2"}>
                <IconButton onClick={handleClick}>
                    <FilterIcon />
                </IconButton>
            </Tooltip>
        </div>
    );
}

const AvailableOBTable = (props: Props) => {

    const options: MUIDataTableOptions = {
        filterType: 'dropdown',
        onRowsDelete: () => false,
        customToolbarSelect: selectedRows => (
            <CustomToolbarSelect
                selectedRows={selectedRows}
                setSelObs={props.setSelObs}
                rows={props.rows} 
            />
        ),
        selectableRows: 'multiple'
    }

    return (
        <MUIDataTable
            data={props.rows}
            columns={['id', 'name', 'type', 'ra', 'dec', 'cid']}
            options={options}
            title={'Available OBS'} />
    )
}

export default AvailableOBTable