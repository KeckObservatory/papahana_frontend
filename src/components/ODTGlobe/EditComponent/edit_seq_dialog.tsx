import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button"
import { Template, TemplateComponent, ObservationBlock, Science } from "../../../typings/papahana";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as formSchemas from './../../forms/schemas'
import { Form, log, template_to_schema } from './../../forms/template_form'
import { ISubmitEvent, UiSchema as rUiSchema } from "@rjsf/core";
import { UiSchema } from "react-jsonschema-form"
import { ErrorSchema } from 'react-jsonschema-form';
import { ob_api_funcs } from '../../../api/ApiRoot';
import { get_template } from '../../../api/utils';
import { JSONSchema7 } from 'json-schema'
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

const EditSeqDialog = (props: Props) => {

    const ref = React.useRef(null)
    const [open, setOpen] = useState(false);


    const [component, setComponent] = useState([] as Science[])
    const [schemas, setSchemas] = useState([] as JSONSchema7[])
    const [uiSchemas, setUISchemas] = useState([] as UiSchema[])
    const [ob, setOB] = useState({} as ObservationBlock)

    const [instrument, setInstrument] = useQueryParam('instrument', withDefault(StringParam, 'KCWI'))

    let compKey = props.tableMeta.columnData.name as keyof ObservationBlock
    compKey = compKey.includes('number_sequences') ? 'observations' : compKey

    useEffect(() => {
    }, [])

    const editComponent = () => {
        // console.log('value', props.value, 'tableMeta', props.tableMeta)
        const ob_id = props.tableMeta.rowData[0]
        // console.log('id', ob_id, 'component:', compKey, 'component name:', props.value)
        ob_api_funcs.get(ob_id).then((ob: ObservationBlock) => {
            setInstrument(ob.metadata.instrument)
            const comp = ob[compKey] as Science[]
            setComponent(comp)
            setOB(ob)

            comp.forEach((sci: Science) => {
                const templateName = sci.metadata.name
                // console.log('sequence component', sci)
                // console.log('template name', templateName)

                get_template(templateName, instrument).then((template: Template) => {
                    // console.log('template retrieved', template)
                    const schema = template_to_schema(template)
                    const uiSchema = formSchemas.getUiSchema(compKey)
                    setSchemas((currSchemas) => [...currSchemas, schema])
                    setUISchemas((currUISchemas) => [...currUISchemas, uiSchema])
                })
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


    const handleSeqChange = (idx: number, evt: ISubmitEvent<any>, es?: ErrorSchema) => {
        //@ts-ignore
        let newOBComponent = [...component]
        newOBComponent[idx].parameters = evt.formData as object
        setComponent(newOBComponent)
    }

    const handleSubmit = () => {
        let newOBComponent = [...component]
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
            <div ref={ref} style={{
                textAlign: 'left',
                margin: '0px',
                display: 'flex',
                flexWrap: 'wrap',
            }}>
                {component.map((seq: Science, idx: number) => {
                    //@ts-ignore
                    const formData = seq.parameters
                    const schema = schemas[idx]
                    // console.log('formData', formData, 'schema', schema)
                    const uiSchema = uiSchemas[idx]
                    const formName = 'sequence_' + idx
                    const handleSubChange = (evt: ISubmitEvent<any>, es?: ErrorSchema) => {
                        handleSeqChange(idx, evt, es)
                    }
                    return (
                        <Accordion key={formName} >
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
                                    <Form
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
                    <DialogTitle>Edit Sequences</DialogTitle>
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

export default EditSeqDialog