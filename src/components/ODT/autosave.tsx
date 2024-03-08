import React, { useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import {  OBMetadata, ObservationBlock } from "../../typings/papahana";
import { TemplateSchemas, schema_templates_match_ob, get_template_schemas, useOBContext } from "./observation_data_tool_view";
import AJV2019 from 'ajv/dist/2019'
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


const create_ob_schema = (obMetadata: OBMetadata, templateSchemas: TemplateSchemas) => {
    const properties: { [key: string]: JSONSchema7 } = {}
    const simpleObjects = ['metadata', 'status']
    for (let idx = 0; idx < Object.keys(templateSchemas).length; idx++) {
        const key = Object.keys(templateSchemas)[idx]
        const schema = templateSchemas[key][0].properties as { [key: string]: JSONSchema7Definition }
        if (simpleObjects.includes(key)) {
            properties[key] = schema
        }
        else {
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
    }

    const newSchema: JSONSchema7 = {
        ...OB_SCHEMA_BASE,
        properties: properties,
        required: obMetadata?.ob_type?.includes("Science") ?
            ['metadata', 'status', 'acquisition', 'target'] : OB_SCHEMA_BASE.required
    }
    console.log('ob_context.templateSchemas', templateSchemas, 'newSchema', newSchema)
    return newSchema
}

export const Autosave = () => {

    const ob_context = useOBContext()
    const ajv = new AJV2019({ allErrors: true, strict: false })
    addFormats(ajv)
    const saveToLocalStorage = (ob: ObservationBlock) => {
        window.localStorage.setItem('OB', JSON.stringify(ob));
    }



    useEffect(() => {
        Object.keys(ob_context.ob ?? {}).length > 0 && debouncedValidate(ob_context.ob)
    }, [ob_context.templateSchemas, ob_context.ob])

    useEffect(() => {
        Object.keys(ob_context.ob ?? {}).length > 0 && debouncedSave(ob_context.ob)
    },
        [ob_context.ob])

    const debouncedSave = useCallback(
        debounce(async (ob) => {
            // ob_context.triggerBoop(false) // TODO: reset boop on save
            if (IS_PRODUCTION) {
                // ob_api_funcs.put(ob._id, ob) //TODO: uncomment when the SAs come around
                await saveToLocalStorage(ob)
            }
            else {
                await saveToLocalStorage(ob)
            }
        }, DEBOUNCE_SAVE_DELAY),
        [ob_context.ob]
    )

    const validate = (ob: ObservationBlock, schema: JSONSchema7) => {
        const parsedOB = parseOB(ob)
        const newValidate = ajv.compile(schema)
        newValidate(parsedOB)
        return newValidate.errors
    }

    const debouncedValidate = useCallback(
        debounce(async (ob: ObservationBlock) => {
            try {
                // const newOBSchema = create_ob_schema(ob.metadata, ob_context.templateSchemas)
                if (!schema_templates_match_ob(ob, ob_context.templateSchemas)) {
                    console.log('AHHHHH!!!!', 'parsed ob', parseOB(ob), 'ob_context.templateSchemas', ob_context.templateSchemas)
                } 
                else {
                    const os = create_ob_schema(ob.metadata, ob_context.templateSchemas)
                    const errors = validate(ob, os)

                    console.log('validating', validate, 'errors', errors, 'ob', ob_context.ob, 'ob schema', os)
                    ob_context.setErrors(errors ?? [])
                }
            }
            catch (err) {
                console.error('error validating ob', err)
            }
        }, 3000),
        [ob_context.ob, ob_context.templateSchemas ]
        // []
    )


    return null
}