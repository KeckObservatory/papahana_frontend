import { UiSchema } from "react-jsonschema-form"
import { JsonSchema } from "../../typings/ob_json_form"

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
      title: "OB Type"
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

export const targetSchema: JsonSchema = {
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
            required: [ "band", "mag"],
            properties: {
                band: {
                    type: "string",
                    title: "band type"
                },
                mag: {
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

export const uiMetadataSchema: UiSchema = { }

export const uiTargetSchema: UiSchema = { }

export const uiStatusSchema: UiSchema = {
  executions: {
    "ui:readonly": true,
    "ui:widget": "hidden"
  },
  state: {
    "ui:readonly": true,
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