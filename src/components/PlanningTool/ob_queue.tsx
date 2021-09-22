import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { ObservationBlock } from "../../typings/papahana"
import { Theme } from '@material-ui/core/styles'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const useStyles = makeStyles((theme: Theme) => ({
    grid: {
        textAlign: 'center',
        margin: theme.spacing(1),
        display: 'flex',
        width: '100%',
    },
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(1),
        width: theme.spacing(50),
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
    avlObs: ObservationBlock[] | number[];
    setAvlObs: Function;
    selObs: ObservationBlock[] | number[];
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
    return (
        <Draggable
            key={item}
            draggableId={item}
            index={idx}
        >
            {(provided, snapshot) => CreateDiv({ provided: provided, snapshot: snapshot, formChild: (<span>item {item}</span>) })}
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

export const OBQueue = (props: Props) => {
    const classes = useStyles()

    const [state, setState] = React.useState({} as any);

    useEffect(() => {
        const obItems: any = {
            avlObs: {
                title: "Available OBs",
                tooltip: "Observation Blocks/containers available for selected semester",
                obs: props.avlObs,
                setObs: props.setAvlObs
            },
            selObs: {
                title: "Selected OBs",
                tooltip: "Observation Block/containers in selected queue",
                obs: props.selObs,
                setObs: props.setSelObs
            }
        }
        setState(obItems)
    }, [])

    const onDragEnd = (result: any) => {

        const { source, destination } = result;
        if (!destination) return;
        const sKey: string = source.droppableId;
        const dKey: string = destination.droppableId;

        if (sKey === dKey) { //shuffling items around
            let newObs = [...state[dKey].obs]
            newObs = reorder(newObs, source.index, destination.index)
            console.log('drag end', result, newObs)
            let newState = {...state}
            newState[dKey].obs = newObs
            setState(newState);
        } else { // new item in state
            const result = move(state[sKey].obs, state[dKey].obs, source, destination);
            const newState = {...state};
            newState[sKey].obs = result[sKey];
            newState[dKey].obs = result[dKey];
            console.log(sKey, dKey, result)
            setState(newState);
        }
    }

    return (
        <Grid container spacing={1} className={classes.grid}>
            <DragDropContext onDragEnd={onDragEnd}>
                {Object.entries(state).map(( [key, keyValueArr]: [string, any], jdx) => (
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
                                            return (create_draggable(JSON.stringify(item), idx))
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