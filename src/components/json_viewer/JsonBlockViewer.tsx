import ReactJson, { ThemeKeys, InteractionProps } from 'react-json-view'
import {ObservationBlock} from '../../typings/papahana'
import { IconButton, Paper, makeStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles'
import PublishIcon from '@material-ui/icons/Publish'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { useState } from 'react'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { api_call } from '../../api/utils'
import { mock_ob_get } from './../../mocks/mock_utils'
import OBForm from '../ob_form'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteDialog from './delete_dialog'
import ObservationBlockSelecter from './ob_select'
import JsonViewTheme from './../json_view_theme'

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
    buttonBlock: {
      margin: theme.spacing(1),
      display: 'inline-flex',
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
    const classes = useStyles(); 
    const [ob_id, setOBID] = useQueryParam('ob_id', StringParam)
    const [ob, setOB] = useState({} as ObservationBlock)
    const [theme, setTheme] = 
      useQueryParam('theme', withDefault(StringParam, props.theme as string))
    
    const getOB = (): void => {
        api_call(ob_id as string, 'papahana_demo', 'get').then( (newOb: ObservationBlock ) => {
        //mock_ob_get(ob_id as string).then( ( newOb: ObservationBlock) => {
            if (newOb._id) {
              console.log('setting ob')
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
        <ObservationBlockSelecter observer_id={props.observer_id} handleOBSelect={handleOBSelect} ob_id={ob_id}/>
        <h3>Observation block</h3>
        <div className={classes.buttonBlock}>
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
        </div>
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

