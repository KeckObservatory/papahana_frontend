import React, { createContext, useContext, useCallback, useEffect, useState } from 'react'
import { ObservationBlock } from '../../typings/papahana'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { OBBeautifulDnD } from './sequence_grid/ob_form_beautiful_dnd'
import { Autosave } from './autosave'
import Drawer from '@mui/material/Drawer';
import { useDrawerOpenContext } from './../App'
import { SideMenu } from './side_menu'
import { ob_api_funcs } from './../../api/ApiRoot';

export interface OBContext {
  ob: ObservationBlock,
  ob_id: string | null | undefined,
  setOBID: Function
  setOB: Function
  handleOBSelect: Function
}

const init_ob_context: OBContext = {
  ob: {} as ObservationBlock,
  ob_id: '',
  setOBID: () => { },
  setOB: () => { },
  handleOBSelect: () => { }
}
const OBContext = createContext<OBContext>(init_ob_context)
export const useOBContext = () => useContext(OBContext)

export interface Props {
}

export default function ODTView(props: Props) {

  const [instrument, setInstrument] = useQueryParam('instrument', withDefault(StringParam, 'KCWI'))
  const [ob_id, setOBID] = useQueryParam('ob_id', StringParam)
  // const initOB = JSON.parse(window.localStorage.getItem('OB') ?? '{}') //save ob to local storage
  const initOB = {}
  const [ob, setOB] = useState(initOB as ObservationBlock)
  const [triggerRender, setTriggerRender] = useState(0)

  const drawer = useDrawerOpenContext()

  useEffect(() => {
    if (ob_id) {
      ob_api_funcs.get(ob_id).then((initOb: ObservationBlock) => {
        setOB(initOb)
      })
    }
  }, [])

  useEffect(() => { //ensure instrument matches the selected ob
    if (ob.metadata) setInstrument(ob.metadata.instrument.toUpperCase())
  }, [ob])

  const renderRGL = () => {
    const notEmpty = Object.keys(ob).length > 0
    if (notEmpty) {
      return (
        <OBBeautifulDnD
          ob={ob}
          triggerRender={triggerRender}
          setTriggerRender={setTriggerRender}
          setOB={(newOb: ObservationBlock) => {
            // triggerBoop(true)
            setOB(newOb)
          }} />
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


  const getOB = (new_ob_id: string): void => {
    ob_api_funcs.get(new_ob_id).then((newOb: ObservationBlock) => {
      if (newOb._id) {
        setInstrument(newOb.metadata.instrument)
        setOB(newOb)
      }
    })
      .finally(() => {
        setTriggerRender(triggerRender + 1) //force dnd component to rerender
      })
  }
  const handleOBSelect = (ob_id: string) => {
    console.log(`setting selected ob to ${ob_id}`)
    setOBID(ob_id)
    getOB(ob_id)
  }

  const obContext: OBContext = {
    ob: ob,
    ob_id: ob_id,
    setOBID: setOBID,
    setOB: setOB,
    handleOBSelect: handleOBSelect
  }

  return (
    <div>
      <OBContext.Provider value={obContext}>
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
        <Autosave ob={ob} />
      </OBContext.Provider>
    </div>
  )
}
