import React from "react"
import { ObservationBlock, Signature } from "../typings/papahana"
import * as obt from '../typings/ob_json_form'
import { ISubmitEvent, UiSchema  } from "@rjsf/core";
import Form from '@rjsf/material-ui'
import {useStyles, FormProps, log} from './ob_form'


const signatureSchema: obt.JsonSchema = {
  title: "Signature",
  type: "object",
  required: ["pi", "semesters", "observers", "program" ],
  properties: {
    pi_id: {
      type: "string",
      title: "primary investigator",
      readonly: true 
    },
    sem_id: {
      type: "array",
      items: {
        type: "string",
      },
      title: "semester id",
      comment: "text"
    },
    instrument: {
      type: "string",
      title: "instrument"
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

const overviewSchema: obt.JsonSchema = {
  title: "Overview",
  type: "object",
  required: ["priority", "version", "status"],
  properties: {
    priority: {
      title: 'priority',
      type: 'number',
    },
    status: {
      title: 'status',
      type: 'string'
    },
    version: {
      title: 'version',
      type: 'string',
    },
    signature: signatureSchema,
    associations: {
      type: "array",
      title: "associations",
      items: {
        type: "string",
      },
      uniqueItems: true
    },
    comments: {
      type: "string",
      title: "comments"
    }
  }
}

const uiOverviewSchema: UiSchema = {
  version: {
    "ui:readonly": true,
    "ui:widget": "hidden"
  },
  status: {
    "ui:readonly": true,
    "ui:widget": "hidden"
  },
  signature: uiSignatureSchema,
  comment: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 2
    },
  }
}


const defaultSignatureProps = {
  schema: overviewSchema,
  uiSchema: uiOverviewSchema
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
  console.log(ob)
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