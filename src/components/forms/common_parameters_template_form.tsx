import React, { } from "react"
import { Template, OBComponent, TemplateParameter, CommonParameters } from "../../typings/papahana"
import { withTheme, ISubmitEvent } from "@rjsf/core";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
// import Form from '@rjsf/material-ui'
import { Theme as MaterialUITheme } from '../../rjs_forms'
import { JSONSchema7 } from 'json-schema'
import { JsonSchema, JSProperty, OBJsonSchemaProperties } from "../../typings/ob_json_form";
import { template_parameter_to_schema_properties, log } from "./template_form"
import { makeStyles } from "@mui/styles";
import * as schemas from './schemas'
import { get_template } from "../../api/utils";
import { UiSchema } from "react-jsonschema-form";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

const Form = withTheme(MaterialUITheme)

export const useStyles = makeStyles((theme: any) => ({
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

interface Props {
  obComponent: CommonParameters
  updateOB: Function
  schema: JSONSchema7
  id: string
}

const template_to_schema = (template: Template, formName: string): JSONSchema7 => {
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
  const classes = useStyles()
  const sub_forms = ['instrument_parameters', 'detector_parameters', 'tcs_parameters']
  const initSchema = {}
  const [schemas, setSchemas] = React.useState({} as any)
  let formData: { [key: string]: any } = {}
  const ref = React.useRef(null)
  let height = 0 //monitor the height of the form

  React.useEffect(() => {
    const curr = ref.current as any;
    height = curr.clientHeight;
    const md = props.obComponent.metadata

    let newSchemas = {...schemas}
    get_template(md.name).then((template: {[key: string]: any}) => {
        sub_forms.forEach( (formName: string) => {
        // console.log('sub template', formName, template[formName])
        const subSchema = template_to_schema(template[formName] as Template, formName)
        // console.log('sub schema', subSchema)
        newSchemas[formName] = subSchema
      })
      setSchemas(newSchemas)
    }).catch(err => {
      console.error(`TemplateForm err: ${err}`)
    })
  }, [])


  const handleChange = (evt: ISubmitEvent<any>, formName: keyof CommonParameters): void => {
    const curr = ref.current as any
    let newFormData = { ...props.obComponent }
    newFormData[formName] = evt.formData
    // console.log('new subform data', evt.formData)
    props.updateOB(props.id, newFormData)
    height = curr.clientHeight
  }

  return (
    <div ref={ref} className={classes.root}>
      {sub_forms.map((formName: string) => {
        //@ts-ignore
        const formData = props.obComponent[formName]
        const handleSubChange = (evt: ISubmitEvent<any>) => handleChange(evt, formName as keyof CommonParameters)
        // { console.log('making form', formName, 'schema', schemas[formName] ) }
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
              <p>form goes here</p>
              {schemas[formName] && 
              <Form className={classes.form}
                schema={schemas[formName]}
                formData={formData}
                onChange={handleSubChange}
                onError={log("errors")} />
              }
            </AccordionDetails>
          </Accordion>
        )
      })}
    </div>
  )
}