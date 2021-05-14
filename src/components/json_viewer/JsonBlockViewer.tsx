import ReactJson, { ThemeKeys, InteractionProps } from 'react-json-view'
import {ObservationBlock} from '../../typings/papahana'
import { TextField, IconButton, Paper, makeStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import PublishIcon from '@material-ui/icons/Publish'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import DeleteIcon from '@material-ui/icons/Delete'
import { mock_ob } from './mock_ob'
import { useState } from 'react'
import { useQueryParam, StringParam } from 'use-query-params'
import { api_call } from '../../api/utils'
import OBForm from '../ob_form'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'

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
}

const defaultState: State = {
   ob: mock_ob, 
}

export interface Props {
   theme: ThemeKeys
   iconStyle: 'circle' | 'triangle' | 'square'
   collapsed: number | boolean, 
   collapseStringsAfter: number | false
   enableClipboard: boolean 
   editable: boolean
}


export default function JsonBlockViewer(props: Props) {
    const classes = useStyles(); 
    const [ob_id, setOBID] = useQueryParam('ob_id', StringParam)
    const [ob, setOB] = useState(defaultState.ob)

    const getOB = (): void => {
        const query = `ob_id=${ob_id}`
        api_call(query, 'papahana_demo', 'get').then( (newOb: ObservationBlock) => {
            console.log('api result')
            console.log(newOb)
            setOB(newOb)
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

    const deleteOB = (): void => {
        const query = `ob_id=${ob_id}`
        console.log(`deleting ob ${ob_id}`)
        api_call(query, 'papahana_demo', 'remove', ob).then ( (result: any) => {
            console.log('delete result')
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

    const onEdit = (e: InteractionProps) => {
          setOB(e.updated_src as ObservationBlock);
    }

    const handleEdit = props.editable ? onEdit : false
    return (
    <Grid container className={classes.root}>
    <Grid item xs>
    <Paper className={classes.paper} elevation={3}>
        <h3>Observation block</h3>
        <TextField 
          id="standard-basic"
          label="OB ID"
          type='string'
          value={ob_id}
          onChange={ (evt) => setOBID(evt.target.value)}
        />
        <Tooltip title="Search for OB by ID">
          <IconButton aria-label="search" onClick={getOB}>
            <SearchIcon />
          </IconButton>
        </Tooltip>
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
          <IconButton area-label='remove' onClick={deleteOB} >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <ReactJson
        src={ob as object} 
        theme={props.theme}
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

