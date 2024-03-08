import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import React from "react";
import {
    MetadataLessOBComponent,
    OBComponent,
    OBSeqs,
    OBSequence,
    ObservationBlock,
    OBStandardComponent,
    Science,
} from './../../../typings/papahana'
import "./styles.css";
import { chunkify, reorder, move, create_draggable } from './dnd_helpers'
import { schema_templates_match_ob, useOBContext } from '../observation_data_tool_view';
import useBoop from '../../../hooks/boop';

const OB_NAMES: string[] = [
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

const sort_forms = (inForms: Partial<ObservationBlock>) => {
    const keys = Object.keys(inForms)
    const ofArr: any = []
    const oCompKeys = Object.keys(OB_COMPONENT_ORDER)
    //create an array of [order, component] items 
    keys.forEach((key: string) => {
        if (oCompKeys.includes(key)) {
            // @ts-ignore
            ofArr.push([OB_COMPONENT_ORDER[key], key, inForms[key]])
        }
        else {
            // @ts-ignore
            ofArr.push([999, key, inForms[key]])
        }
    })
    //sort array of [order, component] items
    ofArr.sort((a: number[], b: number[]) => {
        if (a[0] > b[0]) return 1;
        if (a[0] < b[0]) return -1;
        return 0;
    })

    const sortedForms = {}
    //create sorted Array
    ofArr.forEach((okf: any) => {
        const [order, key, form] = okf
        //@ts-ignore
        sortedForms[key] = form
    })
    return sortedForms
}

export const parseOB = (ob: ObservationBlock) => {
    // return the components that will generate forms
    let forms: { [k: string]: Exclude<OBSeqs, Science[]> | Science } = {}
    Object.keys(ob).forEach((componentName) => {
        if (OB_NAMES.includes(componentName)) {
            if (componentName === 'observations') {
                const seq = ob.observations as Science[]
                for (let idx = 0; idx < seq.length; idx++) {
                    const sn = JSON.stringify(seq[idx].metadata.sequence_number)
                    const sci_name = 'sequence ' + sn
                    forms[sci_name as any] = seq[idx]
                }
            }
            else if (componentName !== 'time_constraints') {
                forms[componentName] = ob[componentName as keyof OBSeqs]
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

const updateOBCommonParameters = (ob: ObservationBlock, formData: OBSequence, subFormName: string) => {
    let newOB = { ...ob }
    // @ts-ignore
    newOB['common_parameters'][subFormName] = formData[subFormName]
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
}

export const OBBeautifulDnD = (props: Props) => {
    const ob_context = useOBContext()
    const obComponents = parseOB(ob_context.ob)
    let obItems = Object.entries(obComponents)
    const nColumns = 3
    const evenChunks = true
    const [boopStyle, triggerBoop] = useBoop({})
    const obItemChunks = chunkify(obItems, nColumns, evenChunks)
    const [state, setState] = React.useState(obItemChunks);
    React.useEffect(() => {
        console.log(`JSON edited. resetting grid items`)
        const obComponents: Partial<ObservationBlock> = parseOB(ob_context.ob)
        let obItems = Object.entries(obComponents)
        obItems = chunkify(obItems, nColumns, evenChunks) as any
        setState(() => obItemChunks)
    }, [props.triggerRender])


    const updateOB = (seqName: keyof ObservationBlock, formData: OBSequence, subFormName?: string) => {
        if (Object.keys(formData).length > 0) {
            let newOb = { ...ob_context.ob }
            //handle observations
            if (seqName.includes('sequence')) {
                newOb = updateOBScience(seqName, newOb, formData)
            }
            else if (subFormName) { //common parameters
                newOb = updateOBCommonParameters(newOb, formData, subFormName)
            }
            else {
                newOb = updateOBComponent(seqName, newOb, formData)
            }
            triggerBoop(true)
            ob_context.setOB(newOb)
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
            // setState(() => newState);
        } else {
            const result = move(state[sInd], state[dInd], source, destination) as any;
            const newState = [...state];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];
            // setState(() => newState.filter(group => group.length));
        }
    }

    const handleDelete = (name: string) => {
        console.log('deleteing component:', name)

        let newOB = { ...ob_context.ob }
        if (name.includes('sequence')) {
            //find id
            const sequence_number = JSON.parse(name.split(' ')[1])
            //find and delete sequence from array
            let newSequences = ob_context.ob.observations
            const idx = newSequences?.findIndex((s) => s.metadata.sequence_number === sequence_number)
            newSequences?.splice(idx as number, 1)
            newOB.observations = newSequences
        }
        else {
            delete newOB[name as keyof ObservationBlock]
        }
        ob_context.setOB(newOB)
        props.setTriggerRender(props.triggerRender + 1)
    }

    const acc: AccordionClasses = {
        acc: {
            userSelect: "none",
            padding: '8px',
            margin: '0 0 4px 0',
        },
        accDrag: {
            userSelect: "none",
            padding: '8px',
            margin: '0 0 4px 0',
        }
    }

    const droppables = state.map((keyValueArr, ind: number) => {
        const templatesMatchOB = schema_templates_match_ob(ob_context.ob, ob_context.templateSchemas)
        return (<Droppable key={ind} droppableId={`${ind}`}>
            {(provided, snapshot) => {
                const draggables: JSX.Element[] = []
                templatesMatchOB && keyValueArr.forEach(async (keyValue, index: number) => {
                    const [componentName, _] = keyValue
                    try {
                    const [schema, uiSchema] = ob_context.templateSchemas[componentName]
                    // @ts-ignore
                    schema && draggables.push(create_draggable(keyValue, index, updateOB, acc, handleDelete, schema, uiSchema))
                    }
                    catch (err) {
                        console.log('error', err, componentName, ob_context.templateSchemas)
                    }
                    
                })
                return (<div
                    style={snapshot.isDraggingOver ? {
                        padding: '4px',
                        minWidth: '300px',
                        maxWidth: '450px'
                    }
                        :
                        {
                            padding: '4px',
                            minWidth: '300px',
                            maxWidth: '450px'
                        }
                    }
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {draggables}
                    {provided.placeholder}
                </div>)
            }}
        </Droppable>)
    })

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <div style={{ display: "flex" }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {droppables}
                </DragDropContext>
            </div>
        </div>
    );
}