

import React, { } from "react"
import { Acquisition, KCWIScience, ObservationBlock, Science, Target, Template, TemplateType } from "../../typings/papahana"
import { ISubmitEvent } from "@rjsf/core";
import Form from '@rjsf/material-ui'
import {useStyles} from './ob_form'
import DropDown from './../drop_down'

interface Props {
    dataForm: FormData,
    sendToOB: Function
    type: keyof ObservationBlock 
    templates: Template[],
    uiSchema?: object,
}
export const log = (type: any) => console.log.bind(console, type);

type FormData = Science[] | Acquisition | Target | undefined


export default function TemplateForm(props: Props) {
  const classes = useStyles()
  const [ template, setTemplate ] = React.useState(props.templates[0])
  console.log(template)
  const templateNames: string[] = props.templates.map( (template: Template) => { return template.name })
  const handleChange = ( evt: ISubmitEvent<FormData>): void => {
    let newFormData = {...evt.formData}  
    props.sendToOB(newFormData)
  }  
  
  const handleTemplateChange = (event: string) => {
      const templateName = event
      const newTemplate = props.templates.find( (template: Template) => {
        return template.name === templateName
      }) as Template 
      console.log(newTemplate)
      setTemplate(newTemplate)
  };


return(
  <div className={classes.root}>
  <DropDown 
  arr={templateNames}
  handleChange={handleTemplateChange}
  value={template.name}
  placeholder={props.type }
  label={'Select Template'}
  />
  <Form className={classes.form} 
        schema={template.schema}
        uiSchema={props?.uiSchema}
        formData={props.dataForm}
        onChange={handleChange}
        onError={log("errors")} />
  </div>
)}