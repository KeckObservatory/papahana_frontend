

import React, { } from "react"
import { Template, OBComponent, OBComponentNames, TemplateParameter } from "../../typings/papahana"
import { ISubmitEvent } from "@rjsf/core";
import Form from '@rjsf/material-ui'
import { JSONSchema7 } from 'json-schema'
import { JsonSchema, JSProperty, OBJsonSchemaProperties } from "../../typings/ob_json_form";
import { makeStyles, Theme } from "@material-ui/core";
import * as sch from './schemas'
import { get_template } from "../../api/utils";
import { UiSchema } from "react-jsonschema-form";


export const useStyles = makeStyles( (theme: Theme) => ({
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
    formData?: OBComponent,
    updateOB: Function,
    componentName: OBComponentNames 
}
export const log = (type: any) => console.log.bind(console, type);

const getUiSchema = (componentName: OBComponentNames): UiSchema => {
  let uiSchema: UiSchema 
  switch(componentName) { 
      case 'sequences': { 
        uiSchema = sch.uiScienceSchema
        break;
      } 
      case 'acquisition': { 
        uiSchema = sch.uiAcquisitionSchema
        break;
      } 
      default: {
        console.log(`componentName ${componentName} not found`)
        uiSchema = {}
        break;
      }
  } 
  return uiSchema
}

const getUiSchemaAndTemplate = async ( templateName: string, componentName: OBComponentNames ): Promise<[object, Template ]> => {
  console.log('getting uiSchema and Template')
  console.log(componentName)
  let template: Template[] = await get_template(templateName)
  let uiSchema: object
  switch(componentName) { 
      case 'sequences': { 
        uiSchema = sch.uiScienceSchema
        break;
      } 
      case 'acquisition': { 
        uiSchema = sch.uiAcquisitionSchema
        break;
      } 
      default: {
        console.log(`componentName ${componentName} not found`)
        uiSchema = {}
        break;
      }
  } 

  return [uiSchema, template[0]]
}


const parameter_to_schema_properties = ( key:string, param: TemplateParameter): OBJsonSchemaProperties => {
  let property: Partial<JSProperty> = {}
  property.title = key
  Object.entries(param).forEach( ( key, value ) => {
    property.default = param.default
    property.title = param.ui_name
    property.readonly = false // todo: need to verify if this will allways be the case
    if (param.option === "range") {
      property.minimum = param.allowed[0]
      property.maximum = param.allowed[0]
    }
    if (param.option === "list") {
      property.enum = param.allowed
    }

  })

  return property
}

const template_to_schema = ( template: Template ): JSONSchema7 => {
  let schema: Partial<JsonSchema> = {}
  console.log('inside template_to_schema')
  console.log(template)
  schema.title = template.metadata.ui_name
  schema.type = 'object'
  let required: string[] = []
  let properties = {} as Partial<OBJsonSchemaProperties>
  Object.entries(template.parameters).forEach( ( [key, param]) => {
    const prop = parameter_to_schema_properties( key as keyof TemplateParameter, param)
    if (prop.optionality === 'required') required.push(key)
    properties[key] = prop
  })
  schema.properties = properties
  schema.required = required

  return schema as JSONSchema7
}

export default function TemplateForm(props: Props): JSX.Element {
  const classes = useStyles()

  let uiSchema = sch.uiTargetSchema; 
  const [schema, setSchema] = React.useState(sch.targetSchema as JSONSchema7)
  if (props.componentName !== 'target') {
    const templateName = props.formData.metadata.name as string
    uiSchema = getUiSchema(props.componentName)
    get_template(templateName).then( (templates: Template[]) => {
      setSchema((templates[0] as JSONSchema7))
    }, )
  }

  const handleChange = ( evt: ISubmitEvent<OBComponent>): void => {
    let newFormData = {...evt.formData}  
    props.updateOB(props.componentName, newFormData)
  }  
  

return(
  <div className={classes.root}>
  <Form className={classes.form} 
        schema={schema}
        uiSchema={uiSchema as any}
        formData={props.formData}
        onChange={handleChange}
        onError={log("errors")} />
  </div>
)}