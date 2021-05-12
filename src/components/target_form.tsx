import React from "react"
import { Target } from "../typings/papahana"
import * as obt from '../typings/ob_json_form'
import { ISubmitEvent, UiSchema  } from "@rjsf/core";
import Form from '@rjsf/material-ui'
import {useStyles, FormProps, log} from './ob_form'


const uiTargetSchema: UiSchema = {

}

const targetSchema: obt.JsonSchema = {
  title: "Target",
  type: "object",
  required: ["name", "ra", "dec",
   "equinox", "frame", "ra_offset",
   "dec_offset", "pa", "pm_ra", "pm_dec",
   "d_ra", "d_dec", "epoch", "obstime", "mag"
   ],
  properties: {
    name: {
      type: "string",
      title: "Target",
    },
    ra: {
      type: "string",
      title: "right ascension",
    },
    dec: {
      type: "string",
      title: "declination",
    },
    equinox: {
      type: "number",
      title: "equinox"
    },
    frame: {
        type: "string",
        title: "frame"
    },
    ra_offset: {
        type: "number",
        title: "right ascension offset"
    },
    dec_offset: {
        type: "number",
        title: "declination offset"
    },
    pa: {
        type: "number",
        title: "pa"
    },
    pm_ra: {
        type: "number",
        title: "pm right ascension"
    },
    pm_dec: {
        type: "number",
        title: "pm declination"
    },
    d_ra: {
        type: "number",
        title: "right ascension rate [degrees/second]"
    },
    d_dec: {
        type: "number",
        title: "declination rate [degrees/second]"
    },
    epoch: {
        type: "number",
        title: "epoch"
    },
    obstime: {
        type: "number",
        title: "obstime"
    },
    mag: {
        type: "array",
        title: "magnitude",
        items: {
            type: "object",
            required: [ "band", "magnitude"],
            properties: {
                band: {
                    type: "string",
                    title: "band type"
                },
                magnitude: {
                    type: "number",
                    title: "magnitude",
                    comment: "string",
                }
            }
        }
    },
    wrap: {
      title: "wrap",
      type: "string"
    },
    comment: {
      title: "comment",
      type: "string"
    }
  }
}

export default function TargetForm(props: FormProps) {
  const classes = useStyles()
  log(props.ob.target)
  const setTarget = (tgt: Target) => {
    let newOb = {...props.ob}
    newOb.target = tgt
    props.setOB(newOb)
  }
    const handleSubmit = ( evt: ISubmitEvent<Target>): void => {
    setTarget(evt.formData)
  }
return(
  <div className={classes.root}>
  <Form className={classes.form} 
        schema={props.schema}
        uiSchema={props.uiSchema}
        formData={props.ob.target}
        onChange={handleSubmit}
        onSubmit={handleSubmit}
        onError={log("errors")} />
  </div>
)}


const defaultTargetProps = {
  schema: targetSchema,
  uiSchema: uiTargetSchema
}

TargetForm.defaultProps = defaultTargetProps