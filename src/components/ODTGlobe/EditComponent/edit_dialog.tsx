import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button"
import { Template, OBComponent, TemplateComponent, ObservationBlock } from "../../../typings/papahana";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as schemas from './../../forms/schemas'
import { useStyles, init_form_data, get_schema, Form, log, template_to_schema } from './../../forms/template_form'
import { ISubmitEvent, UiSchema as rUiSchema } from "@rjsf/core";
import { ErrorSchema } from 'react-jsonschema-form';
import { ob_api_funcs } from '../../../api/ApiRoot';
import { get_template } from '../../../api/utils';

interface Props {
    value: any;
    tableMeta: any;
}



const EditDialog = (props: Props) => {
    const classes = useStyles()
    const [open, setOpen] = useState(false);


    const [component, setComponent] = useState({} as TemplateComponent)
    const [schema, setSchema] = useState({})
    const [uiSchema, setUISchema] = useState({})
    const [ob, setOB] = useState({} as ObservationBlock)

    const compKey = props.tableMeta.columnData.name as keyof ObservationBlock

    useEffect(() => {
    }, [])

    const editComponent = () => {
        console.log('value', props.value, 'tableMeta', props.tableMeta)
        const ob_id = props.tableMeta.rowData[0]
        console.log('id', ob_id, 'component:', compKey, 'component name:', props.value)
        ob_api_funcs.get(ob_id).then((ob: ObservationBlock) => {
            const comp = ob[compKey] as TemplateComponent
            setComponent(comp)
            setOB(ob)
            const templateName = comp.metadata.name
            console.log('component', component)
            console.log('template name', templateName)

            get_template(templateName).then((template: Template) => {
                console.log('template retrieved', template)
                const schema = template_to_schema(template)
                const uiSchema = schemas.getUiSchema(compKey)
                setSchema(schema)
                setUISchema(uiSchema)
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


    const handleChange = (evt: ISubmitEvent<any>, es?: ErrorSchema) => {
        //@ts-ignore
        let newOBComponent = { ...component }
        newOBComponent.parameters = evt.formData as object
        setComponent(newOBComponent)
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


    return (

        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                {props.value}
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <Form className={classes.form}
                        schema={schema}
                        uiSchema={uiSchema as rUiSchema}
                        formData={component.parameters}
                        onChange={handleChange as any}
                        onError={log("errors")} ><div></div></Form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default EditDialog