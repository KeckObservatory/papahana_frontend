//@ts-nocheck
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { ObservationBlock } from "../../typings/papahana"
import { Theme } from '@material-ui/core/styles'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const useStyles = makeStyles((theme: Theme) => ({
    droppableDragging: {
        background: theme.palette.divider,
        margin: theme.spacing(1),
        padding: theme.spacing(0),
        minHeight: theme.spacing(5),
        minWidth: '350px'
    },
    droppable: {
        background: theme.palette.divider,
        margin: theme.spacing(1),
        padding: theme.spacing(0),
        minHeight: theme.spacing(5),
        minWidth: '350px',
    },
    cell: {
    },
}))

interface Props {
    obs: ObservationBlock[] | number[];
    setObs: Function;
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
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: any = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const reorder = (list: Array<T>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export const OBQueue = (props: Props) => {
    const classes = useStyles()

    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            let newObs = [...props.obs]
            newObs = reorder([...props.obs], result.source.index, result.destination.index)
            console.log('drag end', result, newObs)
            props.setObs(newObs as ObservationBlock[] | number);
        } else {
            const result = move(state[sInd], state[dInd], source, destination);
            const newState = [...state];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];
            setState(newState.filter(group => group.length));
        }

    }
    const onDragStart = () => {
        console.log('starting drag')
    }

    const divs = props.obs.map((item, idx) => {
        return (create_draggable(JSON.stringify(item), idx))
    })

    return (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <Droppable key={0} droppableId={`${0}`}>
                {(provided: any, snapshot: any) => {
                    return (<div
                        className={snapshot.isDraggingOver ? classes.droppableDragging : classes.droppable}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {divs}
                        {provided.placeholder}
                    </div>)
                }}
            </Droppable>
        </DragDropContext>
    )
}