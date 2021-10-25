import React, { useEffect, useState } from 'react'
import ReactJson, { ThemeKeys, InteractionProps } from 'react-json-view'
import { Instrument, OBSeqNames, OBSequence, ObservationBlock } from '../../typings/papahana'
import { IconButton, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import PublishIcon from '@mui/icons-material/Publish'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import AddIcon from '@mui/icons-material/Add'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { api_call } from '../../api/utils'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import DeleteDialog from './delete_dialog'
import ObservationBlockSelecter from '../OBSelect/ob_select'
import JsonViewTheme from '../json_view_theme'
import TemplateSelection from './template_selection'
import useBoop from './../../hooks/boop'
import { animated } from 'react-spring'
import { OBBeautifulDnD } from './sequence_grid/ob_form_beautiful_dnd'

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
    minWidth: theme.spacing(140)
  },
  dndGrid: {
    minWidth: theme.spacing(140),
    elevation: 5,
  }
}))

export interface Props {
  observer_id: string
  theme: any | null | undefined
  iconStyle: 'circle' | 'triangle' | 'square'
  collapsed: number | boolean,
  collapseStringsAfter: number | false
  enableClipboard: boolean
  editable: boolean
}

export default function OBTView(props: Props) {
  const instrument: Instrument = 'KCWI'
  const classes = useStyles();
  const [boopStyle, triggerBoop] = useBoop({})
  const [ob_id, setOBID] = useQueryParam('ob_id', StringParam)
  const [ob, setOB] = useState({} as ObservationBlock)
  const [theme, setTheme] =
    useQueryParam('theme', withDefault(StringParam, props.theme as string))
  let obSequences = Object.keys(ob)


  useEffect(() => {
    handleOBSelect('0000') //remove if not demo
    
  }, [])

  useEffect(() => {
    obSequences = Object.keys(ob)
  }, [ob])

  const getOB = (new_ob_id: string): void => {
    api_call(new_ob_id as string, 'papahana_demo', 'get').then((newOb: ObservationBlock) => {
      if (newOb._id) {
        setOB(newOb)
      }
    },
      (error: any) => {
        console.error(error)
      }
    )
  }


  const copyOB = (): void => {
    const query = `ob_id=${ob_id}`
    console.log(`creating new ob from ob ${ob_id}`)
    api_call(query, 'papahana_demo', 'post', ob).then((result: any) => {
      console.log('put result')
      console.log(result)
    })
  }

  const deleteOB = (): void => {
    const query = `ob_id=${ob_id}`
    console.log(`deleting ob ${ob_id}`)
    api_call(query, 'papahana_demo', 'remove', ob).then((result: any) => {
      console.log('delete result')
      console.log(result)
    })
  }

  const onEdit = (e: InteractionProps) => {
    triggerBoop(true)
    setOB(e.updated_src as ObservationBlock);
  }

  const handleOBSelect = (ob_id: string) => {
    console.log(`setting selected ob to ${ob_id}`)
    setOBID(ob_id)
    getOB(ob_id)
  }

  const addSeq = (seq: OBSequence) => {
    let newOB = { ...ob } as any
    const tmplType = seq.metadata.template_type
    if (tmplType.includes('science') && ob.sequences) {
      newOB.sequences?.push(seq)
    }
    else if (tmplType.includes('science') && !ob.sequences) {
      newOB['sequences'] = [seq]
    }
    else {
      newOB[tmplType as OBSeqNames] = seq
    }
    triggerBoop(true)
    setOB(newOB)
  }

  const createOB = () => {
    const newOB = {} as ObservationBlock
    triggerBoop(true)
    setOB(newOB)
    const query = ``
    api_call(query, 'papahana_demo', 'post', newOB).then((result: any) => {
      console.log('put result')
      console.log(result)
    })

  }

  const renderRGL = (ob: ObservationBlock) => {
    const empty = Object.keys(ob).length > 0
    if (empty) {
      return (
        <OBBeautifulDnD 
          className={classes.dndGrid}
          ob={ob}
          setOB={(newOb: ObservationBlock) => { 
            triggerBoop(true)
            setOB(newOb)}} />
      )
    }
    else {
      return <h1>Loading...</h1>
    }
  }

  const handleEdit = props.editable ? onEdit : false

  return (
    <Grid container spacing={3} className={classes.grid}>
      <Grid item xs={3}>
        <Paper className={classes.paper} elevation={3}>
          <h3>Observation Block Selection</h3>
          <ObservationBlockSelecter observer_id={props.observer_id} handleOBSelect={handleOBSelect} ob_id={ob_id} />
          <h3>Observation Block Edit/Display</h3>
          <div className={classes.buttonBlock}>
            <Tooltip title="Upload OB to database">
              <animated.button aria-label='upload' onClick={() => triggerBoop(false)} style={boopStyle}>
                <PublishIcon />
              </animated.button>
            </Tooltip>
            <Tooltip title="Create blank OB">
              <IconButton aria-label='create' onClick={createOB}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy OB to new OB">
              <IconButton aria-label='copy' onClick={copyOB}>
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
            <DeleteDialog deleteOB={deleteOB} />
          </div>

          <Tooltip title="Add template to Selected OB">
            <div className={classes.templateSelect}>
              <TemplateSelection addSeq={addSeq} instrument={instrument} obSequences={obSequences} />
            </div>
          </Tooltip>
          <Tooltip title="Change the color theme of the OB JSON display">
            <div>
              <JsonViewTheme
                theme={theme as ThemeKeys | null | undefined}
                setTheme={setTheme}
              />
            </div>
          </Tooltip>
          <ReactJson
            src={ob as object}
            theme={theme as ThemeKeys | undefined}
            iconStyle={props.iconStyle}
            collapsed={props.collapsed}
            collapseStringsAfterLength={props.collapseStringsAfter}
            enableClipboard={props.enableClipboard}
            onEdit={handleEdit}
          />
        </Paper >
      </Grid>
      <Grid item >
        <Paper className={classes.widepaper}>
          {renderRGL(ob)}
        </Paper>
      </Grid>
    </Grid>
  )
}

OBTView.defaultProps = {
  theme: 'bespin',
  iconStyle: 'circle',
  collapsed: 1,
  collapseStringsAfter: 15,
  enableClipboard: true,
  editable: true,
}

