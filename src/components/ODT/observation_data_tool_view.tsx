import React, { useEffect, useState } from 'react'
import ReactJson, { ThemeKeys, InteractionProps } from 'react-json-view'
import { Instrument, OBSeqNames, OBSequence, ObservationBlock, ScienceMetadata } from '../../typings/papahana'
import { IconButton, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save';
import PublishIcon from '@mui/icons-material/Publish';
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { ob_api_funcs } from '../../api/ApiRoot';
import Tooltip from '@mui/material/Tooltip'
import DeleteDialog from './delete_dialog'
import UploadDialog from './upload_dialog'
import ObservationBlockSelecter from '../OBSelect/ob_select'
import JsonViewTheme from '../json_view_theme'
import TemplateSelection from './template_selection'
import { OBBeautifulDnD } from './sequence_grid/ob_form_beautiful_dnd'
import Button from '@mui/material/Button';
import { Autosave } from './autosave'
import cloneDeep from 'lodash/cloneDeep';
import Drawer from '@mui/material/Drawer';
import { useDrawerOpenContext } from './../App'
import { animated } from 'react-spring'
import useBoop from './../../hooks/boop'

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
  }
}))


export interface Props {
  theme: any | null | undefined
  iconStyle: 'circle' | 'triangle' | 'square'
  collapsed: number | boolean,
  collapseStringsAfter: number | false
  enableClipboard: boolean
  editable: boolean
}

export default function ODTView(props: Props) {
  const instrument: Instrument = 'KCWI'
  const classes = useStyles();
  const [boopStyle, triggerBoop] = useBoop({})
  const [ob_id, setOBID] = useQueryParam('ob_id', StringParam)
  const initOB = JSON.parse(window.localStorage.getItem('OB') ?? '{}')
  const [ob, setOB] = useState(initOB as ObservationBlock)
  const [theme, setTheme] =
    useQueryParam('theme', withDefault(StringParam, props.theme as string))

  const drawer = useDrawerOpenContext()

  useEffect(() => {
  }, [])

  const getOB = (new_ob_id: string): void => {
    ob_api_funcs.get(new_ob_id).then((newOb: ObservationBlock) => {
      if (newOb._id) {
        setOB(newOb)
      }
    },
      (error: any) => {
        console.error(error)
      }
    )
  }

  const saveOBasJSON = () => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([JSON.stringify(ob, null, 4)], { type: 'text/plain' })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = ob._id + '.json'
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

  const uploadOBFromJSON = (newOB: ObservationBlock): void => {
    if (newOB) {
      setOBID(newOB._id)
      setOB(newOB)
    }
  }

  const copyOB = (): void => {
    console.log(`creating new ob from ob ${ob_id}`)
    ob_api_funcs.post(ob).then((result: any) => {
      console.log('put result')
      console.log(result)
    })
  }

  const deleteOB = (): void => {
    console.log(`deleting ob ${ob_id}`)
    ob_api_funcs.remove(ob_id as string).then((result: any) => {
      console.log('delete result')
      console.log(result)
    })
  }

  const onEdit = (e: InteractionProps) => {
    //ob was edited. in react json viewer
    // triggerBoop(true)
    console.log('editing via json directly.')
    setOB(() => e.updated_src as ObservationBlock);
  }

  const handleOBSelect = (ob_id: string) => {
    console.log(`setting selected ob to ${ob_id}`)
    setOBID(ob_id)
    getOB(ob_id)
  }

  const addSeq = (seq: OBSequence) => {
    console.log('ob before add Seq', ob)
    const tmplType = seq.metadata.template_type
    console.log('templateType adding', tmplType)
    const newOB: any = cloneDeep(ob) // need to deep clone a nested object
    if (tmplType.includes('sci')) {
      let obs = [...(newOB.observations ?? [])] //need to make a deep copy of observations
      const metadata = seq.metadata as ScienceMetadata
      metadata['sequence_number'] = obs.length + 1
      seq.metadata = metadata
      obs.push(seq as any)
      newOB.observations = [...obs]
    }
    else {
      newOB[tmplType as OBSeqNames] = seq
    }
    // triggerBoop(true)
    setOB(newOB)
  }

  const createOB = () => {
    const newOB = { metadata: {} } as ObservationBlock
    // triggerBoop(true)
    setOB(newOB)
  }

  const renderRGL = () => {
    const empty = Object.keys(ob).length > 0
    if (empty) {
      return (
        <OBBeautifulDnD
          className={classes.dndGrid}
          ob={ob}
          setOB={(newOb: ObservationBlock) => {
            // triggerBoop(true)
            setOB(newOb)
          }} />
      )
    }
    else {
      return <h1>Loading...</h1>
    }
  }

  const handleEdit = props.editable ? onEdit : false

  const targetResolverClick = () => {
    console.log('target resolver clicked')
  }

  const handleSubmit = () => {
    triggerBoop(false)
    ob_api_funcs.put(ob._id, ob)
  }

  const sideMenu = (
    <Paper className={classes.paper} elevation={3}>
      <h3>Observation Block Selection</h3>
      <ObservationBlockSelecter setOB={setOB} handleOBSelect={handleOBSelect} ob_id={ob_id} />
      <h3>Observation Block Edit/Display</h3>
      <div className={classes.buttonBlock}>
        <Tooltip title="Upload OB to database">
          <animated.button aria-label='upload' onClick={handleSubmit} style={boopStyle}>
            <PublishIcon />
          </animated.button>
        </Tooltip>
        {/* <Tooltip title="Create blank OB">
          <IconButton aria-label='create' onClick={createOB}>
            <AddIcon />
          </IconButton>
        </Tooltip> */}
        <Tooltip title="Copy OB to new OB">
          <IconButton aria-label='copy' onClick={copyOB}>
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Save OB as JSON">
          <IconButton aria-label='copy' onClick={saveOBasJSON}>
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <UploadDialog uploadOBFromJSON={uploadOBFromJSON} />
        <DeleteDialog deleteOB={deleteOB} />
      </div>

      <Tooltip title="Add template to Selected OB">
        <div className={classes.templateSelect}>
          <TemplateSelection addSeq={addSeq} instrument={instrument} obSequences={Object.keys(ob)} />
        </div>
      </Tooltip>
      <Tooltip title="Resolve template image">
        <div>
          <Button onClick={targetResolverClick} >Target Resolver</Button>
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
  )

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
        {sideMenu}
      </Drawer>
      {renderRGL()}
      <Autosave ob={ob} />
    </div>
  )
}

ODTView.defaultProps = {
  theme: 'bespin',
  iconStyle: 'circle',
  collapsed: 1,
  collapseStringsAfter: 15,
  enableClipboard: true,
  editable: true,
}

