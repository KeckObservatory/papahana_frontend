import { UiSchema } from "react-jsonschema-form"
import { JsonSchema } from "../../typings/ob_json_form"


export const getUiSchema = (id: string): UiSchema => {
  let uiSchema: UiSchema
  if (id === 'target') {
    uiSchema = uiTargetSchema
  }
  else if (id === 'acquisition') {
    uiSchema = uiAcquisitionSchema
  }
  else if (id === 'metadata') {
    uiSchema = uiMetadataSchema
  }
  else if (id.includes('sequence')) {
    uiSchema = uiScienceSchema
  }
  else if (id === 'status') {
    uiSchema = uiStatusSchema
  }
  else if (id === 'time_constraints') {
    uiSchema = uiTimeConstraintSchema
  }
  else {
    console.log(`component ${id} has undefined schema`)
    uiSchema = {}
  }
  return uiSchema
}

export const metadataSchema: JsonSchema = {
  title: "Metadata",
  type: "object",
  required: ["name", "instrument", "version", "ob_type", "pi_id", "sem_id"],
  properties: {
    name: {
      type: "string",
      title: "Name"
    },
    instrument: {
      type: "string",
      title: "Instrument"
    },
    version: {
      type: "string",
      title: "Version"
    },
    pi_id: {
      type: "string",
      title: "PI ID"
    },
    ob_type: {
      type: "string",
      title: "OB Type",
      enum: ["Science", "Engineering", "Calibration"]
    },
    sem_id: {
      type: "string",
      title: "Semid"
    },
    comment: {
      type: "string",
      title: "Comment"
    },
  }
}

export const timeConstraintSchema: JsonSchema = {
  title: "Time Constraints",
  type: "object",
  required: ["start_datetime", "end_datetime"],
  properties: {
    time_constraints: {
        type: "array",
        title: "time constraints",
        items: {
            type: "object",
            required: [ "start_datetime", "end_datetime"],
            properties: {
                start_datetime: {
                    type: "string",
                    title: "start time",
                    format: "date-time"
                },
                end_datetime: {
                    type: "string",
                    title: "end time",
                    format: "date-time"
                }
            }
        }
    },
  }
}

export const statusSchema: JsonSchema = {
  title: "Status",
  type: "object",
  properties: {
    state: {title: "state", type: "integer"},
    priority: {title: "priority", type: "integer"},
    current_seq: {title: "current sequence", type: "integer"},
    current_step: {title: "current step", type: "integer"},
    current_exp: {title: "current exp", type: "integer"},
    executions: {
      title: "executions", type: "array",
      items: {type: "string", format: "date-time"}
    },
    deleted: {title: "deleted", type: "boolean"}
  }
  
}

export const uiStatusSchema: UiSchema = {
  state: {
    "ui:readonly": true,
  },
  current_seq: {
    "ui:readonly": true,
  },
  current_step: {
    "ui:readonly": true,
  },
  current_exp: {
    "ui:readonly": true,
  },
  deleted: {
    "ui:readonly": true,
  },
  executions: {
    "ui:readonly": true,
  },
}


export const targetSchema: JsonSchema = {
  title: "Target",
  type: "object",
  required: ["name", "ra", "dec",
   "equinox", "frame", "ra_offset",
   "dec_offset", "pa", "pm_ra", "pm_dec",
   "d_ra", "d_dec", "epoch", "obstime", "mag"
   ],
  properties: {
    target_info_name: {
      type: "string",
      title: "Target",
    },
    target_coord_ra: {
      type: "string",
      title: "right ascension",
    },
    target_coord_dec: {
      type: "string",
      title: "declination",
    },
    equinox: {
      type: "number",
      title: "equinox"
    },
    target_coord_frame: {
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
    rot_cfg_pa: {
        type: "number",
        title: "pa"
    },
    target_coord_pm_ra: {
        type: "number",
        title: "pm right ascension"
    },
    target_coord_pm_dec: {
        type: "number",
        title: "pm declination"
    },
    target_coord_dra: {
        type: "number",
        title: "right ascension rate [degrees/second]"
    },
    target_coord_ddec: {
        type: "number",
        title: "declination rate [degrees/second]"
    },
    target_coord_epoch: {
        type: "number",
        title: "epoch"
    },
    seq_constraint_obstime: {
        type: "number",
        title: "obstime"
    },
    target_info_magnitude: {
        type: "array",
        title: "magnitude",
        items: {
            type: "object",
            required: [ "band", "mag"],
            properties: {
                target_info_band: {
                    type: "string",
                    title: "band type"
                },
                target_info_mag: {
                    type: "number",
                    title: "magnitude",
                    comment: "string",
                }
            }
        }
    },
    target_info_finder: {
      format: "data-url",
      type: "string",
      title: "finding chart",
      description: "Upload finding chart here.",
    },
    target_info_comment: {
      title: "comment",
      type: "string"
    }
  }
}

export const uiMetadataSchema: UiSchema = { 
  name: {
  },
  instrument: {
    "ui:readonly": true,
  },
  version: {
    "ui:readonly": true,
  },
  pi_id: {
    "ui:readonly": true,
  },
  sem_id: {
    "ui:readonly": true,
  },
}

export const uiTargetSchema: UiSchema = { 
  target_coord_dec: {
    "ui:help": "DD:MM:SS"
  },
  target_coord_ra: {
    "ui:help": "HH:MM:SS"
  }
}

export const uiSignatureSchema: UiSchema = {
  pi_id: {
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
export const uiOverviewSchema: UiSchema = {
  version: {
    "ui:readonly": true,
    "ui:widget": "hidden"
  },
  signature: uiSignatureSchema,
  status: uiStatusSchema,
  comment: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 2
    },
  }
}

export const uiAcquisitionSchema: UiSchema = {
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

export const uiScienceSchema: UiSchema = {
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
  cfg_slicer: {
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

export const uiDetectorSchema: UiSchema = {}
export const uiInstSchema: UiSchema = {}
export const uiTCSSchema: UiSchema = {}
export const uiTimeConstraintSchema: UiSchema = {}