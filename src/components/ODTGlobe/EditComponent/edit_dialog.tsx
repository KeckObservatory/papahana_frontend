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


    const [template, setTemplate] = useState({} as Template)
    const [component, setComponent] = useState({} as TemplateComponent)
    const [compKey, setCompKey] = useState('')
    const [schema, setSchema] = useState({})
    const [uiSchema, setUISchema] = useState({})

    useEffect(() => {
    }, [])

    const editComponent = () => {
        console.log('value', props.value, 'tableMeta', props.tableMeta)
        const ob_id = props.tableMeta.rowData[0]
        const compKey = props.tableMeta.columnData.name as keyof ObservationBlock
        setCompKey(compKey)
        console.log('id', ob_id, 'component:', compKey, 'component name:', props.value)
        ob_api_funcs.get(ob_id).then((ob: ObservationBlock) => {
            const comp = ob[compKey] as TemplateComponent
            setComponent(comp)
            const templateName = comp.metadata.name
            console.log('component', component)
            console.log('template name', templateName)

            get_template(templateName).then((template: Template) => {
                console.log('template retrieved', template)
                setTemplate(template)
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
        let newOBComponent = props.parentState.obComponent
        newOBComponent.parameters = evt.formData as object
        setComponent(newOBComponent)
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
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default EditDialog