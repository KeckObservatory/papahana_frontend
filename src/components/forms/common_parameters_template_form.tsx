import React, { } from "react"
import { Template, CommonParameters, CommonTemplate } from "../../typings/papahana"
import { ISubmitEvent } from "@rjsf/core";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
// import Form from '@rjsf/material-ui'
import { JSONSchema7 } from 'json-schema'
import { JsonSchema, OBJsonSchemaProperties } from "../../typings/ob_json_form";
import { Form, template_parameter_to_schema_properties, log } from "./template_form"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { UiSchema } from "react-jsonschema-form";

interface Props {
  obComponent: CommonParameters
  updateOB: Function
  schema: JSONSchema7
  uiSchema: UiSchema
  id: string
}

export const common_parameters_template_to_schema = (template: Template, formName: string): JSONSchema7 => {
  let schema: Partial<JsonSchema> = {}
  schema.title = formName
  schema.type = 'object'
  let required: string[] = []
  let properties = {} as Partial<OBJsonSchemaProperties>
  Object.entries(template).forEach(([key, param]) => {
    const prop = template_parameter_to_schema_properties(param)
    if (param.optionality === 'required') required.push(key)
    properties[key] = prop
  })
  schema.properties = properties
  schema.required = required
  return schema as JSONSchema7
}

export const SUB_FORMS = [
    'instrument_parameters',
    'detector_parameters',
    'tcs_parameters'] as unknown as (keyof Template)[]

export default function CommonParametersTemplateForm(props: Props): JSX.Element {

  const ref = React.useRef(null)

  React.useEffect(() => {
    const md = props.obComponent.metadata
    const name = md.name
  }, [])


  const handleChange = (evt: ISubmitEvent<CommonParameters>, formName: keyof CommonParameters): void => {
    let newFormData = { ...props.obComponent }
    newFormData[formName] = evt.formData
    props.updateOB(props.id, newFormData, formName)
  }

  return (
    <div ref={ref}
      style={
        {
          textAlign: 'left',
          margin: '0px',
          display: 'flex',
          flexWrap: 'wrap',
        }
      }
    >
      {SUB_FORMS.map((formName: string) => {
        //@ts-ignore
        const formData = props.obComponent[formName]
        const handleSubChange = (evt: ISubmitEvent<CommonParameters>) => handleChange(evt, formName as keyof CommonParameters)

        console.log('schema', props.schema)
        // @ts-ignore
        const schema = props.schema.properties[formName] as JSONSchema7
        return (
          <Accordion key={formName}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              aria-label="Expand"
            >
              <Typography variant={"h6"} >{formName}</Typography>
            </AccordionSummary>
            <AccordionDetails >
              <Form
                schema={schema}
                formData={formData}
                onChange={handleSubChange}
                onError={log("errors")}><div></div></Form>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </div>
  )
}