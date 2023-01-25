import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button"
import { Template, ObservationBlock, CommonParameters } from "../../../typings/papahana";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { JSONSchema7 } from 'json-schema'
import * as form_schemas from './../../forms/schemas'
import { useStyles, Form, log } from './../../forms/template_form'
import { template_to_schema } from './../../forms/common_parameters_template_form'
import { ISubmitEvent, UiSchema as rUiSchema } from "@rjsf/core";
import { ob_api_funcs } from '../../../api/ApiRoot';
import { get_template } from '../../../api/utils';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

interface Props {
    value: any;
    tableMeta: any;
}

const EditCPDialog = (props: Props) => {

    const ref = React.useRef(null)
    const classes = useStyles()
    const [open, setOpen] = useState(false);

    const [instrument, setInstrument] = useQueryParam('instrument', withDefault(StringParam, 'KCWI'))

    const [component, setComponent] = useState({} as CommonParameters)
    const [schemas, setSchemas] = useState({} as { [id: string]: JSONSchema7 })
    const [ob, setOB] = useState({} as ObservationBlock)

    const compKey = props.tableMeta.columnData.name as keyof ObservationBlock

    const uiSchema = form_schemas.getUiSchema(compKey)
    const sub_forms = [
        'instrument_parameters',
        'detector_parameters',
        'tcs_parameters'] as unknown as (keyof CommonParameters)[]
    useEffect(() => {

    }, [])

    const editComponent = () => {
        const ob_id = props.tableMeta.rowData[0]
        ob_api_funcs.get(ob_id).then((ob: ObservationBlock) => {
            const comp = ob[compKey] as CommonParameters
            setComponent(comp)
            setOB(ob)
            const templateName = comp.metadata.name
            let newSchemas = { ...schemas }
            get_template(templateName, instrument).then((template: Template) => {
                sub_forms.forEach((formName: keyof Template) => {
                    const subTemplate = template[formName] as unknown as Template
                    const schema = template_to_schema(subTemplate, formName)
                    newSchemas[formName] = schema
                })
                setSchemas(newSchemas)
            })

        })
    }

    const handleClickOpen = () => {
        setOpen(true);
        console.log('setting to to open dialog')
        editComponent()
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleChange = (evt: ISubmitEvent<any>, formName: keyof CommonParameters) => {
        //@ts-ignore
        let newComponent = { ...component } as any
        newComponent[formName] = evt.formData
        setComponent(newComponent)
    }

    const handleSubmit = () => {
        let newOBComponent = { ...component }
        let newOB = { ...ob }
        //@ts-ignore
        newOB[compKey] = newOBComponent
        const ob_id = props.tableMeta.rowData[0]
        ob_api_funcs.put(ob_id, newOB).finally(() => {
            setOpen(false);
        })
    }

    const dialog_content = () => {
        return (
            <div ref={ref} className={classes.root}>
                {sub_forms.map((formName: keyof CommonParameters) => {
                    //@ts-ignore
                    const formData = component[formName]
                    const schema = schemas[formName]
                    const handleSubChange = (evt: ISubmitEvent<CommonParameters>) => {
                        handleChange(evt, formName)
                    }
                    return (
                        <Accordion key={formName}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                aria-label="Expand"
                            >
                                <Typography variant={"h6"} >{formName}</Typography>
                            </AccordionSummary>
                            <AccordionDetails >
                                {schema &&
                                    <Form className={classes.form}
                                        schema={schema}
                                        formData={formData}
                                        onChange={handleSubChange}
                                        onError={log("errors")}><div></div></Form>
                                }
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
            </div>
        )
    }

    return (

        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                {props.value}
            </Button>
            {open && (
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Edit Common Parameters</DialogTitle>
                    <DialogContent>
                        {dialog_content()}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </DialogActions>
                </Dialog>
            )}
        </React.Fragment>
    )
}

export default EditCPDialog