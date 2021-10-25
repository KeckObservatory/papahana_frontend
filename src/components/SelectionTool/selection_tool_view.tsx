import React, { useEffect, useState } from 'react'
import { get_obs_from_semester, get_sem_id_list } from '../../api/utils'
import { OBCell, ObservationBlock } from '../../typings/papahana'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import { OBQueue } from './ob_queue'
import SkyView from './sky-view/sky_view'
import DropDown from '../drop_down'

const useStyles = makeStyles((theme: any) => ({
    grid: {
        textAlign: 'left',
        margin: theme.spacing(1),
        display: 'flex',
        // width: '100%',
        maxWidth: theme.spacing(190),
    },
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(1),
        minWidth: theme.spacing(120),
        maxWidth: theme.spacing(150),
        elevation: 3,
    },
    widepaper: {
        padding: theme.spacing(2),
        margin: theme.spacing(1),
        height: '700px',
        elevation: 3,
        width: theme.spacing(120)
    },
    cell: {
    },
}))

interface Props {
  observer_id: string
}

interface State {
    selObs:  OBCell[]; 
    avlObs:  OBCell[];
    sem_id: string 
    semIdList: string[]
    chartType: string;
}


const defaultState: State = {
  avlObs: [],
  selObs: [],
  sem_id: '2017A_U033',
  semIdList: [],
  chartType: 'altitude'
}

const container_obs_to_cells = (container_obs: any) => {
    let cells: any[] = []
    let uid = 0
    Object.entries(container_obs).forEach( (cid_obs: any) => {
        const cid = cid_obs[0]
        const obs = cid_obs[1].splice(0,1,1)
        const cidCell = {id: cid, type: 'container'}
        //cells.push(cidCell) //ignore containers for now
        obs.forEach( (ob: ObservationBlock, idx: number) => {
            const obCell: OBCell = {
                cid: cid,
                name: ob.metadata.name,
                type: 'ob',
                id: JSON.stringify(uid),
                ra: ob.target?.ra,
                dec: ob.target?.dec
            }
            const tgt = ob.target
            if(tgt) obCell['target'] = tgt
            cells.push(obCell)
            uid+=1
        })

    })
    return cells
}

export const SelectionToolView = (props: Props) => {

    const chartTypes = ['altitude', 'air mass','parallactic angle', 'lunar angle']

    const [avlObs, setAvlObs] = useState(defaultState.avlObs)
    const [selObs, setSelObs] = useState(defaultState.selObs)
    const [chartType, setChartType] = useState(defaultState.chartType)

    const [semIdList, setSemIdList] = useState(defaultState.semIdList)
    const [sem_id, setSemId] =
        useQueryParam('sem_id', withDefault(StringParam, defaultState.sem_id))

    useEffect( () => {
        get_obs_from_semester(props.observer_id, sem_id).then( (container_obs: ObservationBlock[]) => {
            const cells = container_obs_to_cells(container_obs)
            setAvlObs(cells)
        })
    }, [])

    useEffect( () => {
        console.log('sem_id changed')
        get_obs_from_semester(props.observer_id, sem_id).then( (container_obs: ObservationBlock[]) => {
            const cells = container_obs_to_cells(container_obs)
            // console.log('got cells to add')
            // console.log(cells)
            setAvlObs(cells)
            setSelObs([])
        })
        }, [sem_id] )

    useEffect(() => { //run when props.observer_id changes
        get_sem_id_list(props.observer_id)
        .then((lst: string[]) => {
            setSemIdList(()=>[...lst])
        })
    }, [props.observer_id])

    const handleSemIdSubmit = (new_sem_id: string) => {
        // console.log('submit button pressed')
        setSemId(new_sem_id)
    }

    const handleChartTypeSelect = ( newChartType: string) => {
        setChartType(newChartType)
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
                <DropDown
                    placeholder={'Chart Type'}
                    arr={chartTypes}
                    value={chartType}
                    handleChange={handleChartTypeSelect}
                    label={'ChartType'}
                />
                <Paper className={classes.widepaper} elevation={3}>
                    <Tooltip title="View selected OB target charts here">
                        <h2>Sky View</h2>
                    </Tooltip>
                    <SkyView chartType={chartType} selObs={selObs}/>
                </Paper >
            </Grid>
        </Grid>
        </div>
    )
}