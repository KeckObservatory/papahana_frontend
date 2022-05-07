//@ts-nocheck
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import React from "react";
import { Theme, createStyles } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import {
    MetadataLessOBComponent,
    OBComponent,
    OBSeqNames,
    OBSequence,
    ObservationBlock,
    OBStandardComponent,
    Science,
    TimeConstraint,
} from './../../../typings/papahana'
import "./styles.css";
import { chunkify, reorder, move, create_draggable } from './dnd_helpers'

const GRID = 4;
const ROW_HEIGHT = 45;
const OB_NAMES: OBSeqNames[] = [
    'target',
    'metadata',
    'observations',
    'common_parameters',
    'time_constraints',
    'status',
    'acquisition',
]

const OB_COMPONENT_ORDER = {
 'target': 0,
 'common_parameters': 1,
 'metadata': 2,
 'time_constraints': 3,
 'status': 4,
 'observations': 5,
 'acquisition': 6,
}


const NOMINALLY_CLOSED_COMPONENT = ['time constraints', 'status', 'acquisition']
const METADATALESS = ['metadata', 'common_parameters', 'status', 'time_constraints']


interface AccordionClasses {
    acc: any,
    accDrag: any
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        droppableDragging: {
            background: theme.palette.divider,
            padding: GRID,
            minWidth: '300px',
            maxWidth: '450px'
        },
        droppable: {
            background: theme.palette.success,
            padding: GRID,
            minWidth: '300px',
            maxWidth: '450px'
        },
        accordion: {
            userSelect: "none",
            padding: GRID * 2,
            margin: `0 0 ${GRID}px 0`,
        },
        accordionDragging: {
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

const sort_forms = (inForms: Partial<ObservationBlock>) => {
    const keys = Object.keys(inForms)
    const ofArr = [] 
    const oCompKeys = Object.keys(OB_COMPONENT_ORDER)
    //create an array of [order, component] items 
    keys.forEach( (key: string) => {
        if (oCompKeys.includes(key)) {
            ofArr.push([OB_COMPONENT_ORDER[key], key, inForms[key]])
        }
        else {
            ofArr.push([999, key, inForms[key]])
        }
    })
    //sort array of [order, component] items
    ofArr.sort((a, b) => {
        if(a[0] > b[0]) return 1;
        if(a[0] < b[0]) return -1;
        return 0;
    })

    const sortedForms = {}
    //create sorted Array
    ofArr.forEach( (okf) => {
        const [order, key, form] = okf
        sortedForms[key] = form
    })
    return sortedForms
}

const parseOB = (ob: ObservationBlock): Partial<ObservationBlock> => {
    // return the components that will generate forms
    let forms: { [k: string]: unknown } = {}
    Object.keys(ob).forEach((componentName: string) => {
        if (OB_NAMES.indexOf(componentName as OBSeqNames) > -1) {
            if (componentName === 'observations') {
                const seq = ob.observations as Science[]
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
    forms = sort_forms(forms)
    return forms
}

const updateOBScience = (seqName: string, ob: ObservationBlock, formData: OBSequence): ObservationBlock => {
    let newOb = { ...ob }
    //get science idx from name
    console.log('updating component', seqName, formData)
    const sequence_number = JSON.parse(seqName.substring(seqName.indexOf(' ') + 1))
    let seq = ob.observations as Science[]
    const idx = seq.findIndex(x => { return x.metadata.sequence_number === sequence_number })

    console.log('seq_number', sequence_number, 'seq idx:', idx)
    if (seq) {
        Object.entries(formData).forEach(([key, value]) => {
            seq[idx].parameters[key] = value
        })
        newOb.observations = seq
    }
    return newOb
}

interface FormTimeConstraint {
    start_datetime: string
    end_datetime: string
}

const updateOBTimeConstraint = (ob: ObservationBlock, formData: OBSequence): ObservationBlock => {
    let newOB = { ...ob }
    let time_constraints: TimeConstraint[] = []
    formData['time_constraints'].forEach((timeConstraint: FormTimeConstraint) => {
        const ts = [timeConstraint.start_datetime, timeConstraint.end_datetime]
        time_constraints.push(ts as [string, string])
    })
    newOB['time_constraints'] = [time_constraints]
    return newOB
}

const updateOBCommonParameters = (ob: ObservationBlock, formData: OBSequence, subFormName: string) => {
    let newOB = { ...ob }
    // let newCommonParameters = { ...newOB['common_parameters'] }
    // newCommonParameters[subFormName] = formData
    // newOB['common_parameters'] = newCommonParameters

    newOB['common_parameters'][subFormName] = formData[subFormName]
    console.log('new common parameters for', subFormName, formData)
    return newOB
}

const updateOBComponent = (seqName: keyof ObservationBlock, ob: ObservationBlock, formData: { [key: string]: any }): ObservationBlock => {

    let component: OBComponent
    if (METADATALESS.includes(seqName)) {
        component = formData as MetadataLessOBComponent
    }
    else {
        component = ob[seqName] as OBStandardComponent
        let params: { [key: string]: any } = component.parameters

        Object.entries(formData).forEach(([key, value]) => {
            params[key] = value
        })
        component.parameters = params
    }
    ob[seqName] = component as any
    return ob as ObservationBlock
}

interface Props {
    triggerRender: number
    setTriggerRender: Function
    ob: ObservationBlock
    setOB: Function
}

export const OBBeautifulDnD = (props: Props) => {
    const classes = useStyles()
    const obComponents: Partial<ObservationBlock> = parseOB(props.ob)
    let obItems = Object.entries(obComponents)
    const nColumns = 3
    const evenChunks = true
    obItems = chunkify(obItems, nColumns, evenChunks) as any
    const [state, setState] = React.useState(obItems);

    React.useEffect(() => {
        console.log(`JSON edited. resetting grid items`)
        const obComponents: Partial<ObservationBlock> = parseOB(props.ob)
        let obItems = Object.entries(obComponents)
        obItems = chunkify(obItems, nColumns, evenChunks) as any
        setState(() => obItems)
    }, [props.triggerRender])

    const updateOB = (seqName: keyof ObservationBlock, formData: OBSequence, subFormName?: string) => {
        if (Object.keys(formData).length > 0) {
            let newOb = { ...props.ob }
            //handle observations
            if (seqName.includes('sequence')) {
                newOb = updateOBScience(seqName, newOb, formData)
            }
            else if (seqName.includes('time_constraints')) {
                newOb = updateOBTimeConstraint(newOb, formData)
            }
            else if (subFormName) { //common parameters
                newOb = updateOBCommonParameters(newOb, formData, subFormName)
            }
            else {
                newOb = updateOBComponent(seqName, newOb, formData)
            }
            props.setOB(newOb)
        }
    }

    const onDragEnd = (result: any) => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(state[sInd], source.index, destination.index) as any;
            const newState = [...state];
            newState[sInd] = items;
            setState(() => newState);
        } else {
            const result = move(state[sInd], state[dInd], source, destination) as any;
            const newState = [...state];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];
            setState(() => newState.filter(group => group.length));
        }
    }

    const handleDelete = (name: string) => {
        console.log('deleteing component:', name)

        let newOB = { ...props.ob }
        if (name.includes('sequence')) {
            //find id
            const sequence_number = JSON.parse(name.split(' ')[1])
            //find and delete sequence from array
            let newSequences = props.ob.observations
            const idx = newSequences?.findIndex((s) => s.metadata.sequence_number === sequence_number)
            newSequences?.splice(idx as number, 1)
            newOB.observations = newSequences
        }
        else {
            delete newOB[name as keyof ObservationBlock]
        }
        props.setOB(newOB)
        props.setTriggerRender(props.triggerRender + 1)
    }

    const acc: AccordionClasses = { acc: classes.accordion, accDrag: classes.accordionDragging }
    return (
        <div className={classes.root}>
            <div style={{ display: "flex" }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {state.map((keyValueArr: any[], ind: number) => (
                        <Droppable key={ind} droppableId={`${ind}`}>
                            {(provided, snapshot) => (
                                <div
                                    className={snapshot.isDraggingOver ? classes.droppableDragging : classes.droppable}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {keyValueArr.map((keyValue: [string, unknown], index: number) => (
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