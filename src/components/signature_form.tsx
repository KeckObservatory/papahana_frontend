import React from "react"
import { Signature } from "../typings/papahana"
import * as obt from '../typings/ob_json_form'
import { ISubmitEvent, UiSchema  } from "@rjsf/core";
import Form from '@rjsf/material-ui'
import {useStyles, FormProps, log} from './ob_form'


const signatureSchema: obt.JsonSchema = {
  title: "Signature",
  type: "object",
  required: ["pi", "semesters", "observers", "program" ],
  properties: {
    pi: {
      type: "string",
      title: "primary investigator",
      readonly: true 
    },
    semesters: {
      type: "array",
      items: {
        type: "string",
      },
      title: "semester id",
      comment: "text"
    },
    observers: {
      type: "array",
      title: "observers",
      items: {
        type: "string",
      },
      uniqueItems: true
    },
    program: {
      title: "program",
      type: "integer"
    },
    comment: {
      title: "comment",
      type: "string"
    }
  }
}
const uiSignatureSchema: UiSchema = {
  pi: {
    "ui:readonly": true,
    "ui:widget": "hidden"
  },
  comment: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 2
    },
  }
}


const defaultSignatureProps = {
  schema: signatureSchema,
  uiSchema: uiSignatureSchema
}


export default function SignatureForm(props: FormProps) {
  const classes = useStyles()
  const setSignature = (sig: Signature) => {
    let newOb = {...props.ob}
    newOb.signature = sig
    props.setOB(newOb)
  }
  const handleSubmit = ( evt: ISubmitEvent<Signature>): void => {
    setSignature(evt.formData)
  }
return(
  <div className={classes.root}>
  <Form className={classes.form} 
        schema={props.schema}
        uiSchema={props.uiSchema}
        formData={props.ob.signature}
        onChange={log("changed")}
        onSubmit={handleSubmit}
        onError={log("errors")} />
  </div>
)}


SignatureForm.defaultProps = defaultSignatureProps