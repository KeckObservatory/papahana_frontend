import MUIDataTable, { MUIDataTableOptions } from "mui-datatables"
import { CatalogRow } from "../../typings/papahana"

interface Props {
    rows: CatalogRow[],
    selIdx: number | undefined
    setFiltCatalog: Function
    setSelIdx: Function
}


interface CTProps {
}

const CustomToolbarSelect = (props: CTProps) => {
    return (
        <div className={"custom-toolbar-select"}>
        </div>
    );
}


const CatalogTable = (props: Props) => {


    const handleSelect = (indexes: any) => {
        const idx = indexes[0].index
        console.log('idx selected', idx)
        props.setSelIdx(idx)
    }

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
        selectableRows: 'single',
        rowsSelected: [props.selIdx],
        customToolbarSelect: () => (
            <CustomToolbarSelect />
        ),
        onRowSelectionChange: handleSelect
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