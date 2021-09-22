import React, { useEffect, useState } from 'react'
import { ObservationBlock } from '../../typings/papahana'
import { makeStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import { api_call } from '../../api/utils'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import { OBQueue } from './ob_queue'
import ObservationBlockSelecter from '../OBSelect/ob_select'
import SkyView from './sky_view'

const useStyles = makeStyles((theme: Theme) => ({
    grid: {
        textAlign: 'left',
        margin: theme.spacing(1),
        display: 'flex',
        width: '100%',
    },
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(1),
        minWidth: theme.spacing(70),
        elevation: 3,
    },
    widepaper: {
        padding: theme.spacing(2),
        margin: theme.spacing(1),
        // height: '500px',
        elevation: 3,
        minWidth: theme.spacing(100)
    },
    cell: {
    },
}))

interface Props {

}



export const PlanningToolView = (props: Props) => {

    const startObs = [1,2,3,4,5,6,7,8]
    const [avlObs, setAvlObs] = useState([] as ObservationBlock[] | number[])
    const [selObs, setSelObs] = useState([] as ObservationBlock[] | number[])
    React.useEffect( () => {
        setAvlObs(startObs)
    }, [])

    const classes = useStyles()
    return (
        <Grid container spacing={1} className={classes.grid}>
            <Grid item xs={8}>
                    <OBQueue 
                        selObs={selObs}
                        setSelObs={setSelObs}
                        avlObs={avlObs}
                        setAvlObs={setAvlObs}
                        />
            </Grid>
            <Grid item xs={4}>
                <Paper className={classes.paper} elevation={3}>
                    <Tooltip title="View selected OB target charts here">
                        <h2>Sky View</h2>
                    </Tooltip>
                    <SkyView />
                </Paper >
            </Grid>
        </Grid>
    )
}