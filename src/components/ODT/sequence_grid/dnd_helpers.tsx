import TemplateForm from '../../forms/template_form';
import { JSONSchema7 } from 'json-schema'
import { UiSchema } from "react-jsonschema-form";
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'
import TargetTemplateForm from '../../forms/target_template_form';
import CommonParametersTemplateForm from '../../forms/common_parameters_template_form';
import { AccordionForm } from './accordion_form';
import {
    CommonParameters,
    OBComponent,
} from './../../../typings/papahana'
import { AccordionClasses } from '@mui/material/Accordion/accordionClasses';

export const reorder = (list: Array<unknown>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const NOMINALLY_OPEN = ['metadata', 'target']

/**
 * Moves an item from one list to another list.
 */
export const move = (source: unknown[], destination: unknown[], droppableSource: any, droppableDestination: any) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: { [key: string]: unknown } = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};


export const createAccordianDiv = (provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
    key: string,
    formChild: JSX.Element,
    acc: AccordionClasses,
    handleDelete: Function,
    expanded?: boolean) => {
    //@ts-ignore
    const style = snapshot.isDragging ? { ...provided.draggableProps, ...acc.accDrag } : acc.acc
    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={style}
        >
            <AccordionForm
                name={key}
                id={key}
                handleDelete={handleDelete}
                expanded={expanded}
            >
                {formChild}
            </AccordionForm>
        </div>
    )
}

export const createForm = (id: string, 
    obComponent: OBComponent, 
    updateOB: Function,
    schema: JSONSchema7,
    uiSchema: UiSchema ): JSX.Element => {
    const params = {id:id, schema:schema, uiSchema:uiSchema, updateOB:updateOB, obComponent:(obComponent as CommonParameters)}
    let form: JSX.Element
    if (id === 'common_parameters') {
        form = <CommonParametersTemplateForm {...params} />
    }
    else if (id === 'target') {
        form = <TargetTemplateForm {...params} />
    }
    else {
        form = <TemplateForm {...params} />
    }
    return form
}

export const create_draggable = (keyValue: [string, OBComponent],
    index: number,
    updateOB: Function,
    acc: AccordionClasses,
    handleDelete: Function,
    schema: JSONSchema7,
    uiSchema: UiSchema ): JSX.Element => {
    const [key, component] = keyValue
    const expanded = NOMINALLY_OPEN.includes(key)
    const form = createForm(key, component, updateOB, schema, uiSchema)
    return (
        <Draggable
            key={key}
            draggableId={key}
            index={index}
        >
            {
                (provided, snapshot) =>
                    createAccordianDiv(provided, snapshot, key, form, acc, handleDelete, expanded)
            }
        </Draggable>
    )
}

export const chunkify = (a: [string, unknown][], n: number, balanced: boolean) => {
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