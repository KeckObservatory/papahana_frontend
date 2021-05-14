import { UiSchema } from "react-jsonschema-form"
import { JsonSchema } from '../typings/ob_json_form'

export const signatureSchema: JsonSchema = {
  title: "Signature",
  type: "object",
  required: ["pi_id", "sem_id", "observer_ids"],
  properties: {
    pi_id: {
      type: "integer",
      title: "primary investigator",
      readonly: true 
    },
    name: {
      type: "string",
      title: "Observation Block Name"
    },
    sem_id: {
      type: "string",
      title: "semester id",
      comment: "text"
    },
    instrument: {
      type: "string",
      title: "instrument"
    },
    observer_ids: {
      type: "array",
      title: "observers",
      items: {
        type: "string",
      },
      uniqueItems: true
    },
    comment: {
      title: "comment",
      type: "string"
    }
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

export const statusSchema: JsonSchema = {
  title: "Status",
  type: "object",
  required: ['executions', 'state'],
  properties: {
    executions: {
      type: "array",
      title: "executions",
      items: {
        type: "string",
      },
      uniqueItems: true
    },
    state: {
      type: "string",
      title: "state"
    }
  }
}

export const uiStatusSchema: UiSchema = {
  executions: {
    "ui:readonly": true,
    "ui:widget": "hidden"
  },
  state: {
    "ui:readonly": true,
  }
}

export const overviewSchema: JsonSchema = {
  title: "Overview",
  type: "object",
  required: ["priority", "version", "status"],
  properties: {
    priority: {
      title: 'priority',
      type: 'number',
    },
    status: statusSchema,  
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