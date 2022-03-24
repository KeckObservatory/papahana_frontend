import React, { } from "react"
import { Template, OBComponent, TemplateParameter, OBSequence } from "../../typings/papahana"
import { withTheme, ISubmitEvent, UiSchema as rUiSchema } from "@rjsf/core";
// import Form from '@rjsf/material-ui'
import { Theme as MaterialUITheme } from './../../rjs_forms'
import { JSONSchema7 } from 'json-schema'
import { JsonSchema, JSProperty, OBJsonSchemaProperties } from "../../typings/ob_json_form";
import { DefaultTheme, makeStyles } from "@mui/styles";
import * as schemas from './schemas'
import { get_template } from "../../api/utils";

export const Form = withTheme(MaterialUITheme)

export const useStyles = makeStyles((theme: DefaultTheme) => ({
  root: {
    textAlign: 'left',
    margin: theme.spacing(0),
    display: 'flex',
    flexWrap: 'wrap',
  },
  form: {
    margin: theme.spacing(0),
    padding: theme.spacing(0),
  },
  tab: {
    minWidth: theme.spacing(15),
    width: 'flex'
  }
}))

export interface Props {
  obComponent: OBComponent
  updateOB: Function
  id: string
}

export const log = (type: unknown) => console.log.bind(console, type);

export const to_schema_type = (tpl_param: string): string => {
  let type: string
  switch (tpl_param) {
    case 'float': {
      type = 'number'
      break;
    }
    case 'file': {
      type = 'string'
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

export const template_parameter_to_schema_properties = (param: TemplateParameter): OBJsonSchemaProperties => {
  let property: Partial<JSProperty> = {}
  property.title = param.ui_name
  property.type = to_schema_type(param.type)
  if (param.default) {
    property.default = param.default
  }
  property.readonly = false // todo: need to verify if this will allways be the case
  if (param.option === "range") {
    property.minimum = param.allowed[0] as string | number | undefined
    property.maximum = param.allowed[1] as string | number | undefined
  }
  if (param.option === "set") {
    property.enum = param.allowed
  }
  if (property.type === 'array') {
    let schema = {} as JsonSchema //todo make this a function
    schema.title = 'dither item'
    schema.type = 'object'
    schema.properties = {}
    param.allowed.forEach((param: any) => {
      const dkey = Object.keys(param)[0]
      const dvalue = param[dkey as string]
      //@ts-ignore
      schema.properties[dkey] = template_parameter_to_schema_properties(dvalue as TemplateParameter)
    })
    schema.required = Object.keys(schema.properties)
    property.items = schema
  }
  return property
}

export const template_to_schema = (template: Template): JSONSchema7 => {
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

export const init_form_data = (obComponent: OBComponent, id: string) => {
  let formData: { [key: string]: any } = {}
  if (id === 'target' || id === 'metadata' || id === 'status') {
    formData = obComponent
  }
  else if (id === 'time_constraints') {
    let timeConstraints = obComponent as any

    if (timeConstraints[0]) {
      formData['time_constraints'] = timeConstraints[0].map((constraint: any) => {
        return { start_datetime: constraint[0], end_datetime: constraint[1] }
      })
    }
  }
  else {
    const seq = obComponent as OBSequence
    formData = seq.parameters
  }
  return formData
}

export const get_schema = async (obComponent: OBComponent, id: string): Promise<JSONSchema7> => {
  let sch: JSONSchema7 = {}
  if (id === 'target') { // needs to be used in the database
    sch = schemas.targetSchema as JSONSchema7
  }
  else if (id === 'metadata') {
    sch = schemas.metadataSchema as JSONSchema7
  }
  else if (id === 'time_constraints') {
    sch = schemas.timeConstraintSchema as JSONSchema7
  }
  else if (id === 'status') {
    sch = schemas.statusSchema as JSONSchema7
  }
  else {
    //@ts-ignore line
    const md = obComponent.metadata
    if (md) {
      await get_template(md.name).then((template: Template) => {
        const sche = template_to_schema(template)
        sch = sche as JSONSchema7
        return sch
      }).catch(err => {
        console.error(`TemplateForm err: ${err}`)
      })
    }
  }
  return sch
}

export default function TemplateForm(props: Props): JSX.Element {
  const classes = useStyles()
  const [schema, setSchema] = React.useState({} as JSONSchema7)
  const uiSchema = schemas.getUiSchema(props.id)
  let initFormData = init_form_data(props.obComponent, props.id)
  const ref = React.useRef(null)
  const [formData, setFormData] = React.useState(initFormData)


  React.useEffect(() => {
    get_schema(props.obComponent, props.id).then((initSchema: JSONSchema7) => {
      setSchema(initSchema)
    })
  }, [])

  React.useEffect(() => {
    let newFormData = init_form_data(props.obComponent, props.id)
    setFormData(() => newFormData)
  }, [props.obComponent])

  const handleChange = (evt: ISubmitEvent<OBComponent>): void => {
    let newFormData = { ...evt.formData }
    props.updateOB(props.id, newFormData)
    setFormData(() => newFormData)
  }

  return (
    <div ref={ref} className={classes.root}>
      <Form className={classes.form}
        schema={schema}
        uiSchema={uiSchema as rUiSchema}
        formData={formData}
        onChange={handleChange}
        onError={log("errors")} ><div></div></Form>
    </div>

  )
}