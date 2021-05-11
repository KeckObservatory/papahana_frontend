
import React from "react"
import { Acquisition } from "../typings/papahana"
import * as obt from '../typings/ob_json_form'
import { ISubmitEvent, UiSchema  } from "@rjsf/core";
import Form from '@rjsf/material-ui'
import {useStyles, FormProps, log} from './ob_form'


const uiAcquisitionSchema: UiSchema = {
    version: {
      "ui:readonly": true,
      "ui:hidden": true
    },
    guider_po: {
        "ui:widget": "radio",
        "ui:options": {
          "inline": true
        }
      },
    guider_gs_mode: {
        "ui:widget": "radio",
        "ui:options": {
          "inline": true
        }
      },
}

const acquisitionSchema: obt.JsonSchema = {
  title: "Acquisition",
  type: "object",
  required: ["name", "version", "script", "guider_po", "guider_ps_ra", "guider_gs_dec", "guider_gs_mode"
   ],
  properties: {
    name: {
      type: "string",
      title: "acquisition name",
    },
    version: {
      type: "string",
      title: "version",
    },
    script: {
      type: "string",
      title: "script",
    },
    guider_po: {
        "type": "string",
        "title": "guider po",
        "enum": [
          "REF",
          "IFU"
        ]
      },
    guider_gs_ra: {
        type: "number",
        title: "guide star right ascension"
    },
    guider_gs_dec: {
        type: "number",
        title: "guide star declination"
    },
    guider_gs_mode: {
        type: "string",
        title: "guide star mode",
        enum: [
            'Automatic',
            'Operator',
            'User'
        ]
    },
    comment: {
      title: "comment",
      type: "string"
    }
  }
}

export default function AcquisitionForm(props: FormProps) {
  const classes = useStyles()
  const setAcquisition = (acq: Acquisition) => {
    let newOb = {...props.ob}
    newOb.acquisition = acq 
    props.setOB(newOb)
  }
    const handleSubmit = ( evt: ISubmitEvent<Acquisition>): void => {
    setAcquisition(evt.formData)
  }
return(
  <div className={classes.root}>
  <Form className={classes.form} 
        schema={props.schema}
        uiSchema={props.uiSchema}
        formData={props.ob.acquisition}
        onChange={log("changed")}
        onSubmit={handleSubmit}
        onError={log("errors")} />
  </div>
)}


const defaultAcquisitionProps = {
  schema: acquisitionSchema,
  uiSchema: uiAcquisitionSchema
}

AcquisitionForm.defaultProps = defaultAcquisitionProps