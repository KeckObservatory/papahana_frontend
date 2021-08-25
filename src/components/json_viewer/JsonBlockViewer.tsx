import React, { useEffect, useState } from 'react'
import ReactJson, { ThemeKeys, InteractionProps } from 'react-json-view'
import { Instrument, OBComponentNames, OBSequence, ObservationBlock } from '../../typings/papahana'
import { IconButton, Paper, makeStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles'
import PublishIcon from '@material-ui/icons/Publish'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { api_call } from '../../api/utils'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteDialog from './delete_dialog'
import ObservationBlockSelecter from './ob_select'
import JsonViewTheme from './../json_view_theme'
import Aladin from './../aladin'
import RGLFormGrid from '../sequence_grid/ob_form_grid'
import TemplateSelection from './template_selection'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'left',
    paddingTop: theme.spacing(10),
    margin: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
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
    padding: theme.spacing(3),
    margin: theme.spacing(1),
    width: "100%",
    elevation: 3,
  },
  widepaper: {
    padding: theme.spacing(3),
    margin: theme.spacing(1),
    elevation: 3,
    minWidth: theme.spacing(150)
  },
  dndGrid: {
    minWidth: theme.spacing(200)
  }
}))

export interface Props {
  observer_id: string
  theme: ThemeKeys | null | undefined
  iconStyle: 'circle' | 'triangle' | 'square'
  collapsed: number | boolean,
  collapseStringsAfter: number | false
  enableClipboard: boolean
  editable: boolean
}

export default function JsonBlockViewer(props: Props) {
  const instrument: Instrument = 'KCWI'
  const classes = useStyles();
  const [ob_id, setOBID] = useQueryParam('ob_id', StringParam)
  const [ob, setOB] = useState({} as ObservationBlock)
  const [theme, setTheme] =
    useQueryParam('theme', withDefault(StringParam, props.theme as string))
  let obSequences = Object.keys(ob)

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

  const replaceOB = (): void => {
    const query = `ob_id=${ob_id}`
    console.log('replacing ob with edited ob')
    api_call(query, 'papahana_demo', 'put', ob).then((result: any) => {
      console.log('put result')
      console.log(result)
    })
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
    setOB(e.updated_src as ObservationBlock);
  }

  const handleOBSelect = (new_ob_id: string) => {
    setOBID(new_ob_id)
    getOB(new_ob_id)
  }

  const addSeq = (seq: OBSequence) => {
    console.log(`adding sequence to ob`)
    console.log(seq)
    let newOB = {...ob} as any
  const tmplType = seq.metadata.template_type
  if (tmplType.includes('science') && ob.sequences) {
    newOB.sequences?.push(seq)
  }
  else {
    newOB[tmplType as OBComponentNames] = seq
  }
  setOB(newOB)
  }

  const renderRGL = (ob: ObservationBlock) => {
    const empty = Object.keys(ob).length > 0
    if (empty) {
      console.log('rendering RGLFormGrid')
      return (
        <RGLFormGrid
          ob={ob}
          compactType={'vertical'}
          setOB={setOB} />
      )
    }
    else {
      return <h1>Loading...</h1>
    }
  }

  const handleEdit = props.editable ? onEdit : false

  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={3}>
        <Paper className={classes.paper} elevation={3}>

          <h3>Observation Block Selection</h3>
          <ObservationBlockSelecter observer_id={props.observer_id} handleOBSelect={handleOBSelect} ob_id={ob_id} />
          <h3>Observation Block Edit/Display</h3>
          <div className={classes.buttonBlock}>
            <Tooltip title="Update OB in form">
              <IconButton aria-label='replace' onClick={replaceOB}>
                <PublishIcon />
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
        {/* <Paper className={classes.paper} elevation={3}>
          <BasicTable observer_id={props.observer_id} />
        </Paper> */}
      </Grid>
      <Grid item xs={8}>
        <Paper className={classes.widepaper}>
          {renderRGL(ob)}
        </Paper>
      </Grid>
      {/* <Grid item xs={3}>
        <Paper className={classes.paper}>
          <Aladin />
        </Paper>
      </Grid> */}
    </Grid>
  )
}

JsonBlockViewer.defaultProps = {
  theme: 'bespin',
  iconStyle: 'circle',
  collapsed: 1,
  collapseStringsAfter: 15,
  enableClipboard: true,
  editable: true,
}

