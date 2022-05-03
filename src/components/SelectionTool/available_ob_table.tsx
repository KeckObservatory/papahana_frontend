import MUIDataTable, { MUIDataTableOptions } from "mui-datatables"
import { OBCell, Scoby } from "../../typings/papahana"
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
    console.log('rows', props.rows)

    return (
        <MUIDataTable
            data={props.rows}
            columns={['id', 'name', 'type', 'ra', 'dec', 'cid']}
            options={options}
            title={'Available OBS'} />
    )
}

export default AvailableOBTable