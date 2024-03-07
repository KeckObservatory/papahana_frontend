import React, { useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import { Metadata, OBMetadata, ObservationBlock } from "../../typings/papahana";
import { ob_api_funcs } from './../../api/ApiRoot';
import { useOBContext } from "./observation_data_tool_view";
import AJV2019, { ValidateFunction } from 'ajv/dist/2019'
// import AJV, { ValidateFunction } from 'ajv'
import addFormats from "ajv-formats";
import { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import { parseOB } from "./sequence_grid/ob_form_beautiful_dnd";

const DEBOUNCE_SAVE_DELAY = 2000;
const IS_PRODUCTION: boolean = process.env.REACT_APP_ENVIRONMENT === 'production'

const OB_SCHEMA_BASE: JSONSchema7 = {
    title: "Observation Block",
    required: ['metadata', 'status'],
    type: "object",
    properties: {},
    additionalProperties: true
}

export const Autosave = () => {

    const ob_context = useOBContext()
    const ajv = new AJV2019({ allErrors: true, strict: false })
    addFormats(ajv)
    const saveToLocalStorage = (ob: ObservationBlock) => {
        window.localStorage.setItem('OB', JSON.stringify(ob));
    }

    const updateDatabaseOB = (ob: ObservationBlock) => {
        ob_api_funcs.put(ob._id, ob)
    }

    const debouncedSave = useCallback(
        debounce(async (newOB) => {
            try {
                const val = validate(newOB)
                console.log('errors', val?.errors, 'ob', ob_context.ob)
                ob_context.setErrors(val?.errors ?? [])
            }
            catch (err)  {
                console.error('error validating ob', err)
            }
            if (IS_PRODUCTION) {
                updateDatabaseOB(newOB) //todo: decide to keep this
                await saveToLocalStorage(newOB)
            }
            else {
                await saveToLocalStorage(newOB)
            }
        }, DEBOUNCE_SAVE_DELAY),
        []
    )

    const create_ob_schema = (obMetadata: OBMetadata) => {
        const properties: { [key: string]: JSONSchema7 } = {}
        // for (const [name, schemas] of Object.entries(ob_context.obSchema)) {
        for (let idx = 0; idx < Object.keys(ob_context.obSchema).length; idx++) {
            const key = Object.keys(ob_context.obSchema)[idx]
            const schema = ob_context.obSchema[key][0].properties as { [key: string]: JSONSchema7Definition }
            console.log('key', key, 'schema', schema)
            properties[key] = { 
             title: key,
             type: 'object',
             properties: {
                metadata: {
                    title: 'metadata',
                    type: 'object'
                },
                parameters: {
                    title: 'parameters',
                    type: 'object',
                    properties: schema
                },
                }
            }
        }
        const newSchema = {
            ...OB_SCHEMA_BASE,
            properties: properties,
            required: obMetadata?.ob_type?.includes("Science") ? 
            ['metadata', 'status', 'acquisition', 'target'] : OB_SCHEMA_BASE.required
        }
        console.log('ob_context.obSchema', ob_context.obSchema, 'newSchema', newSchema)
        return newSchema

    }

    const validate = useCallback( (ob: ObservationBlock) => {
        if (ob_context.ob) {
            const parsedOB = parseOB(ob)
            const obSchema = create_ob_schema(ob.metadata) 
            const newValidate = ajv.compile(obSchema)
            newValidate(parsedOB)
            console.log('errors', newValidate.errors, 'parsedOB', parsedOB)
            ob_context.setErrors(newValidate.errors ?? [])
            return newValidate
        }
    }, [ob_context.obSchema])

    useEffect(() => {
        ob_context.ob !== undefined && debouncedSave(ob_context.ob)
    },
        [ob_context.ob, debouncedSave] )

    return null
}