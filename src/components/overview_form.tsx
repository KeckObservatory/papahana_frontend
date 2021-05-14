import React from "react"
import { ObservationBlock } from "../typings/papahana"
import { ISubmitEvent } from "@rjsf/core";
import Form from '@rjsf/material-ui'
import {useStyles, FormProps, log} from './ob_form'
import * as ovf from './../templates/ob_forms'


const defaultSignatureProps = {
  schema: ovf.overviewSchema,
  uiSchema: ovf.uiOverviewSchema
}

export default function OverviewForm(props: FormProps) {
  const classes = useStyles()
  const setOverview = (ob: ObservationBlock) => {
    props.setOB(ob)
  }
  const handleSubmit = ( evt: ISubmitEvent<ObservationBlock>): void => {
    setOverview(evt.formData)
  }
  console.log('ob')
  console.log(props.ob)
return(
  <div className={classes.root}>
  <Form className={classes.form} 
        schema={props.schema}
        uiSchema={props.uiSchema}
        formData={props.ob}
        onChange={handleSubmit}
        onSubmit={handleSubmit}
        onError={log("errors")} />
  </div>
)}


OverviewForm.defaultProps = defaultSignatureProps