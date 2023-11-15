import React, { } from "react"
import { Template, CommonParameters, CommonTemplate } from "../../typings/papahana"
import { withTheme, ISubmitEvent } from "@rjsf/core";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
// import Form from '@rjsf/material-ui'
import { Theme as MaterialUITheme } from '../../rjs_forms'
import { JSONSchema7 } from 'json-schema'
import { JsonSchema, OBJsonSchemaProperties } from "../../typings/ob_json_form";
import { template_parameter_to_schema_properties, log } from "./template_form"
import { get_template } from "../../api/utils";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { StringParam, useQueryParam, withDefault } from "use-query-params";

const Form = withTheme(MaterialUITheme)

interface Props {
  obComponent: CommonParameters
  updateOB: Function
  schema?: JSONSchema7
  id: string
}

export const template_to_schema = (template: Template, formName: string): JSONSchema7 => {
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

export default function CommonParametersTemplateForm(props: Props): JSX.Element {
  const sub_forms = [
    'instrument_parameters',
    'detector_parameters',
    'tcs_parameters'] as unknown as (keyof Template)[]
  const [schemas, setSchemas] = React.useState({} as { [id: string]: JSONSchema7 })
  const ref = React.useRef(null)
  const [instrument, setInstrument] = useQueryParam('instrument', withDefault(StringParam, 'NIRES'))

  React.useEffect(() => {
    const md = props.obComponent.metadata
    let newSchemas = { ...schemas }
    const name = md.name
    get_template(name, instrument)
      .then((template: Template) => {
        sub_forms.forEach((formName: keyof Template) => {
          const tmpl = template[formName] as unknown as Template
          if (tmpl) {
            const subSchema = template_to_schema(tmpl, formName)
            newSchemas[formName] = subSchema
          }
        })
        setSchemas(newSchemas)
      }).catch(err => {
        console.error(`TemplateForm err: ${err}`)
      })
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
      {sub_forms.map((formName: string) => {
        //@ts-ignore
        const formData = props.obComponent[formName]
        const handleSubChange = (evt: ISubmitEvent<CommonParameters>) => handleChange(evt, formName as keyof CommonParameters)
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
              {schemas[formName] &&
                <Form
                  schema={schemas[formName]}
                  formData={formData}
                  onChange={handleSubChange}
                  onError={log("errors")}><div></div></Form>
              }
            </AccordionDetails>
          </Accordion>
        )
      })}
    </div>
  )
}