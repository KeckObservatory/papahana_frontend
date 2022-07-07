import React, { useEffect, useState } from 'react';
import { ErrorSchema, IChangeEvent, UiSchema } from 'react-jsonschema-form';
import { ISubmitEvent, UiSchema as rUiSchema } from "@rjsf/core";
import { OBComponent, Template } from '../../../typings/papahana';
import { useStyles, init_form_data, get_schema, Form, log, template_to_schema } from './../../forms/template_form'
import * as schemas from './../../forms/schemas'
import { State } from './wnc_stepper_dialog_content'

interface Props {
    parentState: State 
    setParentState: Function
}

const NewTemplateForm = function (props: Props) {
    const classes = useStyles()
    const schema = template_to_schema(props.parentState.template)
    const uiSchema = schemas.getUiSchema(props.parentState.id)

  const handleChange = (evt: ISubmitEvent<OBComponent>, es?: ErrorSchema) => {
    //@ts-ignore
    let formData = { ...evt.formData }
    props.setParentState({
        ...props.parentState,
        formData
    })
  }

    return (
      <Form className={classes.form}
        schema={schema}
        uiSchema={uiSchema as rUiSchema}
        formData={props.parentState.formData}
        onChange={handleChange}
        onError={log("errors")} ><div></div></Form>
    )
}

export default NewTemplateForm