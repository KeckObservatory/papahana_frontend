
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import { useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import { OBCell, Scoby } from "../../typings/papahana"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import OBSubmit from './ob_submit'

const useStyles = makeStyles((theme: any) => ({
    grid: {
        textAlign: 'center',
        margin: theme.spacing(1),
        display: 'flex',
        width: '100%',
    },
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
        width: '45%',
        elevation: 3,
    },
}))

interface Props {
    selObs: Scoby[];
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

const DragDiv = (row: Scoby) => {

    return (
        <div>
            <p>
                OB name: {row.name}
            </p>
            <p>
                Type: {row.ob_type}
            </p>
            {row.ra && <p> Ra: {row.ra} Dec: {row.dec} </p>}
        </div>
    )
}

const create_draggable = (row : Scoby, idx: number) => {
    return (
        <Draggable
            key={row.ob_id}
            draggableId={row.ob_id as string}
            index={idx}
        >
            {(provided, snapshot) => CreateDiv(
                {
                    provided: provided,
                    snapshot: snapshot,
                    formChild: DragDiv(row)

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


const SelectedQueue = (props: Props) => {

    const classes = useStyles();
    const selTitle = "Selected OBs"
    const selTooltip = "Observation Blocks in queue"

    useEffect(() => {
    }, [props])

    useEffect(() => {
    }, [])

    const onDragEnd = (result: any) => {
        const { source, destination } = result;
        if (!destination) return;
        //@ts-ignore
        let newObs = [...props.selObs]
        newObs = reorder(newObs, source.index, destination.index)
        props.setSelObs(newObs)
    }

    const create_droppable = (rows: Scoby[], key: string, tooltip: string, title: string) => {
        return (
            <Paper className={classes.paper} elevation={3}>
                <Tooltip title={tooltip}>
                    <h3>{title}</h3>
                </Tooltip>
                <OBSubmit/>
                <Droppable key={key} droppableId={key}>
                    {(provided: any, snapshot: any) => {
                        return (
                            <div
                                className={snapshot.isDraggingOver
                                    ? classes.droppableDragging : classes.droppable}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {rows !== undefined &&
                                    rows.map((row: Scoby, idx: number) => {
                                        return (create_draggable(row, idx))
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
        <DragDropContext onDragEnd={onDragEnd}>
            {create_droppable(props.selObs, 'selObs', selTooltip, selTitle)}
        </DragDropContext>
    )
}

export default SelectedQueue