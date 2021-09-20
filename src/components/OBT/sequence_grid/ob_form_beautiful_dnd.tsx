//@ts-nocheck
import TemplateForm from '../../forms/template_form';
import { AccordionForm } from './accordion_form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import React from "react";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import "./styles.css";
import { mergeClasses } from '@material-ui/styles';

const ROW_HEIGHT = 45;
const OB_NAMES: OBSeqNames[] = ['acquisition', 'sequences', 'target']

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        droppableDragging: {
            background: theme.palette.divider,
            padding: grid,
            minWidth: '350px'
        },
        droppable: {
            background: theme.palette.sucess,
            padding: grid,
            minWidth: '350px'
        },
        accordian: {
            userSelect: "none",
            padding: grid * 2,
            margin: `0 0 ${grid}px 0`,
            background: theme.palette.sucess,
        },
        accordianDragging: {
            userSelect: "none",
            padding: grid * 2,
            margin: `0 0 ${grid}px 0`,
            background: theme.palette.primary,
        },
        heading: {
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: '1.25rem',
            marginTop: theme.spacing(1)
        },
        cell: {
            margin: theme.spacing(0),
            padding: theme.spacing(0),
            minHeight: ROW_HEIGHT
        },
        templateAccordian: {
            padding: theme.spacing(1),
            margin: theme.spacing(1),
            alignItems: 'center',
            backgroundColor: theme.palette.divider,
        },
        accordianSummary: {
            height: theme.spacing(3),
            padding: theme.spacing(0)
        }
    }),
);

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};
const grid = 8;

const get_item_style = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});


const parseOB = (ob: ObservationBlock): Partial<ObservationBlock> => {
    // return the components that will generate forms
    let forms: { [k: string]: any } = {}
    Object.keys(ob).forEach((cn: string) => {
        if (OB_NAMES.indexOf(cn as any) > -1) {
            if (cn === 'sequences') {
                const seq = ob.sequences as any
                for (let idx = 0; idx < seq.length; idx++) {
                    const sci_name = 'science_' + JSON.stringify(idx) as string
                    forms[sci_name] = seq[idx]
                }
            }
            else {
                forms[cn] = ob[cn as keyof ObservationBlock]
            }
        }
    })
    return forms
}


const handleDelete = () => { }

const createAccordianDiv = (provided, snapshot, key, formChild: JSX.Element, acc: any) => {
    const className = snapshot.isDragging ? {...provided.draggableProps, ...acc.accDrag} : acc.acc
    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={className}
            // style={get_item_style(
            //     snapshot.isDragging,
            //     provided.draggableProps.style
            // )}
        >
            <AccordionForm
                name={key}
                id={key}
                handleDelete={handleDelete}
            >
                {formChild}
            </AccordionForm>
        </div>
    )
}

const create_draggable = (keyValue, index, updateOB, acc) => {
    const [key, component] = keyValue
    const form = createForm(key, component, updateOB)
    return (
        <Draggable
            key={key}
            draggableId={key}
            index={index}
        >
            {(provided, snapshot) => createAccordianDiv(provided, snapshot, key, form, acc)}
        </Draggable>
    )
}

const chunkify = (a, n, balanced) => {
    if (n < 2)
        return [a];
    var len = a.length,
        out = [],
        i = 0,
        size;

    if (len % n === 0) {
        size = Math.floor(len / n);
        while (i < len) {
            out.push(a.slice(i, i += size));
        }
    }

    else if (balanced) {
        while (i < len) {
            size = Math.ceil((len - i) / n--);
            out.push(a.slice(i, i += size));
        }
    }

    else {

        n--;
        size = Math.floor(len / n);
        if (len % size === 0)
            size--;
        while (i < size * n) {
            out.push(a.slice(i, i += size));
        }
        out.push(a.slice(size * n));

    }

    return out;
}

const createForm = (id: string, obComponent: OBComponent, updateOB): JSX.Element => {
    return <TemplateForm id={id} updateOB={updateOB} obComponent={obComponent} />
}


const updateOBScience = (seqName: string, ob: ObservationBlock, formData: OBSequence): ObservationBlock => {
    let newOb = { ...ob }
    //get science idx from name
    const idx = JSON.parse(seqName.substring(seqName.indexOf('_') + 1))
    let seq = ob.sequences as Science[]
    if (seq) {
        Object.entries(formData).forEach(([key, value]) => {
            seq[idx].parameters[key] = value
        })
        newOb.sequences = seq
    }
    return newOb
}

const updateOBComponent = (seqName: string, ob: ObservationBlock, formData: { [key: string]: any }): ObservationBlock => {
    let component = ob[seqName as keyof ObservationBlock] as any
    if (seqName === 'target') {
        component = formData
    }
    else {
        let params: { [key: string]: any } = component.parameters
        console.log(params)
        Object.entries(formData).forEach(([key, value]) => {
            params[key] = value
        })
        component.parameters = params
    }
    ob[seqName as keyof ObservationBlock] = component as any
    return ob as ObservationBlock
}


export const OBBeautifulDnD = (props) => {
    const classes = useStyles()
    const obComponents: Partial<ObservationBlock> = parseOB(props.ob)
    let obItems = Object.entries(obComponents)
    const nColumns = 3
    const evenChunks = true
    obItems = chunkify(obItems, nColumns, evenChunks)
    const [state, setState] = React.useState(obItems);

    const updateOB = (seqName: OBSeqNames, formData: OBSequence, newHeight?: number) => {
        // if (newHeight) { handleResize(seqName, newHeight, true) }
        if (Object.keys(formData).length > 0) {
            let newOb = { ...props.ob }
            //handle sequences
            if (seqName.includes('science')) {
                newOb = updateOBScience(seqName, newOb, formData)
            }
            else {
                newOb = updateOBComponent(seqName, newOb, formData)
            }
            props.setOB(newOb)
        }
    }

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(state[sInd], source.index, destination.index);
            const newState = [...state];
            newState[sInd] = items;
            setState(newState);
        } else {
            const result = move(state[sInd], state[dInd], source, destination);
            const newState = [...state];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];

            setState(newState.filter(group => group.length));
        }
    }

    const acc = {acc: classes.accordian, accDrag: classes.accordianDragging}
    return (
        <div clasName={classes.root}>
            <div style={{ display: "flex" }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {state.map((keyValueArr, ind) => (
                        <Droppable key={ind} droppableId={`${ind}`}>
                            {(provided, snapshot) => (
                                <div
                                    className={snapshot.isDraggingOver ? classes.droppableDragging : classes.droppable}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {keyValueArr.map((keyValue, index) => (
                                        create_draggable(keyValue, index, updateOB, acc)
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </DragDropContext>
            </div>
        </div>
    );
}