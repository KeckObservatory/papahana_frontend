
import React from "react"
import { Science } from "../typings/papahana"
import * as obt from '../typings/ob_json_form'
import { ISubmitEvent, UiSchema  } from "@rjsf/core";
import Form from '@rjsf/material-ui'
import {useStyles, FormProps, log} from './ob_form'

const gratingSchema: obt.JSProperty = {
    type: "string",
    title: "grating",
    enum: ['BL','BM','BH1','BH2','RL','RM','RH1','RH2'],
}

const slicerSchema: obt.JSProperty = {
        "type": "string",
        "title": "Slicer",
        "enum": [
          "Small",
          "Medium",
          "Large"
        ]
}

const ditherSchema: obt.JsonSchema = {
    title: 'sequence dither', 
    type: 'object',
    required: ['min', 'max', 'letter'],
    properties: {
      min: {
      type: "number",
      title: "minimum",
      },
      max: {
      type: "number",
      title: "maximum",
      },
      letter: {
      type: "string",
      title: "letter",
      }
    }
}

const scienceSchema: obt.JSProperty = {
  title: "Science item",
  type: "object",
  required: ['name', 'version', 'det1_exptime', 'det2_exptime', 'det1_nexp', 'det2_nexp', 'cfg_cam_grating', 'cfg_cam_cwave', 'cfg_slicer'],
  properties: {
    name: {
      type: "string",
      title: "name",
    },
    version: {
      type: "string",
      title: "version"
    },
    det1_exptime: {
      type: "number",
      title: "detector 1 exposure time [ms]",
    },
    det1_nexp: {
      type: "number",
      title: "number of exposure from detector 1",
    },
    det2_exptime: {
      type: "number",
      title: "detector 2 exposure time [ms]",
    },
    det2_nexp: {
      type: "number",
      title: "number of exposure from detector 2",
    },
    seq_ditarray: ditherSchema,
    seq_ndither: {
      type: "number",
      title: "number of sequence dithers",
    },
    cfg_cam_grating: gratingSchema,
    cfg_cam_slicer: slicerSchema,
    comment: {
      title: "comment",
      type: "string",
    }
  }
}

const uiScienceSchema: UiSchema = {
  version: {
    "ui:readonly": true,
    "ui:widget": "hidden"
  },
  cfg_cam_grating: {
    "ui:widget": "radio",
    "ui:options": {
        "inline": true
    },
  },
  cfg_cam_slicer: {
    "ui:widget": "radio",
    "ui:options": {
        "inline": true
    }
  },
  comment: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 2
    },
  }
}

const scienceArraySchema: obt.JsonSchema = {
    type: 'object',
    title: 'Science(s)',
    properties: {
      science: {
        type: 'array',
        title: 'science',
        items: scienceSchema
      }
    }
}

const uiScienceArraySchema: UiSchema = {
    science: {
        items: uiScienceSchema
    }
}

const defaultScienceArrayProps = {
  schema: scienceArraySchema,
  uiSchema: uiScienceArraySchema
}

const defaultScienceProps = {
  schema: scienceSchema,
  uiSchema: uiScienceSchema
}
export default function ScienceForm(props: FormProps) {
  const classes = useStyles()
  const setSignature = (sci: Science[]) => {
    let newOb = {...props.ob}
    newOb.science = sci
    props.setOB(newOb)
  }
  const handleSubmit = ( evt: ISubmitEvent<Science[]>): void => {
    setSignature(evt.formData)
  }
  const scienceForm = { 'science': props.ob.science }
return(
  <div className={classes.root}>
  <Form className={classes.form} 
        schema={props.schema}
        uiSchema={props.uiSchema}
        formData={scienceForm}
        onChange={handleSubmit}
        onSubmit={handleSubmit}
        onError={log("errors")} />
  </div>
)}

ScienceForm.defaultProps = defaultScienceArrayProps