import React, { useCallback, useEffect, useState } from 'react'
import { Instrument, ObservationBlock } from '../../typings/papahana'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { useQueryParam, StringParam } from 'use-query-params'
import { OBBeautifulDnD } from './sequence_grid/ob_form_beautiful_dnd'
import { Autosave } from './autosave'
import Drawer from '@mui/material/Drawer';
import { useDrawerOpenContext } from './../App'
import { SideMenu } from './side_menu'

const useStyles = makeStyles((theme: Theme) => ({
  grid: {
    textAlign: 'left',
    margin: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0),
      width: theme.spacing(50),
    }
  },
  buttonBlock: {
    margin: theme.spacing(1),
    display: 'inline-flex',
  },
  templateSelect: {
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    width: "100%",
    // maxWidth: "50%",
    elevation: 5,
  },
  widepaper: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    // height: '500px',
    elevation: 5,
    minWidth: theme.spacing(170)
  },
  dndGrid: {
    minWidth: theme.spacing(150),
    elevation: 5,
  },
  dragger: {
    width: "5px",
    cursor: "ew-resize",
    padding: "4px 0 0",
    borderTop: "1px solid #ddd",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  }
}))


export interface Props {
}

export default function ODTView(props: Props) {
  const instrument: Instrument = 'KCWI'
  const classes = useStyles();
  const [ob_id, setOBID] = useQueryParam('ob_id', StringParam)
  const initOB = JSON.parse(window.localStorage.getItem('OB') ?? '{}')
  const [ob, setOB] = useState(initOB as ObservationBlock)
  const [triggerRender, setTriggerRender] = useState(0)

  const drawer = useDrawerOpenContext()

  useEffect(() => {
  }, [])






  const renderRGL = () => {
    const empty = Object.keys(ob).length > 0
    if (empty) {
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
          instrument={instrument}
        />
      </Drawer>
      {renderRGL()}
      <Autosave ob={ob} />
    </div>
  )
}
