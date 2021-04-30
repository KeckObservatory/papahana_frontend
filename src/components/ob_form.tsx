import React  from "react";
import Form from '@rjsf/material-ui'
import { ObservationBlock, Signature } from "../papahana";
import { ISubmitEvent } from "@rjsf/core";
import { makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles( (theme: Theme) => ({
    root: {
        textAlign: 'left',
        margin: theme.spacing(3),
        display: 'flex',
        flexWrap: 'wrap',
    },
    form: {
        margin: theme.spacing(1),
    }
}))

const signatureSchema = {
  title: "Signature",
  type: "object",
  readonly: true,
  required: ["pi", "semester", "observers", "program", "container"],
  properties: {
    pi: {
      type: "string",
      title: "primary investigator",
      readonly: true
    },
    semester: {
      type: "string",
      title: "semester id"
    },
    observers: {
      type: "array",
      title: "observers",
      items: {
        "type": "string",
      },
      "uniqueItems": true
    },
    program: {
      title: "program",
      type: "integer"
    },
    container: {
      title: "container id",
      type: "integer"
    }
  }
}

const uiSchema = {
  pi: {
    "ui:readonly": true
  }
}

interface Props {
    ob: ObservationBlock,
    schema: object,
    uiSchema: object,
    setOB: Function
}

const log = (type: any) => console.log.bind(console, type);

export const parse_signature = (sig: Signature) => {
  
} 

export default function OBJSONForm(props: Props) {
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
  <h3>Form Editor</h3>
  <Form className={classes.form} 
        schema={props.schema}
        uiSchema={props.uiSchema}
        formData={props.ob.signature}
        onChange={log("changed")}
        onSubmit={handleSubmit}
        onError={log("errors")} />
  </div>
)}

OBJSONForm.defaultProps = {
  schema: signatureSchema,
  uiSchema: uiSchema
}
