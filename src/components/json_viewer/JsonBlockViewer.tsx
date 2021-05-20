import ReactJson, { ThemeKeys, InteractionProps, ThemeObject } from 'react-json-view'
import {ObservationBlock} from '../../typings/papahana'
import { IconButton, Paper, makeStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles'
import PublishIcon from '@material-ui/icons/Publish'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { mock_ob } from './mock_ob'
import { useState } from 'react'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { api_call } from '../../api/utils'
import OBForm from '../ob_form'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteDialog from './delete_dialog'
import ObservationBlockSelecter from './ob_select'
import DropDown from '../drop_down'

const useStyles = makeStyles( (theme: Theme) => ({
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
    paper: {
        padding: theme.spacing(3),
        margin: theme.spacing(1),
        elevation: 3,
    },
    widepaper: {
        padding: theme.spacing(3),
        margin: theme.spacing(1),
        minWidth: theme.spacing(50),
        maxWidth: 'min-content',
        elevation: 3
    }
}))

interface State {
   ob: ObservationBlock 
   theme: ThemeKeys | ThemeObject | undefined
}

const defaultState: State = {
   ob: mock_ob, 
   theme: 'bespin'
}

export interface Props {
   theme: ThemeKeys | null | undefined
   iconStyle: 'circle' | 'triangle' | 'square'
   collapsed: number | boolean, 
   collapseStringsAfter: number | false
   enableClipboard: boolean 
   editable: boolean
}

interface ThemeSelectProps {
  theme: string | ThemeKeys | null | undefined
  setTheme: Function
}

export const JsonViewTheme = (props: ThemeSelectProps) => {

  const keyList: ThemeKeys[] = [ 'apathy', 'apathy:inverted', 'ashes',
  'bespin', 'brewer', 'bright:inverted', 'bright', 'chalk',
  'codeschool', 'colors', 'eighties', 'embers', 'flat',
  'google', 'grayscale', 'grayscale:inverted', 'greenscreen', 'harmonic',
  'hopscotch', 'isotope', 'marrakesh', 'mocha', 'monokai', 'ocean',
  'paraiso', 'pop', 'railscasts', 'rjv-default', 'shapeshifter', 'shapeshifter:inverted',
  'solarized', 'summerfruit', 'summerfruit:inverted', 'threezerotwofour', 'tomorrow',
  'tube', 'twilight' ] 
  return(
  <DropDown 
  placeholder={'json theme'} 
  arr={keyList} 
  value={props.theme} 
  handleChange={props.setTheme} 
  label={'JSON Theme'}
  />  
  )
}

export default function JsonBlockViewer(props: Props) {
    const classes = useStyles(); 
    const [ob_id, setOBID] = useQueryParam('ob_id', StringParam)
    const [ob, setOB] = useState(defaultState.ob)
    const [theme, setTheme] = 
      useQueryParam('theme', withDefault(StringParam, props.theme as string))


    const getOB = (): void => {
        const query = `ob_id=${ob_id}`
        api_call(query, 'papahana_demo', 'get').then( (newOb: ObservationBlock) => {
            console.log('api result')
            console.log(newOb)
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
        api_call(query, 'papahana_demo', 'put', ob).then ( (result: any) => {
            console.log('put result')
            console.log(result)
        })
    }

    const copyOB = (): void => {
        const query = `ob_id=${ob_id}`
        console.log(`creating new ob from ob ${ob_id}`)
        api_call(query, 'papahana_demo', 'post', ob).then ( (result: any) => {
            console.log('put result')
            console.log(result)
        })
    }

    const deleteOB = (): void => {
        const query = `ob_id=${ob_id}`
        console.log(`deleting ob ${ob_id}`)
        api_call(query, 'papahana_demo', 'remove', ob).then ( (result: any) => {
            console.log('delete result')
            console.log(result)
        })
        }

    const onEdit = (e: InteractionProps) => {
          setOB(e.updated_src as ObservationBlock);
    }

    const handleOBSelect = (id: string) => {
      setOBID(id)
      getOB()
    }

    const handleEdit = props.editable ? onEdit : false
    return (
    <Grid container className={classes.root}>
    <Grid item xs>
    <Paper className={classes.paper} elevation={3}>
        <ObservationBlockSelecter handleOBSelect={handleOBSelect} ob_id={ob_id}/>
        <h3>Observation block</h3>
        {/* <Tooltip title="Search for OB by ID">
          <IconButton aria-label="search" onClick={getOB}>
            <SearchIcon />
          </IconButton>
        </Tooltip> */}
        <Tooltip title="Update OB in form">
          <IconButton aria-label='replace' onClick={replaceOB}>
            <PublishIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy OB to new OB">
          <IconButton aria-label='copy' onClick={copyOB}>
            <FileCopyIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete OB by ID">
          <DeleteDialog deleteOB={deleteOB} />
        </Tooltip>
        <JsonViewTheme
          theme={theme as ThemeKeys | null | undefined}
          setTheme={setTheme}
        />
        <ReactJson
        src={ob as object} 
        theme={theme as ThemeKeys | undefined}
        iconStyle={props.iconStyle}
        collapsed={props.collapsed}
        collapseStringsAfterLength={props.collapseStringsAfter}
        enableClipboard={props.enableClipboard}
        onEdit={handleEdit}
        />
    </Paper>
    </Grid>
    <Grid item xs={6}>
    <Paper className={classes.widepaper}>
        <OBForm 
        ob={ob}
        setOB={setOB}/>
    </Paper>
    </Grid>
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

