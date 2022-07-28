
import React, { useState } from 'react';
import { ObservationBlock } from "../../../typings/papahana";
import Button from "@mui/material/Button"

const EditOBInput = (value: string, tableMeta: any, updateValue: any) => {

    const handleClick = () => {
        const cd = tableMeta
        const ob_id = tableMeta.rowData[0]
        const sem_id = tableMeta.rowData[3]
        console.log(window.location)
        let url = `${window.location.origin}${window.location.pathname}`
        url += `?drawerOpen=1&ob_id=${ob_id}&sem_id=${sem_id}&tab_index=0`
        console.log(url)
        const win = window.open(url, '_blank');
        win?.focus();
    }

    return (
        <Button onClick={handleClick}>Edit OB</Button>
    )
}

export default EditOBInput 