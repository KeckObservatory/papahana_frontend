import React, { useEffect, useState } from 'react';
import { ErrorSchema, IChangeEvent, UiSchema } from 'react-jsonschema-form';
import { ISubmitEvent, UiSchema as rUiSchema } from "@rjsf/core";
import { OBComponent, Template } from '../../../typings/papahana';
import { Form, log, template_to_schema } from './../../forms/template_form'
import * as schemas from './../../forms/schemas'
import { State } from './wnc_stepper_dialog_content'

interface Props {
    parentState: State 
    setParentState: Function
}

const NewTemplateForm = function (props: Props) {
    const schema = template_to_schema(props.parentState.template)
    const uiSchema = schemas.getUiSchema(props.parentState.id)



  const handleChange = (evt: ISubmitEvent<OBComponent>, es?: ErrorSchema) => {
    //@ts-ignore
    let newOBComponent = props.parentState.obComponent
    newOBComponent.parameters = evt.formData as object
    props.setParentState({
        ...props.parentState,
        obComponent: newOBComponent 
    })
  }

    return (
      <Form
        schema={schema}
        uiSchema={uiSchema as rUiSchema}
        formData={props.parentState.obComponent.parameters}
        onChange={handleChange}
        onError={log("errors")} ><div></div></Form>
    )
}

export default NewTemplateForm