import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { ObservationBlock, OBCell } from "../../typings/papahana"
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
        minWidth: theme.spacing(20),
        width: '95%',
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
    },
    cell: {
        width: '45%'
    },
}))

interface Props {
    sem_id: string;
    avlObs: OBCell[];
    setAvlObs: Function;
    selObs: OBCell[];
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

const create_draggable = (obCell: OBCell, idx: number) => {
    return (
        <Draggable
            key={obCell.id}
            draggableId={obCell.id}
            index={idx}
        >
            {(provided, snapshot) => CreateDiv(
                {
                    provided: provided,
                    snapshot: snapshot,
                    formChild: (
                        <div>
                            <p>
                                OB name: {obCell.name}
                            </p>
                            <p>
                                Type: {obCell.type}
                            </p>
                        </div>
                    )
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


export const OBQueue = (props: Props) => {

    const classes = useStyles();
    const avlTitle= "Available OBs/Containers"
    const avlTooltip= "Observation Blocks/containers available for selected semester"
    const selTitle="Selected OBs/Containers"
    const selTooltip= "Observation Block/containers in selected queue"

    useEffect(() => {
    }, [props])

    useEffect(() => {
    }, [])

    const onDragEnd = (result: any) => {
        const { source, destination } = result;
        if (!destination) return;
        const sKey: 'selObs' | 'avlObs' = source.droppableId;
        const dKey: 'selObs' | 'avlObs' = destination.droppableId;

        if (sKey === dKey) { //shuffling items around
            let newObs = [...props[dKey]]
            newObs = reorder(newObs, source.index, destination.index)
            if (sKey === 'selObs') {
                props.setSelObs(newObs)
            }
            else {
                props.setAvlObs(newObs)
            }
            // setState(newState);
        } else { // new item in state
            const result = move(props[sKey], props[dKey], source, destination);
            if (sKey === 'selObs') {
                props.setSelObs(result[sKey])
                props.setAvlObs(result[dKey])
            }
            else {
                props.setSelObs(result[dKey])
                props.setAvlObs(result[sKey])
            }
        }
    }

    const create_droppable = (obs: any, key: string, tooltip: string, title: string) => {
        return (
            <Paper className={classes.paper} elevation={3}>
                <Tooltip title={tooltip}>
                    <h2>{title}</h2>
                </Tooltip>
                <Droppable key={key} droppableId={key}>
                    {(provided: any, snapshot: any) => {
                        return (
                            <div
                                className={snapshot.isDraggingOver
                                    ? classes.droppableDragging : classes.droppable}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {obs !== undefined &&
                                    obs.map((obCell: OBCell, idx: number) => {
                                        return (create_draggable(obCell, idx))
                                    })
                                }
                                {provided.placeholder}
                            </div>)
                    }}
                </Droppable>
            </Paper >
        )
    }
    return (
        <Grid container spacing={1} >
            <DragDropContext onDragEnd={onDragEnd}>
                <Grid className={classes.cell} item xs={6}>
                    {create_droppable(props.avlObs, 'avlObs', avlTooltip, avlTitle)}
                </Grid>
                <Grid className={classes.cell} item xs={6}>
                    {create_droppable(props.selObs, 'selObs', selTooltip ,selTitle)}
                </Grid>
            </DragDropContext>
        </Grid>
    )
}
