import React, { useState } from 'react';
import Button from "@mui/material/Button"
import { ob_api_funcs } from "../../../api/ApiRoot"
import { get_template } from "../../../api/utils"
import { ObservationBlock, Template, TemplateComponent} from "../../../typings/papahana";
import EditDialog from './edit_dialog';


const ComponentInput = (value: string, tableMeta: any, updateValue: any) => {
    return (
        <EditDialog value={value} tableMeta={tableMeta} />
    )
}

export default ComponentInput