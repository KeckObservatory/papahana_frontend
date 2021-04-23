import ReactJson, { ThemeKeys, ReactJsonViewProps } from 'react-json-view'
import {ObservationBlock} from '../../papahana'
import { TextField, IconButton, Paper, makeStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import { mock_ob } from './mock_ob'
import React, { useState } from 'react'
import {api_call} from "../../api/utils";
import { useHistory, useLocation } from "react-router-dom"
import { getQuery, setQuery } from '../App'
import { StringParam, useQueryParam } from 'use-query-params'

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
}

export default function JsonBlockViewer(props: Props) {
    const classes = useStyles(); 
    const [ob_id, setOBID] = useQueryParam('ob_id', StringParam)
    if (!ob_id) {
        setOBID(defaultState.ob._id)
    }
    const [ob, setOB] = useState(defaultState.ob)
    const location = useLocation()
    const history = useHistory()
    const getOB = () => {
        const query = `ob_id=${ob_id}`
        const route = `?${setQuery(location, 'ob_id', ob_id)}`
        history.push(route)
        api_call(query, 'papahana_demo').then( (result: ObservationBlock[]) => {
            console.log(`querying ${query}, result: ${result}`)
            setOB(result[0])
            },
            (error: any) => {
                console.error(error)
            }
        )
    }
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
        />
    </Paper>
    </div>
    )
}

JsonBlockViewer.defaultProps = {
    theme: 'bespin',
    iconStyle: 'circle',
    collapsed: 1,
    collapseStringsAfter: 15,
    enableClipboard: true
}