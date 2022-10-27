import React, { useCallback, useEffect, useState } from 'react'
import { Instrument, ObservationBlock } from '../../typings/papahana'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { OBBeautifulDnD } from './sequence_grid/ob_form_beautiful_dnd'
import { Autosave } from './autosave'
import Drawer from '@mui/material/Drawer';
import { useDrawerOpenContext } from './../App'
import { SideMenu } from './side_menu'
import { ob_api_funcs } from './../../api/ApiRoot';

const useStyles = makeStyles((theme: Theme) => ({
  dragger: {
    width: "5px",
    cursor: "ew-resize",
    padding: "4px 0 0",
    borderTop: "1px solid #ddd",
    position: "absolute",
    // height: "100%",
    height: '1000px',
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  }
}))


export interface Props {
}

export default function ODTView(props: Props) {

  const [instrument, setInstrument] = useQueryParam('instrument', withDefault(StringParam, 'KCWI'))
  const classes = useStyles();
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
    setInstrument(ob.metadata.instrument)
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

  const handleMouseDown = () => {
    document.addEventListener("mouseup", handleMouseUp, true);
    document.addEventListener("mousemove", handleMouseMove, true);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mouseup", handleMouseUp, true);
    document.removeEventListener("mousemove", handleMouseMove, true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newWidth = e.clientX - document.body.offsetLeft;
    if (newWidth > 50 && newWidth < 1500) {
      drawer.setDrawerWidth(newWidth);
    }
  }, []);

  return (
    <div>
      <Drawer
        anchor={'left'}
        open={drawer.drawerOpen}
        variant="persistent"
        sx={{
          width: drawer.drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawer.drawerWidth,
            marginTop: '68px',
            boxSizing: 'border-box',
          },
        }}
      >
        <div onMouseDown={e => handleMouseDown()} className={classes.dragger} />
        <SideMenu
          ob_id={ob_id}
          setOBID={setOBID}
          ob={ob}
          setOB={setOB}
          triggerRender={triggerRender}
          setTriggerRender={setTriggerRender}
          instrument={instrument as Instrument}
          setInstrument={setInstrument}
        />
      </Drawer>
      {renderRGL()}
      <Autosave ob={ob} />
    </div>
  )
}
