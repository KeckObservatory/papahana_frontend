import MUIDataTable, { MUIDataTableOptions } from "mui-datatables"
import { Scoby } from "../../typings/papahana"
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton';
import FilterIcon from '@mui/icons-material/Filter';

interface Props {
    rows: Scoby[],
    setSelObs: Function
}

interface SelectedRows {
    data: {
        index: number;
        dataIndex: number;
    }[];
    lookup: {
        [key: number]: boolean;
    };
}

interface CTProps {
    selectedRows: SelectedRows,
    setSelObs: Function,
    rows: Scoby[]
}

const CustomToolbarSelect = (props: CTProps) => {
    const handleClick = () => {
        //set selected rows here
        const selectedIdxs = Object.keys(props.selectedRows.lookup)
        //@ts-ignore
        const selObs = selectedIdxs.map(idx => props.rows[idx])
        props.setSelObs(selObs)
    };
    return (
        <Tooltip title={"Chart Selected OBs"}>
            <IconButton onClick={handleClick}>
                <FilterIcon />
            </IconButton>
        </Tooltip>
    );
}

const AvailableOBTable = (props: Props) => {

    const options: MUIDataTableOptions = {
        filterType: 'dropdown',
        onRowsDelete: () => false,
        selectableRowsHeader: false,
        customToolbarSelect: selectedRows => (
            <CustomToolbarSelect
                selectedRows={selectedRows}
                setSelObs={props.setSelObs}
                rows={props.rows}
            />
        ),
        selectableRows: 'multiple'
    }

    const columns = [
        { name: 'ob_id', label: 'OB ID', options: { display: false } },
        { name: 'name', label: 'OB Name' },
        { name: 'container_name', label: 'Container Name' },
        { name: 'ob_type', label: 'OB Type' },
        { name: 'version', label: 'Version', options: { display: false } },
        { name: 'comment', label: 'Comment', options: { display: false } },
        { name: 'ra', label: 'RA', options: { display: true } },
        { name: 'dec', Label: 'Dec', options: { display: true } },
        { name: 'sem_id', Label: 'Semid', options: { display: false } },
    ]

    return (
        <MUIDataTable
            data={props.rows}
            columns={columns}
            options={options}
            title={'Available OBS'} />
    )
}

export default AvailableOBTable