

import React, { } from "react"
import { Template, OBComponent, OBComponentNames, TemplateParameter, OBSequence } from "../../typings/papahana"
import { ISubmitEvent } from "@rjsf/core";
import Form from '@rjsf/material-ui'
import { JSONSchema7 } from 'json-schema'
import { Items, JsonSchema, JSProperty, OBJsonSchemaProperties } from "../../typings/ob_json_form";
import { makeStyles, Theme } from "@material-ui/core";
import * as sch from './schemas'
import { get_template } from "../../api/utils";
import { UiSchema } from "react-jsonschema-form";


export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'left',
    margin: theme.spacing(0),
    display: 'flex',
    flexWrap: 'wrap',
  },
  form: {
    margin: theme.spacing(0),
    padding: theme.spacing(0)
  },
  tab: {
    minWidth: theme.spacing(15),
    width: 'flex'
  }
}))

interface Props {
  obComponent: OBComponent,
  updateOB: Function,
  componentName: OBComponentNames
}
export const log = (type: any) => console.log.bind(console, type);

const getUiSchema = (componentName: OBComponentNames): UiSchema => {
  let uiSchema: UiSchema
  if (componentName === 'target') {
    uiSchema = sch.uiTargetSchema
  }
  else if (componentName === 'acquisition') {
    uiSchema = sch.uiAcquisitionSchema
  }
  else if (componentName.includes('science')) {
    uiSchema = sch.uiScienceSchema
  }
  else {
    console.log(`componentName ${componentName} has undefined schema`)
    uiSchema = {}
  }
  return uiSchema
}

const to_schema_type = (tpl_param: string): string => {
  let type: string
  switch (tpl_param) {
    case 'float': {
      type = 'number'
      break;
    }
    case 'string': {
      type = 'string'
      break;
    }
    case 'integer': {
      type = 'number'
      break;
    }
    case 'array': {
      type = 'array'
      break;
    }
    case 'boolean': {
      type = 'boolean'
      break;
    }
    default: {
      type = 'string'
      break;
    }
  }
  return type
}

const template_parameter_to_schema_properties = (param: TemplateParameter): OBJsonSchemaProperties => {
  let property: Partial<JSProperty> = {}
  property.title = param.ui_name
  property.type = to_schema_type(param.type)
  if (param.default) {
    property.default = param.default
  }
  property.readonly = false // todo: need to verify if this will allways be the case
  if (param.option === "range") {
    property.minimum = param.allowed[0] as any
    property.maximum = param.allowed[1] as any
  }
  if (param.option === "list") {
    property.enum = param.allowed
  }
  if (property.type === 'array') {
    let dschema = {} as any //todo make this a function
    dschema.title = 'dither item'
    dschema.type = 'object'
    dschema.properties = {}
    param.allowed.forEach((param: any) => {
      const dkey = Object.keys(param)[0]
      const dvalue = param[dkey]
      dschema.properties[dkey] = template_parameter_to_schema_properties(dvalue as TemplateParameter)
    })
    dschema.required = Object.keys(dschema.properties)
    property.items = dschema

    //property.enum = undefined 
  }
  return property
}

const template_to_schema = (template: Template): JSONSchema7 => {
  let schema: Partial<JsonSchema> = {}
  schema.title = template.metadata.ui_name
  schema.type = 'object'
  let required: string[] = []
  let properties = {} as Partial<OBJsonSchemaProperties>
  Object.entries(template.parameters).forEach(([key, param]) => {
    const prop = template_parameter_to_schema_properties(param)
    if (param.optionality === 'required') required.push(key)
    properties[key] = prop
  })
  schema.properties = properties
  schema.required = required
  return schema as JSONSchema7
}

export default function TemplateForm(props: Props): JSX.Element {
  const classes = useStyles()
  const [schema, setSchema] = React.useState({} as JSONSchema7)
  const uiSchema = getUiSchema(props.componentName)
  let formData: { [key: string]: any } = {}
  const ref = React.useRef(null)

  if (props.componentName === 'target') {
    formData = props.obComponent
  }
  if (props.componentName === 'sequences') {
    const seq = props.obComponent as OBSequence
    formData = seq.parameters
  }

  // const [height, setHeight] = React.useState(0)
  let height = 0

  React.useEffect(() => {
    if (props.componentName === 'target') {
      setSchema(sch.targetSchema as JSONSchema7)
    }
    else {
      const seq = props.obComponent as OBSequence
      var md = seq.metadata
      if (md) {
        get_template(md.name).then((templates: Template) => {
          const sch = template_to_schema(templates)
          setSchema(sch as JSONSchema7)
        }).catch(err => {
          console.log(`TemplateForm err: ${err}`)
        })
      }
    }
  }, [])

  React.useEffect(() => {
    console.log(`template form ${props.componentName} height changed to ${height}`)
    // props.handleResize(props.componentName, height, true)
  }, [height])


  const handleChange = (evt: ISubmitEvent<OBComponent>): void => {
    const curr = ref.current as any
    console.log('form changed')
    console.log(curr.clientHeight)
    console.log('updating form')
    let newFormData = { ...evt.formData }
    if (curr && height !== curr.clientHeight) {
      props.updateOB(props.componentName, newFormData, curr.clientHeight)
      height = curr.clientHeight
      // setHeight(curr.clientHeight)
    }
    else{

      props.updateOB(props.componentName, newFormData)
    }
  }


  return (
    <div ref={ref} className={classes.root}>
      <Form className={classes.form}
        schema={schema}
        uiSchema={uiSchema as any}
        formData={formData}
        onChange={handleChange}
        onError={log("errors")} />
    </div>
  )
}