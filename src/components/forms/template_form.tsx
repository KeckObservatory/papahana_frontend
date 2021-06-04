

import React, { } from "react"
import { ObservationBlock, Template, TemplateType } from "../../typings/papahana"
import { ISubmitEvent } from "@rjsf/core";
import Form from '@rjsf/material-ui'
import {useStyles} from './ob_form'
import DropDown from './../drop_down'

interface Props {
    ob: ObservationBlock,
    setOB: Function
    type: TemplateType
    templates: Template[],
    uiSchema?: object,
}

export const log = (type: any) => console.log.bind(console, type);

export default function TemplateForm(props: Props) {
  const classes = useStyles()
  const [ template, setTemplate ] = React.useState(props.templates[0])
  const names: string[] = props.templates.map( (template: Template) => { return template.name })

  const handleSubmit = ( evt: ISubmitEvent<ObservationBlock>): void => {
    props.setOB(evt.formData)
  }

return(
  <div className={classes.root}>
  <DropDown 
  arr={names}
  handleChange={setTemplate}
  value={template.name}
  placeholder={props.type }
  label={'Select Template'}
  />
  <Form className={classes.form} 
        schema={template.schema}
        uiSchema={props?.uiSchema}
        formData={props.ob}
        onChange={handleSubmit}
        onSubmit={handleSubmit}
        onError={log("errors")} />
  </div>
)}