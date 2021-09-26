import React, { useEffect, useState } from 'react'
import { get_obs_from_semester, get_sem_id_list } from '../../api/utils'
import { ObservationBlock } from '../../typings/papahana'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import { OBQueue } from './ob_queue'
import SkyView from './sky_view'
import DropDown from '../drop_down'

const useStyles = makeStyles((theme: any) => ({
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
  observer_id: string
}

interface State {
    selObs:  any; //todo: define cell type
    avlObs:  any;
    sem_id: string 
    semIdList: string[]
}


const defaultState: State = {
  avlObs: [],
  selObs: [],
  sem_id: '2017A_U033',
  semIdList: []
}

const container_obs_to_cells = (container_obs: any) => {
    let cells: any[] = []
    let uid = 0
    Object.entries(container_obs).forEach( (cid_obs: any) => {
        const cid = cid_obs[0]
        const obs = cid_obs[1].splice(0,1,1)
        const cidCell = {id: cid, type: 'container'}
        cells.push(cidCell)
        obs.forEach( (ob: ObservationBlock, idx: number) => {
            const obCell: any = {cid: cid, name: ob.metadata.name, type: 'ob', id: uid}
            const tgt = ob.target
            if(tgt) ob['target'] = tgt
            cells.push(obCell)
            uid+=1
        })

    })
    return cells
}

export const PlanningToolView = (props: Props) => {

    const [avlObs, setAvlObs] = useState(defaultState.avlObs)
    const [selObs, setSelObs] = useState(defaultState.selObs)

    const [semIdList, setSemIdList] = useState(defaultState.semIdList)
    const [sem_id, setSemId] =
        useQueryParam('sem_id', withDefault(StringParam, defaultState.sem_id))

    useEffect( () => {
        get_obs_from_semester(props.observer_id, sem_id).then( (container_obs: any) => {
            const cells = container_obs_to_cells(container_obs)
            console.log('got cells to add')
            console.log(cells)
            setAvlObs(cells)
        })
    }, [])


    useEffect( () => {
        console.log('selected obs is now')
        console.log(selObs)
    }, [selObs])

    useEffect( () => {
        console.log('sem_id changed')
        get_obs_from_semester(props.observer_id, sem_id).then( (container_obs: any) => {
            const cells = container_obs_to_cells(container_obs)
            console.log('got cells to add')
            console.log(cells)
            setAvlObs(cells)
        })
        }, [sem_id] )

    useEffect(() => { //run when props.observer_id changes
        get_sem_id_list(props.observer_id)
        .then((lst: string[]) => {
            setSemIdList(()=>[...lst])
        })
    }, [props.observer_id])

    const handleSemIdSubmit = (new_sem_id: string) => {
        console.log('submit button pressed')
        setSemId(new_sem_id)
    }

    const classes = useStyles()
    return (
        <div>
        <DropDown
            placeholder={'semester id'}
            arr={semIdList}
            value={sem_id}
            handleChange={handleSemIdSubmit}
            label={'Semester ID'}
        />
        <Grid container spacing={1} className={classes.grid}>
            <Grid item xs={8}>
                    <OBQueue 
                        sem_id={sem_id}
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
        </div>
    )
}