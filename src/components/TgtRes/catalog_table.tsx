import MUIDataTable, { MUIDataTableOptions } from "mui-datatables"
import { CatalogRow } from "../../typings/papahana"

interface Props {
    rows: CatalogRow[],
    selIdx: number | undefined
    setSelIdx: Function
}

const CatalogTable = (props: Props) => {

    const columns = [
        "Dist",
        "raHrsSexa",
        "decSexa",
        "ID0",
        "ID",
        "raDeg",
        "decDeg",
        "pmra",
        "pmdec",
        "g_mag",
        "b_mag",
        "r_mag"
    ]
    const options: MUIDataTableOptions = {
        filterType: 'dropdown',
        onRowsDelete: () => false,
        selectableRows: 'single'
    }

    return (
        <MUIDataTable
            data={props.rows}
            columns={columns}
            options={options}
            title={'Star Catalog'} />
    )
}

export default CatalogTable 