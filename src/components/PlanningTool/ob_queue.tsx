import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { ObservationBlock } from "../../typings/papahana"
import { Theme } from '@mui/material/styles'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const useStyles = makeStyles((theme: any) => ({
    grid: {
        textAlign: 'center',
        margin: theme.spacing(1),
        display: 'flex',
        width: '100%',
    },
    // paper: {
    //     padding: theme.spacing(2),
    //     margin: theme.spacing(1),
    //     width: theme.spacing(50),
    //     elevation: 3,
    // },
    paper: {
        padding: '8px',
        margin: '4px',
        width: '200px',
        elevation: 3,
    },
    droppableDragging: {
        background: theme.palette.divider,
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        minHeight: theme.spacing(5),
    },
    droppable: {
        background: theme.palette.divider,
        margin: theme.spacing(1),
        padding: theme.spacing(0),
        minHeight: theme.spacing(5),
        // minWidth: '150px',
    },
    cell: {
        width: '45%'
    },
}))

interface Props {
    sem_id: string;
    avlObs: ObservationBlock[] | number[] | string[];
    setAvlObs: Function;
    selObs: ObservationBlock[] | number[] | string[];
    setSelObs: Function;
}

interface CreateDivProps {
    provided: any;
    snapshot: any;
    formChild: JSX.Element;
}

const CreateDiv = (props: CreateDivProps) => {
    const classes = useStyles()
    const acc = { acc: classes.droppableDragging, accDrag: classes.droppable } as any
    const className = props.snapshot.isDragging ? { ...props.provided.draggableProps, ...acc.accDrag } : acc.acc
    return (
        <div
            ref={props.provided.innerRef}
            {...props.provided.draggableProps}
            {...props.provided.dragHandleProps}
            className={className}
        >
            {props.formChild}
        </div>
    )
}

const create_draggable = (item: any, idx: number) => {
    let [id, type] = [item.id, item.type]

    if (id === undefined) id = item //develop
    if (type === undefined) type = 'dev cell' //develop
    console.log('id, type')
    console.log(id)
    console.log(type)
    return (
        <Draggable
            key={id}
            draggableId={id}
            index={idx}
        >
            {(provided, snapshot) => CreateDiv(
                {
                    provided: provided,
                    snapshot: snapshot,
                    formChild: (<span>id {id} type {type}</span>)
                })
            }
        </Draggable>
    )
}

/**
 * Moves an item from one list to another list.
 */
const move = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: any = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const formatProps = (props: Props) => {
    const obItems: any = {
        avlObs: {
            title: "Available OBs/Containers",
            tooltip: "Observation Blocks/containers available for selected semester",
            obs: props.avlObs,
            setObs: props.setAvlObs
        },
        selObs: {
            title: "Selected OBs/Containers",
            tooltip: "Observation Block/containers in selected queue",
            obs: props.selObs,
            setObs: props.setSelObs
        }
    }
    return obItems
}

export const OBQueue = (props: Props) => {

    const classes = useStyles()
    const [state, setState] = React.useState({} as any);

    useEffect(() => {
        const obItems = formatProps(props)
        console.log('new obItems')
        console.log(obItems)
        setState(obItems.selItems)
    }, [props])

    useEffect(() => {
        const obItems = formatProps(props)
        console.log('init obItems')
        console.log(obItems)
    }, [])

    const onDragEnd = (result: any) => {

        const { source, destination } = result;
        if (!destination) return;
        const sKey: string = source.droppableId;
        const dKey: string = destination.droppableId;

        var newState = state
        if (sKey === dKey) { //shuffling items around
            let newObs = [...state[dKey].obs]
            newObs = reorder(newObs, source.index, destination.index)
            newState[dKey].obs = newObs
            setState(newState);
        } else { // new item in state
            const result = move(state[sKey].obs, state[dKey].obs, source, destination);
            newState[sKey].obs = result[sKey];
            newState[dKey].obs = result[dKey];
            setState(newState);
        }
        const selectedOBDest = dKey.includes('selObs')
        if (selectedOBDest) {
            console.log('selected OB changed')
            props.setSelObs(newState.selObs.obs)
        }
    }

    console.log('state is:')
    console.log(state)
    if (state===undefined){
        return <div>Loading...</div>
    }
    else {
    return (
        <Grid container spacing={1} >
            <DragDropContext onDragEnd={onDragEnd}>
                {Object.entries(state).map(([key, keyValueArr]: [string, any], jdx) => (
                    <Grid className={classes.cell} item xs={6}>
                        <Paper className={classes.paper} elevation={3}>
                            <Tooltip title={keyValueArr.tooltip}>
                                <h2>{keyValueArr.title}</h2>
                            </Tooltip>
                            <Droppable key={key} droppableId={key}>
                                {(provided: any, snapshot: any) => {
                                    return (
                                        <div
                                            className={snapshot.isDraggingOver ? classes.droppableDragging : classes.droppable}
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            {keyValueArr.obs.map((item: any, idx: number) => {
                                                return (create_draggable(item, idx))
                                            })}
                                            {provided.placeholder}
                                        </div>)
                                }}
                            </Droppable>
                        </Paper >
                    </Grid>
                ))}
            </DragDropContext>
        </Grid>
    )
}
}