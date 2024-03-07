import React, { createContext, useContext, useCallback, useEffect, useState } from 'react'
import { ObservationBlock, Template } from '../../typings/papahana'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { OBBeautifulDnD, parseOB } from './sequence_grid/ob_form_beautiful_dnd'
import { Autosave } from './autosave'
import Drawer from '@mui/material/Drawer';
import { useDrawerOpenContext } from './../App'
import { SideMenu } from './side_menu'
import { ob_api_funcs } from './../../api/ApiRoot';
import { JSONSchema7, } from 'json-schema'
import { ErrorObject } from 'ajv'
import { UiSchema } from 'react-jsonschema-form'
import { get_schemas } from '../forms/template_form'

export interface OBContext {
  ob: ObservationBlock,
  ob_id: string | null | undefined,
  templateSchemas: TemplateSchemas,
  errors: ErrorObject[],
  setTemplateSchemas: Function
  setOBID: Function
  setOB: Function
  handleOBSelect: Function
  setErrors: Function
}

const init_ob_context: OBContext = {
  ob: {} as ObservationBlock,
  ob_id: '',
  templateSchemas: {},
  errors: [],
  setTemplateSchemas: () => { },
  setOBID: () => { },
  setOB: () => { },
  handleOBSelect: () => { },
  setErrors: () => { }
}
const OBContext = createContext<OBContext>(init_ob_context)
export const useOBContext = () => useContext(OBContext)

export interface Props {
}

export interface TemplateSchemas { [key: string]: [JSONSchema7, UiSchema] }

export const get_ob_schemas = async (ob: ObservationBlock) => {
  const obComponents = parseOB(ob)
  let obItems = Object.entries(obComponents)
  let templateSchemas = {} as TemplateSchemas
  obItems.forEach(async (keyValue) => {
    const [componentName, obComponent] = keyValue
    const [schema, uiSchema] = await get_schemas(obComponent, ob.metadata.instrument, componentName)
    templateSchemas[componentName] = [schema, uiSchema]
  })
  return templateSchemas
}


export default function ODTView() {

  const [instrument, setInstrument] = useQueryParam('instrument', withDefault(StringParam, 'NIRES'))
  const [ob_id, setOBID] = useQueryParam('ob_id', StringParam)
  const [templateSchemas, setTemplateSchemas] = useState<TemplateSchemas>({})
  const [errors, setErrors] = useState([] as ErrorObject[])
  // const initOB = JSON.parse(window.localStorage.getItem('OB') ?? '{}') //save ob to local storage
  const [ob, setOB] = useState<ObservationBlock>({} as ObservationBlock)
  const [triggerRender, setTriggerRender] = useState(0)

  const drawer = useDrawerOpenContext()

  useEffect(() => {
    async function init_ob(id: string) {
      const initOB = await ob_api_funcs.get(id)
      const obsch = await get_ob_schemas(initOB)
      setOB(initOB)
      setTemplateSchemas(obsch)
      setInstrument(initOB.metadata.instrument)
    }
    ob_id && init_ob(ob_id)
  }, [])

  useEffect(() => {
    errors && console.log('ERRORS', errors)
  }, [errors])


  useEffect(() => { //ensure instrument matches the selected ob
    if (ob.metadata) {
      setInstrument(ob.metadata.instrument.toUpperCase())
      setOBID(ob._id)
    }
    const check_schema = async (ob: ObservationBlock) => {
      let difference = Object.keys(parseOB(ob)).filter(x => !Object.keys(templateSchemas).includes(x));
      if (difference.length > 0) {
        console.log('difference in ob and templateSchemas, updateing templateSchemas', difference)
        const obsch = await get_ob_schemas(ob)
        setTemplateSchemas(obsch)
      }
    }
    check_schema(ob)
  }, [ob])

  const renderRGL = () => {
    const notEmpty = Object.keys(ob).length > 0 && Object.keys(templateSchemas).length > 0
    if (notEmpty) {
      return (
        <OBBeautifulDnD
          triggerRender={triggerRender}
          setTriggerRender={setTriggerRender}
        />
      )
    }
    else {
      return <h1></h1>
    }
  }

  // const handleMouseDown = () => {
  //   document.addEventListener("mouseup", handleMouseUp, true);
  //   document.addEventListener("mousemove", handleMouseMove, true);
  // };

  // const handleMouseUp = () => {
  //   document.removeEventListener("mouseup", handleMouseUp, true);
  //   document.removeEventListener("mousemove", handleMouseMove, true);
  // };

  // const handleMouseMove = useCallback((e: MouseEvent) => {
  //   const newWidth = e.clientX - document.body.offsetLeft;
  //   if (newWidth > 50 && newWidth < 1500) {
  //     drawer.setDrawerWidth(newWidth);
  //   }
  // }, []);


  const getOB = async (new_ob_id: string) => {
    const newOB = await ob_api_funcs.get(new_ob_id)
    console.log('setting ob', newOB)
    if (newOB._id) {
      setInstrument(newOB.metadata.instrument)
      setOB(newOB)
    }
    setTriggerRender(triggerRender + 1) //force dnd component to rerender
  }

  const handleOBSelect = (ob_id: string) => {
    console.log(`setting selected ob to ${ob_id}`)
    setOBID(ob_id)
    getOB(ob_id)
  }

  const ob_context: OBContext = {
    ob: ob,
    ob_id: ob_id,
    setOBID: setOBID,
    templateSchemas: templateSchemas,
    errors: errors,
    setTemplateSchemas: setTemplateSchemas,
    setOB: setOB,
    handleOBSelect: handleOBSelect,
    setErrors: setErrors
  }

  return (
    <div>
      <OBContext.Provider value={ob_context}>
        <Drawer
          anchor={'left'}
          open={drawer.drawerOpen}
          variant="persistent"
          sx={{
            width: drawer.drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawer.drawerWidth,
              transition: 'width 0.25s',
              marginTop: '68px',
              boxSizing: 'border-box',
            },
          }}
        >
          <SideMenu
            triggerRender={triggerRender}
            setTriggerRender={setTriggerRender}
          />
        </Drawer>
        {renderRGL()}
        <Autosave />
      </OBContext.Provider>
    </div>
  )
}
