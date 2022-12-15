import React, { } from "react"
import { OBComponent } from "../../typings/papahana"
import { ISubmitEvent, UiSchema as rUiSchema } from "@rjsf/core";
// import Form from '@rjsf/material-ui'
import { JSONSchema7 } from 'json-schema'
import * as schemas from './schemas'
import { useStyles, init_form_data, Props, get_schema, Form, log } from './template_form'
import { TargetResolverDialog } from "../TgtRes/target_resolver_dialog";

export default function TargetTemplateForm(props: Props): JSX.Element {
  const classes = useStyles()
  const [schema, setSchema] = React.useState({} as JSONSchema7)
  const uiSchema = schemas.getUiSchema(props.id)
  let initFormData = init_form_data(props.obComponent, props.id)
  const ref = React.useRef(null)
  const [formData, setFormData] = React.useState(initFormData)

  React.useEffect(() => {
    get_schema(props.obComponent, props.id).then((initSchema: JSONSchema7) => {
      console.log('target schema', initSchema, props.obComponent, props.id)
      setSchema(initSchema)
    })
  }, [])

  React.useEffect(() => {
    let newFormData = init_form_data(props.obComponent, props.id)
    setFormData(() => newFormData)
  }, [props.obComponent])

  const handleChange = (evt: ISubmitEvent<OBComponent>): void => {
    //@ts-ignore
    let newFormData = { ...evt.formData }
    // check if form changed heights
    props.updateOB(props.id, newFormData)
    setFormData(() => newFormData)
  }

  return (
    <div ref={ref} className={classes.root}>
      <TargetResolverDialog id={props.id} obComponent={props.obComponent} updateOB={props.updateOB} />
      <Form className={classes.form}
        schema={schema}
        uiSchema={uiSchema as rUiSchema}
        formData={formData}
        onChange={handleChange}
        onError={log("errors")} ><div></div></Form>
    </div>
  )
}