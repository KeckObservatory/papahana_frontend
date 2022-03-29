//@ts-nocheck
import TemplateForm from '../../forms/template_form';
import TargetTemplateForm from '../../forms/target_template_form';
import CommonParametersTemplateForm from '../../forms/common_parameters_template_form';
import { AccordionForm } from './accordion_form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import React from "react";
import { Theme, createStyles } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'

import "./styles.css";

const GRID = 4;
const ROW_HEIGHT = 45;
const OB_NAMES: OBSeqNames[] = [
    'metadata',
    'acquisition',
    'observations', 
    'target', 
    'common_parameters',
    'time_constraints',
    'status'
]
const METADATALESS = ['metadata', 'common_parameters', 'status', 'time_constraints']

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        droppableDragging: {
            background: theme.palette.divider,
            padding: GRID,
            minWidth: '450px'
        },
        droppable: {
            background: theme.palette.sucess,
            padding: GRID,
            minWidth: '450px'
        },
        accordian: {
            userSelect: "none",
            padding: GRID * 2,
            margin: `0 0 ${GRID}px 0`,
        },
        accordianDragging: {
            userSelect: "none",
            padding: GRID * 2,
            margin: `0 0 ${GRID}px 0`,
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
            minHeight: ROW_HEIGHT,
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

const parseOB = (ob: ObservationBlock): Partial<ObservationBlock> => {
    // return the components that will generate forms
    let forms: { [k: string]: any } = {}
    Object.keys(ob).forEach((componentName: string) => {
        if (OB_NAMES.indexOf(componentName as any) > -1) {
            if (componentName === 'observations') {
                const seq = ob.observations as any
                for (let idx = 0; idx < seq.length; idx++) {
                    const sn = JSON.stringify(seq[idx].metadata.sequence_number)
                    const sci_name = 'sequence ' + sn 
                    forms[sci_name] = seq[idx]
                }
            }
            else {
                forms[componentName] = ob[componentName as keyof ObservationBlock]
            }
        }
    })
    return forms
}


const createAccordianDiv = (provided, snapshot, key, formChild: JSX.Element, acc: any, handleDelete: Function) => {
    const className = snapshot.isDragging ? {...provided.draggableProps, ...acc.accDrag} : acc.acc
    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={className}
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

const create_draggable = (keyValue, index, updateOB, acc, handleDelete) => {
    const [key, component] = keyValue
    const form = createForm(key, component, updateOB)
    return (
        <Draggable
            key={key}
            draggableId={key}
            index={index}
        >
            {(provided, snapshot) => createAccordianDiv(provided, snapshot, key, form, acc, handleDelete)}
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
    let form
    if (id === 'common_parameters') {
        form = <CommonParametersTemplateForm id={id} updateOB={updateOB} obComponent={obComponent} />
    }
    else if (id === 'target') {
        form = <TargetTemplateForm id={id} updateOB={updateOB} obComponent={obComponent} />
    }
    else {
        form = <TemplateForm id={id} updateOB={updateOB} obComponent={obComponent} />
    }
    return form 
}

const updateOBScience = (seqName: string, ob: ObservationBlock, formData: OBSequence): ObservationBlock => {
    let newOb = { ...ob }
    //get science idx from name
    console.log('updating component', seqName, formData)
    const idx = JSON.parse(seqName.substring(seqName.indexOf('_') + 1))
    let seq = ob.observations as Science[]
    if (seq) {
        Object.entries(formData).forEach(([key, value]) => {
            seq[idx].parameters[key] = value
        })
        newOb.observations = seq
    }
    return newOb
}

const updateOBTimeConstraint = (ob: ObservationBlock, formData: any): ObservationBlock => {
    let newOb = { ...ob }
    let time_constraints = []
    formData['time_constraints'].forEach( timeConstraint => {
       time_constraints.push( [ timeConstraint.start_datetime, timeConstraint.end_datetime ] )
    })
    newOb['time_constraints'] = [ time_constraints ]
    return newOb
}

const updateOBComponent = (seqName: string, ob: ObservationBlock, formData: { [key: string]: any }): ObservationBlock => {
    let component = ob[seqName as keyof ObservationBlock] as OBComponent 

    if (METADATALESS.includes(seqName)) {
        component = formData
    }
    else {
        let params: { [key: string]: any } = component.parameters

        Object.entries(formData).forEach(([key, value]) => {
            params[key] = value
        })
        component.parameters = params
    }
    ob[seqName as keyof ObservationBlock] = component as OBComponent 
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

    React.useEffect(() => {
        //updates view after direct JSON edit 
        console.log(`JSON edited. resetting grid items`)
        const obComponents: Partial<ObservationBlock> = parseOB(props.ob)
        let obItems = Object.entries(obComponents)
        obItems = chunkify(obItems, nColumns, evenChunks)
        setState(() => obItems)
    }, [props.ob])

    const updateOB = (seqName: OBSeqNames, formData: OBSequence) => {
        if (Object.keys(formData).length > 0) {
            let newOb = { ...props.ob }
            //handle observations
            if (seqName.includes('sequence')) {
                newOb = updateOBScience(seqName, newOb, formData)
            }
            else if (seqName.includes('time_constraints')) {
                newOb = updateOBTimeConstraint(newOb, formData)
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

    const handleDelete = (name: string) => { 
        console.log('deleteing component:', name)

        let newOB = {...props.ob}
        if (name.includes('sequence')) {
            //find id
            const sequence_number = JSON.parse(name.split(' ')[1])
            //find and delete sequence from array
            let newSequences = props.ob.observations
            const idx = newSequences.findIndex( (s) => s.metadata.sequence_number === sequence_number)
            newSequences.splice(idx, 1)
            newOB.observations = newSequences
            props.setOB(newOB)
        }
        else {
            delete newOB[name]
            props.setOB(newOB)
        }
    }

    const acc = {acc: classes.accordian, accDrag: classes.accordianDragging}
    return (
        <div className={classes.root}>
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
                                        create_draggable(keyValue, index, updateOB, acc, handleDelete)
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