import ReactJson, { ThemeKeys, ReactJsonViewProps } from 'react-json-view'
import {ObservationBlock} from '../../papahana'
import { TextField, IconButton, Paper, makeStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import { mock_ob } from './mock_ob'
import React, { useState } from 'react'
import { setTokenSourceMapRange } from 'typescript'

const useStyles = makeStyles( (theme: Theme) => ({
    root: {
        textAlign: 'left',
        padding: theme.spacing(10),
    },
    paper: {
        padding: theme.spacing(3),
        elevation: 3
    }
}))

export interface Props {
   ob: ObservationBlock 
   theme: ThemeKeys
   iconStyle: ReactJsonViewProps["iconStyle"]
   collapsed: boolean | number
   collapseStringsAfter: number
   enableClipboard: boolean
}


export default function JsonBlockViewer(props: Props) {
    const classes = useStyles(); 
    const [ob_id, setOB] = useState(props.ob._id)
    const getOB = () => alert(`todo: update props.ob with ob ${ob_id}`)
    return (
    <div className={classes.root}>
    <Paper className={classes.paper} elevation={3}>
        <h3>Observation block</h3>
        <TextField 
          id="standard-basic"
          label="OB ID"
          type='string'
          value={ob_id}
          onChange={ (evt) => setOB(evt.target.value)}
        />
        <IconButton aria-label="delete" onClick={getOB}>
        <SearchIcon />
        </IconButton>
        <ReactJson
        src={props.ob as object} 
        theme={props.theme}
        iconStyle={props.iconStyle}
        collapsed={props.collapsed}
        collapseStringsAfterLength={props.collapseStringsAfter}
        enableClipboard={props.enableClipboard}
        />
    </Paper>
    </div>
    )
}

JsonBlockViewer.defaultProps = {
    ob: mock_ob,
    theme: 'bespin',
    iconStyle: 'circle',
    collapsed: 1,
    collapseStringsAfter: 15,
    enableClipboard: true
}