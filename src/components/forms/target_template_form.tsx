import React, { useRef, useState } from "react"
import { OBComponent, TargetParameters } from "../../typings/papahana"
import { ISubmitEvent, UiSchema as rUiSchema } from "@rjsf/core";
// import Form from '@rjsf/material-ui'
import { JSONSchema7 } from 'json-schema'
import * as schemas from './schemas'
import { init_form_data, get_schemas, Form, log } from './template_form'
import { TargetResolverDialog } from "../TgtRes/target_resolver_dialog";
import { BooleanParam, StringParam, useQueryParam, withDefault } from "use-query-params";
import { Divider, FormControlLabel, Stack, Switch, Tooltip } from "@mui/material";
import { deg_to_sexagesimal, ra_dec_to_deg } from './../sky-view/sky_view_util'
import { UiSchema } from "react-jsonschema-form";

interface Props {
  obComponent: OBComponent
  updateOB: Function
  id: string
}

export default function TargetTemplateForm(props: Props): JSX.Element {
  const [schema, setSchema] = useState({} as JSONSchema7)
  const [decimalToggle, setDecimalToggle] = useQueryParam('decimalToggle', withDefault(BooleanParam, false))
  const [uiSchema, setUISchema] = useState({} as UiSchema)
  let initFormData = init_form_data(props.obComponent, props.id)
  const ref = useRef(null)
  const initialRender = useRef(true);
  const [formData, setFormData] = useState(initFormData)
  const [instrument, setInstrument] = useQueryParam('instrument', withDefault(StringParam, 'KCWI'))

  React.useEffect(() => {
    get_schemas(props.obComponent, instrument, props.id).then(([initSchema , initUiSchema ]) => {
      setSchema(() => initSchema)
      setUISchema( () => initUiSchema)

    })
  }, [])

  React.useEffect(() => {
    let newFormData = init_form_data(props.obComponent, props.id)
    newFormData = convert_ra_dec(newFormData as TargetParameters, decimalToggle)
    setFormData(() => newFormData)
  }, [props.obComponent])

  React.useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
    }
    else {
      const newFormData = convert_ra_dec(formData as TargetParameters, decimalToggle)
      setFormData(() => newFormData)
    }
  }, [decimalToggle])

  const handleChange = (evt: ISubmitEvent<OBComponent>): void => {
    //@ts-ignore
    let newFormData = { ...evt.formData }
    //target ra/dec is always stored as sexagesimal
    const newTarget = convert_ra_dec(newFormData, false)

    // check if form changed heights
    props.updateOB(props.id, newTarget)
    setFormData(() => newFormData)
  }

  const convert_ra_dec = (targetParams: TargetParameters, decToggle: boolean) => {
    const ra = targetParams.target_coord_ra
    const dec = targetParams.target_coord_dec
    if (decToggle) {
      const raDeg = ra_dec_to_deg(ra)
      const decDeg = ra_dec_to_deg(dec, true)
      const newFormData = {
        ...targetParams,
        target_coord_ra: raDeg,
        target_coord_dec: decDeg
      }
      setFormData(() => newFormData)
      return newFormData
    }
    else {
      const raSex = deg_to_sexagesimal(ra)
      const decSex = deg_to_sexagesimal(dec, true)
      const newFormData = {
        ...targetParams,
        target_coord_ra: raSex,
        target_coord_dec: decSex
      }
      return newFormData
    }
  }

  const handleDecimalChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setDecimalToggle(evt.target.checked)
  }

  return (
    <div ref={ref} style={{
      textAlign: 'left',
      margin: '0px',
      display: 'flex',
      flexWrap: 'wrap',
    }}>
      <Stack direction={'row'}
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
      >
        <TargetResolverDialog id={props.id} obComponent={props.obComponent} updateOB={props.updateOB} />
        <Tooltip title={'Toggle on to display RA/DEC in decimal form'}>
          <FormControlLabel control={<Switch onChange={handleDecimalChange} checked={decimalToggle} />} label="Decimal" />
        </Tooltip>
      </Stack>
      <Form
        schema={schema}
        uiSchema={uiSchema as rUiSchema}
        formData={formData}
        onChange={handleChange}
        onError={log("errors")} ><div></div></Form>
    </div>
  )
}