import ReactJson, { ThemeKeys, InteractionProps } from 'react-json-view'
import {ObservationBlock} from '../../papahana'
import { TextField, IconButton, Paper, makeStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import { mock_ob } from './mock_ob'
import { useState } from 'react'
import { useQueryParam, StringParam } from 'use-query-params'
import { api_call } from '../../api/utils'
import OBJSONForm from '../ob_form'

const useStyles = makeStyles( (theme: Theme) => ({
    root: {
        textAlign: 'left',
        padding: theme.spacing(10),
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
    const getOB = () => {
        const query = `ob_id=${ob_id}`
        api_call(query, 'papahana_demo', 'get').then( (result: ObservationBlock[]) => {
            console.log(`querying ${query}, result: ${result}`)
            setOB(result[0])
            },
            (error: any) => {
                console.error(error)
            }
        )
    }

    const onEdit = (e: InteractionProps) => {
          console.log(e);
          setOB(e.updated_src as ObservationBlock);
      }

    const handleEdit = props.editable ? onEdit : false
    
    return (
    <div className={classes.root}>
    <Paper className={classes.paper} elevation={3}>
        <h3>Observation block</h3>
        <TextField 
          id="standard-basic"
          label="OB ID"
          type='string'
          value={ob_id}
          onChange={ (evt) => setOBID(evt.target.value)}
        />
        <IconButton aria-label="delete" onClick={getOB}>
        <SearchIcon />
        </IconButton>
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
    <Paper>
        <OBJSONForm 
        ob={ob}
        setOB={setOB}/>

    </Paper>
    </div>
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

